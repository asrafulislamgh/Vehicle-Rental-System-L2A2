import express, { Request, Response } from "express";
import initDB from "./config/db.js";
import { userRoutes } from "./modules/users/routes/user.routes.js";
import { authRoutes } from "./modules/auth/auth.route.js";
import { vehiclesRoutes } from "./modules/vehicles/routes/vehicles.routes.js";
import { bookingsRoutes } from "./modules/bookings/routes/bookings.routes.js";


const app = express();
app.use(express.json());


initDB().catch((err) => {
    console.error("Error initializing database:", err);
    process.exit(1);
});

app.use("/api/v1/users", userRoutes);

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/vehicles", vehiclesRoutes)

app.use("/api/v1/bookings", bookingsRoutes)

app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: "Route not found. Please check the URL."
    });
});


export default app;