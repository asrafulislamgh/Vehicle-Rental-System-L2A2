import express, { Request, Response } from "express";
import { Pool } from "pg";
import config from "./config/index.js";
import initDB from "./config/db.js";
import { userRoutes } from "./modules/users/routes/user.routes.js";


const app = express();
const PORT = config.port;
app.use(express.json());


initDB().catch((err) => {
    console.error("Error initializing database:", err);
    process.exit(1);
});

app.use("/api/v1/users", userRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
