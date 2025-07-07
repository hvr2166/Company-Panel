console.log("mngusermodel.js is running");
const db = require('../db'); // Import the database connection

class Admin {
    // Fetch all users from tbl_user
    static async getAll() {
        try {
            const conn = await db.getConnection(); // Get DB connection
            const [data] = await conn.query('SELECT * FROM tbl_adminheader'); // Fetch data
            console.log("Data:", data); // Debugging log
            conn.release(); // Release connection
            return data; // Return fetched user data
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error; // Throw error to handle in controller
        }
    }

    static async createHeader(userData) {
        const { comp_name , sub_head , adminhead_email , adminhead_address } = userData;

        try {
            const conn = await db.getConnection(); // Get DB connection
            const sql = `INSERT INTO tbl_adminheader (comp_name , sub_head , adminhead_email , adminhead_address) 
                         VALUES (?, ?, ?, ?)`;
            await conn.query(sql, [comp_name , sub_head , adminhead_email , adminhead_address]);
            conn.release(); // Release connection
        } catch (error) {
            console.error("Error inserting user:", error);
            throw error;
        }
    }

    static async updateHeader(id, comp_name, sub_head, adminhead_email, adminhead_address) {
        try {
            const conn = await db.getConnection();
            console.log("Model Received Data:", id, comp_name, sub_head, adminhead_email, adminhead_address);
    
            // Correct SQL query
            const query = `
                UPDATE tbl_adminheader 
                SET comp_name = ?, sub_head = ?, adminhead_email = ?, adminhead_address = ? 
                WHERE nid = ?
            `;
            const values = [comp_name, sub_head, adminhead_email, adminhead_address, id];
    
            // Log the query and values
            console.log("Executing Query:", query);
            console.log("Query Values:", values);
    
            // Execute the query
            const [result] = await conn.query(query, values);
            conn.release();
    
            // Log the result
            console.log("Query Result:", result);
    
            if (result.affectedRows > 0) {
                return { message: "Header updated successfully" };
            } else {
                throw new Error("No rows affected. Header ID may not exist.");
            }
        } catch (error) {
            console.error("Error updating header:", error);
            throw error;
        }
    }    
    // Delete user
    static async deleteHeader(id) {
        try {
            const conn = await db.getConnection();
            const query = `DELETE FROM tbl_adminheader WHERE nid = ?`;
            const [result] = await conn.query(query, [id]);
            conn.release();
            return result;
        } catch (error) {
            console.error("Error deleting user:", error);
            throw error;
        }
    }
}

module.exports = Admin;