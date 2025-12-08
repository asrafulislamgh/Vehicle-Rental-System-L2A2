import { Request, Response } from "express";
import { bookingsServices } from "../services/bookings.services.js";
import { Role, Status } from "../../../constants/constants.js";



const createBooking = async (req: Request, res: Response) => {
    const body = req.body;
    try {
        const result = await bookingsServices.createBooking(body);
        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: result,
        });
    } catch (error: any) {
        console.error("Error creating booking:", error);
        res.status(500).json({
            success: false,
            message: error.message,
            errors: error
        });
    }
}


const getAllBookings = async (req: Request, res: Response) => {
    try {
        const role = req.user?.role;
        const userId = req.user?.id;
        const result = await bookingsServices.getAllBookings();
        console.log("result", result)
        let filtered;
        if (role === "admin") {
            filtered = result.map((b: any) => ({
                id: b.id,
                customer_id: b.customer_id,
                vehicle_id: b.vehicle_id,
                rent_start_date: b.rent_start_date,
                rent_end_date: b.rent_end_date,
                total_price: b.total_price,
                status: b.status,
                customer: {
                    name: b.customer_name,
                    email: b.customer_email
                },
                vehicle: {
                    vehicle_name: b.vehicle_name,
                    registration_number: b.registration_number
                }

            }))
        } else {
            const customerBookings = result.filter((b: any) => b.customer_id === userId);
            filtered = customerBookings.map((b: any) => ({
                id: b.id,
                vehicle_id: b.vehicle_id,
                rent_start_date: b.rent_start_date,
                rent_end_date: b.rent_end_date,
                total_price: b.total_price,
                status: b.status,
                vehicle: {
                    vehicle_name: b.vehicle_name,
                    registration_number: b.registration_number,
                    type: b.vehicle_type
                }
            }));
        }
        res.status(200).json({
            success: true,
            message: "Booking retrieved successfully",
            data: filtered,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            errors: error
        });
    }
}


const getBooking = async (req: Request, res: Response) => {
    const id = Number(req.params.bookingId);
    console.log("Fetching Booking with ID:", id);
    try {
        const booking = await bookingsServices.getBookingbyId(id);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Booking retrieved successfully",
            data: booking,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            errors: error
        });
    }
}

const updateBooking = async (req: Request, res: Response) => {
    const id = Number(req.params.bookingId);
    const role = req.user?.role
    const { status } = req.body;
    if (role === Role.customer && status === Status.returned) {
        return res.status(403).json({
            success: false,
            message: "Customers can only cancel bookings. Only admins can mark as returned."
        })
    }
    if (![Status.cancelled, Status.returned].includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid status. Only 'cancelled' or 'returned' allowed."
        });
    }
    if (role === Role.admin && status === Status.cancelled) {
        return res.status(403).json({
            success: false,
            message: "Admin can only return bookings. Only customer can mark as cancelled."
        })
    }
    try {
        const result = await bookingsServices.updateBooking(id, status);
        const vehicle_info = result.vehicle_info;
        res.status(200).json({
            success: true,
            message: status === 'cancelled' ? "Booking cancelled successfully" : "Booking returned successfully",
            data: status === 'cancelled' ? { ...result.filteredResult, status: 'cancelled' } : { ...result.filteredResult, status: 'returned', vehicle: { ...vehicle_info } },
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            errors: error
        })

    }
};

const deleteBooking = async (req: Request, res: Response) => {
    const id = Number(req.params.bookingId);
    try {
        const result = await bookingsServices.deleteBooking(id);
        res.status(200).json({
            success: true,
            message: "Booking deleted successfully"
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            errors: error
        });
    }
};




export const bookingsController = {
    createBooking,
    getAllBookings,
    getBooking,
    updateBooking,
    deleteBooking
};