import { Request, Response } from "express";
import { bookingsServices } from "../services/bookings.services.js";



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
        });
    }
}


const getAllBookings = async (req: Request, res: Response) => {
    try {
        const result = await bookingsServices.getAllBookings();
        res.status(200).json({
            success: true,
            message: "Booking retrieved successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
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
        });
    }
}

const updateBooking = async (req: Request, res: Response) => {
    const id = Number(req.params.bookingId);
    const { status } = req.body;
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