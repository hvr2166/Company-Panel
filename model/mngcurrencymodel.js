console.log("mngcurrencymodel.js is running");
const db = require('../db'); // Import the database connection

class CurrencyModel {
    // Fetch all users from tbl_user
    static async getAll() {
        try {
            const conn = await db.getConnection(); // Get DB connection
            const [data] = await conn.query('SELECT * FROM tbl_curruncy'); // Fetch data
            console.log("Data:", data); // Debugging log
            conn.release(); // Release connection
            return data; // Return fetched user data
        } catch (error) {
            console.error("Error fetching currency:", error);
            throw error; // Throw error to handle in controller
        }
    }

    static async createcurrency(userData) {
        const { cur_name, symbol} = userData;

        try {
            const conn = await db.getConnection(); // Get DB connection
            const sql = `INSERT INTO tbl_curruncy (cur_name, symbol)
                         VALUES (?, ?)`; 
            await conn.query(sql, [cur_name, symbol]);
            conn.release(); // Release connection
        } catch (error) {
            console.error("Error inserting currency:", error);
            throw error;
        }
    }

    static async updatecurrency(id,cur_name, symbol) {
        try {
            const conn = await db.getConnection();
            console.log("Model Received Data:", id, cur_name, symbol);
    
            // Correct SQL query
            const query = `
                UPDATE tbl_curruncy
                SET cur_name = ?, symbol = ? 
                WHERE nid = ?
            `;
            const values = [cur_name, symbol , id];
    
            // Log the query and values
            console.log("Executing Query:", query);
            console.log("Query Values:", values);
    
            // Execute the query
            const [result] = await conn.query(query, values);
            conn.release();
    
            // Log the result
            console.log("Query Result:", result);
    
            if (result.affectedRows > 0) {
                return { message: "Currency updated successfully" };
            } else {
                throw new Error("No rows affected. Currency ID may not exist.");
            }
        } catch (error) {
            console.error("Error updating Currency:", error);
            throw error;
        }
    }    
    // Delete user
    static async dltcurrency(id) {
        try {
            const conn = await db.getConnection();
            const query = `DELETE FROM tbl_curruncy WHERE nid = ?`;
            const [result] = await conn.query(query, [id]);
            conn.release();
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Error deleting currency:", error);
            throw error;
        }
    }
}

module.exports = CurrencyModel;