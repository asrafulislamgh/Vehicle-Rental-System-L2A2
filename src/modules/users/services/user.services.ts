import { pool } from "../../../config/db.js";

const getAllusers = async () => {
    const result: any = await pool.query("SELECT * FROM users");
    const filteredResult = result.rows.map(({ password, created_at, ...rest }: any) => rest);
    return filteredResult;
}

const createUser = async (payload: Record<string, unknown>) => {
    const { name, email, password, phone, role } = payload;
    const result =
        await pool.query(
            `INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [name, email, password, phone, role]
        );
    return result;
}

const getUserbyId = async (id: number) => {
    const result = await pool.query(`
        SELECT * FROM users WHERE id = $1
    `, [id]);
    return result.rows[0];
}

const updateUser = async (id: number, payload: Record<string, unknown>) => {
    const { name, email, phone, role } = payload;
    const result = await pool.query(`
        UPDATE users SET name = $1, email = $2, phone = $3, role = $4 WHERE id = $5 RETURNING *
    `, [name, email, phone, role, id]);
    const { password, created_at, ...rest } = result.rows[0]
    const filteredResult = rest;
    return filteredResult;
}

const deleteUser = async (id: number) => {
    const result = await pool.query(`
        DELETE FROM users WHERE id = $1 RETURNING *
    `, [id]);
    return result;
}


export const userServices = {
    getAllusers,
    createUser,
    getUserbyId,
    updateUser,
    deleteUser
};