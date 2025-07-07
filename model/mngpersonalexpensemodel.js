console.log("mngperexpmodel.js is running");
const db = require('../db'); // Import the database connection

class Personalexp {
    // Fetch all users from tbl_user
    static async getAll() {
        try {
            const conn = await db.getConnection(); // Get DB connection
            const [data] = await conn.query('SELECT * FROM tbl_personal_exp'); // Fetch data
            console.log("Data:", data); // Debugging log
            conn.release(); // Release connection
            return data; // Return fetched user data
        } catch (error) {
            console.error("Error fetching expenses:", error);
            throw error; // Throw error to handle in controller
        }
    }

    static async createExpense(userData) {
        const {date, description, amount, remarks } = userData;

        try {
            const conn = await db.getConnection(); // Get DB connection
            const sql = `INSERT INTO tbl_personal_exp (date, description, amount, remarks) 
                         VALUES (?, ?, ?, ?)`;
            await conn.query(sql, [date, description, amount, remarks]);
            conn.release(); // Release connection
        } catch (error) {
            console.error("Error inserting expenses:", error);
            throw error;
        }
    }

    static async updateExpense(nid, date, description, amount, remarks) {
        try {
            const conn = await db.getConnection();
            console.log("nid:", nid);
            let query = `UPDATE tbl_personal_exp 
                         SET date = ?, description = ?,amount = ?, remarks = ?`;
            let values = [date, description, amount, remarks];

    
            query += ` WHERE nid = ?`;
            values.push(nid);
    
            await conn.query(query, values); // Pass parameters correctly
            conn.release();
            return { message: "expenses updated successfully" };
        } catch (error) {
            console.error("Error updating expenses:", error);
            throw error;
        }
    }
    
    
    // Delete user
    static async deleteExpense(id) {
        try {
            const conn = await db.getConnection();
            const query = `DELETE FROM tbl_personal_exp WHERE nid = ?`;
            const [result] = await conn.query(query, [id]);
            conn.release();
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Error deleting personal exp:", error);
            throw error;
        }
    }
}

module.exports =Personalexp;