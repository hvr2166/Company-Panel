console.log("mngusermodel.js is running");
const db = require('../db'); // Import the database connection

class Bankmodel {
    // Fetch all users from tbl_user
    static async getAll() {
        try {
            const conn = await db.getConnection(); // Get DB connection
            const [data] = await conn.query('SELECT * FROM tbl_bank'); // Fetch data
            console.log("Data:", data); // Debugging log
            conn.release(); // Release connection
            return data; // Return fetched user data
        } catch (error) {
            console.error("Error fetching banks:", error);
            throw error; // Throw error to handle in controller
        }
    }

    static async createbank(userData) {
        const { bank_name, bank_branch,acc_num} = userData;

        try {
            const conn = await db.getConnection(); // Get DB connection
            const sql = `INSERT INTO tbl_bank (bank_name, bank_branch,acc_num)
                         VALUES (?, ?,?)`; 
            await conn.query(sql, [bank_name, bank_branch,acc_num]);
            conn.release(); // Release connection
        } catch (error) {
            console.error("Error inserting bank:", error);
            throw error;
        }
    }

    static async updatebank(id, bank_name, bank_branch,acc_num) {
        try {
            const conn = await db.getConnection();
            console.log("Model Received Data:", id,  bank_name, bank_branch,acc_num);
    
            // Correct SQL query
            const query = `
                UPDATE tbl_bank 
                SET bank_name = ?, bank_branch = ? ,acc_num = ? 
                WHERE nid = ?
            `;
            const values = [bank_name,bank_branch,acc_num , id];
    
            // Log the query and values
            console.log("Executing Query:", query);
            console.log("Query Values:", values);
    
            // Execute the query
            const [result] = await conn.query(query, values);
            conn.release();
    
            // Log the result
            console.log("Query Result:", result);
    
            if (result.affectedRows > 0) {
                return { message: "bank successfully" };
            } else {
                throw new Error("No rows affected. Bank ID may not exist.");
            }
        } catch (error) {
            console.error("Error updating Bank:", error);
            throw error;
        }
    }    
    // Delete user
    static async dltbank(id) {
        try {
            const conn = await db.getConnection();
            const query = `DELETE FROM tbl_bank WHERE nid = ?`;
            const [result] = await conn.query(query, [id]);
            conn.release();
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Error deleting bank:", error);
            throw error;
        }
    }
}

module.exports = Bankmodel;