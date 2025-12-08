import { Request, Response } from "express";
import { vehiclesServices } from "../services/vehicles.services.js";



const createVehicle = async (req: Request, res: Response) => {
    const body = req.body;
    try {
        const result = await vehiclesServices.createVehicle(body);
        res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


const getAllVehicles = async (req: Request, res: Response) => {
    try {
        const result = await vehiclesServices.getAllVehicles();
        res.status(200).json({
            success: true,
            message: "Vehicles retrieved successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


const getVehicle = async (req: Request, res: Response) => {
    const id = Number(req.params.vehicleId);
    console.log("Fetching vehicle with ID:", id);
    try {
        const vehicle = await vehiclesServices.getVehiclebyId(id);
        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "vehicle retrieved successfully",
            data: vehicle,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

const updateVehicle = async (req: Request, res: Response) => {
    const id = Number(req.params.vehicleId);
    const body = req.body;
    try {
        const result = await vehiclesServices.updateVehicle(id, body);
        res.status(200).json({
            success: true,
            message: "Vehicle updated successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        })

    }
};

const deleteVehicle = async (req: Request, res: Response) => {
    const id = Number(req.params.vehicleId);
    try {
        const result = await vehiclesServices.deleteVehicle(id);
        if (result?.rowCount) {
            res.status(200).json({
                success: true,
                message: "Vehicle deleted successfully"
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Can not be deleted! This vehicle is booked!"
            })
        }

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};




export const vehiclesController = {
    createVehicle,
    getAllVehicles,
    getVehicle,
    updateVehicle,
    deleteVehicle
};