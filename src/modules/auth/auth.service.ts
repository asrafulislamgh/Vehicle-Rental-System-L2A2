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

export const authServices = {
    signin,
};
