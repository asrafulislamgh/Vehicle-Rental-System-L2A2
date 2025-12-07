import express, { Request, Response } from "express";
import initDB from "./config/db.js";
import { userRoutes } from "./modules/users/routes/user.routes.js";
import { authRoutes } from "./modules/auth/auth.route.js";
import { vehiclesRoutes } from "./modules/vehicles/routes/vehicles.routes.js";


const app = express();
app.use(express.json());


initDB().catch((err) => {
    console.error("Error initializing database:", err);
    process.exit(1);
});

app.use("/api/v1/users", userRoutes);

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/vehicles", vehiclesRoutes)


export default app;