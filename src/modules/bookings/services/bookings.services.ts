import { pool } from "../../../config/db.js";
import { Status } from "../../../constants/constants.js";


const createBooking = async (payload: Record<string, unknown>) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;
    let total_price = await total_price_calculator(vehicle_id as string, rent_start_date, rent_end_date);
    const result = await pool.query(`
       INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
       `, [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, Status.active]);
    updateVehiclaeStatus(vehicle_id as string, 'booked');
    const { created_at, ...rest } = result.rows[0]
    const filteredResult = rest;
    return filteredResult;
}

const getAllBookings = async () => {
    const result: any = await pool.query("SELECT * FROM bookings");
    const filteredResult = result.rows.map(({ created_at, ...rest }: any) => rest);
    return filteredResult;
}


const getBookingbyId = async (id: number) => {
    const result = await pool.query(`
        SELECT * FROM bookings WHERE id = $1
    `, [id]);
    const { created_at, ...rest } = result.rows[0]
    const filteredResult = rest;
    return filteredResult;
}

const updateBooking = async (id: number, status: string) => {
    const result = await pool.query(`
        UPDATE bookings
        SET status = $1 WHERE id = $2 RETURNING *
    `, [status, id]
    );
    if (status === 'cancelled' || status === 'returned') {
        await updateVehiclaeStatus(result.rows[0].vehicle_id as string, 'available');
    };
    let vehicle_info = {};
    if (status === 'returned') {
        const vehicle_result = await pool.query(`
            SELECT * FROM vehicles WHERE id = $1
        `, [result.rows[0].vehicle_id]);
        const { availability_status } = vehicle_result.rows[0];
        vehicle_info = { availability_status }
    }


    const { created_at, ...rest } = result.rows[0]
    const filteredResult = rest;
    return { filteredResult, vehicle_info };
}

const deleteBooking = async (id: number) => {
    const result = await pool.query(`
        DELETE FROM bookings WHERE id = $1 RETURNING *
    `, [id]);
    return result;
}

const total_price_calculator = async (vehicle_id: string, rent_start_date: any, rent_end_date: any) => {
    const queryResult = await pool.query(`
        SELECT daily_rent_price, availability_status  FROM vehicles WHERE id = $1
    `, [vehicle_id]);
    const daily_rent_price = queryResult.rows[0].daily_rent_price;
    const availability_status = queryResult.rows[0].availability_status;

    if (availability_status !== 'available') {
        throw new Error('Vehicle is not available for booking');
    }
    let total_price = 0;
    const start_date = new Date(rent_start_date as string);
    const end_date = new Date(rent_end_date as string);
    const timeDiff = end_date.getTime() - start_date.getTime();
    const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    total_price = dayDiff * daily_rent_price;
    return total_price;
}
const updateVehiclaeStatus = async (vehicle_id: string, status: string) => {
    const result = await pool.query(`
        UPDATE vehicles SET availability_status = $1 WHERE id = $2
    `, [status, vehicle_id]);
    return result;
}


export const bookingsServices = {
    createBooking,
    getAllBookings,
    getBookingbyId,
    updateBooking,
    deleteBooking
};