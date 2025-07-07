console.log("mngusermodel.js is running");
const db = require('../db'); // Import the database connection

class Attribute {
    // Fetch all users from tbl_user
    static async getAll() {
        try {
            const conn = await db.getConnection(); // Get DB connection
            const [data] = await conn.query('SELECT * FROM tbl_attribute'); // Fetch data
            console.log("Data:", data); // Debugging log
            conn.release(); // Release connection
            return data; // Return fetched user data
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error; // Throw error to handle in controller
        }
    }

    static async createAttribute(userData) {
        const { attribute_name , active_status } = userData;

        try {
            const conn = await db.getConnection(); // Get DB connection
            const sql = `INSERT INTO tbl_attribute (attribute_name , active_status) 
                         VALUES (?, ?)`;
            await conn.query(sql, [ attribute_name , active_status ]);
            conn.release(); // Release connection
        } catch (error) {
            console.error("Error inserting user:", error);
            throw error;
        }
    }

    static async updateAttribute(id,attribute_name , active_status ) {
        try {
            const conn = await db.getConnection();
            console.log("Model Received Data:",id,attribute_name , active_status);
    
            // Correct SQL query
            const query = `
                UPDATE tbl_attribute 
                SET attribute_name = ?, active_status = ? 
                WHERE nid = ?
            `;
            const values = [attribute_name , active_status, id];
    
            // Log the query and values
            console.log("Executing Query:", query);
            console.log("Query Values:", values);
    
            // Execute the query
            const [result] = await conn.query(query, values);
            conn.release();
    
            // Log the result
            console.log("Query Result:", result);
    
            if (result.affectedRows > 0) {
                return { message: "Attribute updated successfully" };
            } else {
                throw new Error("No rows affected. Attribute may not exist.");
            }
        } catch (error) {
            console.error("Error updating header:", error);
            throw error;
        }
    }    
    // Delete user
    static async deleteAttribute(id) {
        try {
            const conn = await db.getConnection();
            const query = `DELETE FROM tbl_attribute WHERE nid = ?`;
            const [result] = await conn.query(query, [id]);
            conn.release();
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Error deleting user:", error);
            throw error;
        }
    }

       static async attributeExists(attribute_name) {
    try {
        const conn = await db.getConnection();
        const sql = `SELECT COUNT(*) AS count FROM tbl_attribute WHERE attribute_name = ?`;
        const [rows] = await conn.query(sql, [attribute_name]);
        conn.release();
        return rows[0].count > 0;
    } catch (error) {
        console.error("Error checking attribute existence:", error);
        throw error;
    }
}
}

module.exports = Attribute;