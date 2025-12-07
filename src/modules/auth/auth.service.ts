import bcrypt from "bcryptjs";
import { pool } from "../../config/db.js"
import jwt from "jsonwebtoken";
import config from "../../config/index.js";

const signin = async (email: string, password: string) => {
    const result = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
    );
    const user = result.rows[0];
    if (!user) {
        return null
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return null
    }
    const payload = { id: user.id, email: user.email, role: user.role };
    const token = jwt.sign(payload, config.secretKey as string, { expiresIn: '7d' });
    return { token, user: payload };

}

const signup = async (payload: Record<string, unknown>) => {
    const { name, email, password, phone, role } = payload;
    const hashedPassword = await bcrypt.hash(password as string, 10);
    const result =
        await pool.query(
            `INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [name, email, hashedPassword, phone, role]
        );
    return result;
}

export const authServices = {
    signin,
    signup
};
