import { pool } from "../../../config/db.js";


const createVehicle = async (payload: Record<string, unknown>) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;
    const result = await pool.query(`
        INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
        VALUES ($1, $2, $3, $4, $5) RETURNING *
    `, [vehicle_name, type, registration_number, daily_rent_price, availability_status]);
    return result.rows[0];
}

const getAllVehicles = async () => {
    const result: any = await pool.query("SELECT * FROM vehicles");
    const filteredResult = result.rows.map(({ created_at, ...rest }: any) => rest);
    return filteredResult;
}


const getVehiclebyId = async (id: number) => {
    const result = await pool.query(`
        SELECT * FROM vehicles WHERE id = $1
    `, [id]);
    const { created_at, ...rest } = result.rows[0]
    const filteredResult = rest;
    return filteredResult;
}

const updateVehicle = async (id: number, payload: Record<string, unknown>) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;
    const result = await pool.query(`
        UPDATE vehicles
        SET vehicle_name = $1,
            type = $2,
            registration_number = $3,
            daily_rent_price = $4,
            availability_status = $5
            WHERE id = $6 RETURNING *
    `, [vehicle_name, type, registration_number, daily_rent_price, availability_status, id]
    );
    const { created_at, ...rest } = result.rows[0]
    const filteredResult = rest;
    return filteredResult;
}

const deleteVehicle = async (id: number) => {
    const result = await pool.query(`
        DELETE FROM vehicles WHERE id = $1 RETURNING *
    `, [id]);
    return result;
}


export const vehiclesServices = {
    createVehicle,
    getAllVehicles,
    getVehiclebyId,
    updateVehicle,
    deleteVehicle
};