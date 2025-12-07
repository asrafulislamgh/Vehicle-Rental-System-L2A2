import jwt, { Jwt, JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import config from "../config/index.js";

const auth = (...rest: any[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            console.log("Auth Token:", token);
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized: No token provided",
                });
            }
            const decodedToken = jwt.verify(token, config.secretKey as string);
            req.user = decodedToken as JwtPayload;

            if (rest.length && !rest.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden: You do not have access to this resource",
                });
            }

            next();
        } catch (error) {
            res.status(401).json({
                success: false,
                message: "Unauthorized: Invalid token",
            });
        }
    }
};
export default auth;