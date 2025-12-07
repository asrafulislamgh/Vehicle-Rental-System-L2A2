import { Request, Response } from "express";
import { authServices } from "./auth.service.js";

const signin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const result = await authServices.signin(email, password);
        if (!result) {
            res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                token: result.token,
                user: result.user,
            },
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const signup = async (req: Request, res: Response) => {
};

export const authController = {
    signin,
    signup,
};