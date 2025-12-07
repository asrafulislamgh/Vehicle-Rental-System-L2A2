
import { Pool } from "pg";
import config from "./index.js";

export const pool = new Pool({
    connectionString: config.connectionString,
});

const initDB = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(100) NOT NULL CHECK (LENGTH(password) >= 6),
            phone VARCHAR(15) NOT NULL,
            role VARCHAR(20) NOT NULL CHECK (role IN ('customer', 'admin')),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles (
            id SERIAL PRIMARY KEY,
            vehicle_name VARCHAR(100) NOT NULL,
            type VARCHAR(20) NOT NULL CHECK (type IN ('car', 'bike', 'van', 'SUV')),
            registration_number VARCHAR(50) UNIQUE NOT NULL,
            daily_rent_price NUMERIC(10, 2) NOT NULL CHECK (daily_rent_price > 0),
            availability_status VARCHAR(20) NOT NULL CHECK (availability_status IN ('available', 'booked')),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS bookings (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE CASCADE,
            rent_start_date TIMESTAMP WITH TIME ZONE NOT NULL,
            rent_end_date TIMESTAMP WITH TIME ZONE NOT NULL CHECK (rent_end_date > rent_start_date),
            total_price NUMERIC(10, 2) NOT NULL CHECK (total_price > 0),
            status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'cancelled', 'returned')),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    `);
};


export default initDB;