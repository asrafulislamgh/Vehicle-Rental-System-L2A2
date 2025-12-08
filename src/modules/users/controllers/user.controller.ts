import { Request, Response } from "express";
import { pool } from "../../../config/db.js";
import { userServices } from "../services/user.services.js";


const getAllUsers = async (req: Request, res: Response) => {
    try {
        const result = await userServices.getAllusers();
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


const getUserbyId = async (req: Request, res: Response) => {
    const id = Number(req.params.userId);
    console.log("Fetching user with ID:", id);
    try {
        const user = await userServices.getUserbyId(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "User retrieved successfully",
            data: user,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

const updateUser = async (req: Request, res: Response) => {
    const id = Number(req.params.userId);
    const body = req.body;
    try {
        const result = await userServices.updateUser(id, body);
        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        })

    }
};

const deleteUser = async (req: Request, res: Response) => {
    const id = Number(req.params.userId);
    try {
        const result = await userServices.deleteUser(id);
        if (result?.rowCount) {
            res.status(200).json({
                success: true,
                message: "User deleted successfully"
            });
        } else {
            res.status(400).json({
                success: false,
                message: "User can not be deleted as the user has an active booking."
            })
        }

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};




export const userController = {
    getAllUsers,
    getUserbyId,
    updateUser,
    deleteUser
};