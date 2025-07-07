console.log("mngusermodel.js is running");
const db = require('../db'); // Import the database connection

class AttributeValue {
    // Fetch all users from tbl_user
    static async getAll() {
        try {
            const conn = await db.getConnection(); // Get DB connection
            const [data] = await conn.query('SELECT * FROM tbl_attribute_value'); // Fetch data
            console.log("Data:", data); // Debugging log
            conn.release(); // Release connection
            return data; // Return fetched user data
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error; // Throw error to handle in controller
        }
    }

    static async createAttributevalue(userData) {
        const { attribute_name , attribute_value } = userData;

        try {
            const conn = await db.getConnection(); // Get DB connection
            const sql = `INSERT INTO tbl_attribute_value (attribute_name , attribute_value) 
                         VALUES (?, ?)`;
            await conn.query(sql, [ attribute_name , attribute_value ]);
            conn.release(); // Release connection
        } catch (error) {
            console.error("Error inserting user:", error);
            throw error;
        }
    }

    static async updateAttributevalue(id,attribute_name , attribute_value) {
        try {
            const conn = await db.getConnection();
            console.log("Model Received Data:",id,attribute_name , attribute_value);
    
            // Correct SQL query
            const query = `
                UPDATE tbl_attribute_value
                SET  attribute_value = ? 
                WHERE nid = ?
            `;
            const values = [ attribute_value, id];
    
            // Log the query and values
            console.log("Executing Query:", query);
            console.log("Query Values:", values);
    
            // Execute the query
            const [result] = await conn.query(query, values);
            conn.release();
    
            // Log the result
            console.log("Query Result:", result);
    
            if (result.affectedRows > 0) {
                return { message: "Attribute value updated successfully" };
            } else {
                throw new Error("No rows affected. Attribute may not exist.");
            }
        } catch (error) {
            console.error("Error updating header:", error);
            throw error;
        }
    }    
    // Delete user
    static async deleteAttributevalue(id) {
        try {
            const conn = await db.getConnection();
            const query = `DELETE FROM tbl_attribute_value WHERE nid = ?`;
            const [result] = await conn.query(query, [id]);
            conn.release();
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Error deleting user:", error);
            throw error;
        }
    }
    
    static async getGroupedAttributes() {
        try {
            const conn = await db.getConnection();
            const [rows] = await conn.query(
                "SELECT attribute_name, attribute_value FROM tbl_attribute_value WHERE b_status = 1 AND active_status = 'active'"
            );
            conn.release();
    
            // Group by attribute_name
            const grouped = {};
            for (const row of rows) {
                if (!grouped[row.attribute_name]) {
                    grouped[row.attribute_name] = [];
                }
                grouped[row.attribute_name].push(row.attribute_value);
            }
            console.log("Grouped Attributes:", grouped); // Debugging log
            return grouped;
        } catch (error) {
            console.error("Error grouping attribute values:", error);
            throw error;
        }
    }
    
}

module.exports = AttributeValue;