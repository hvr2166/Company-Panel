console.log("mngheadcategorymodel.js is running");
const db = require('../db'); // Import the database connection

class HeadCategory {
    // Fetch all users from tbl_user
    static async getAll() {
        try {
            const conn = await db.getConnection(); // Get DB connection
            const [data] = await conn.query('SELECT * FROM tbl_head_categories'); // Fetch data
            console.log("Data:", data); // Debugging log
            conn.release(); // Release connection
            return data; // Return fetched user data
        } catch (error) {
            console.error("Error fetching category:", error);
            throw error; // Throw error to handle in controller
        }
    }

    static async createCategory(userData) {
        const { ctr_name ,ctr_code , active_status } = userData;

        try {
            const conn = await db.getConnection(); // Get DB connection
            const sql = `INSERT INTO tbl_head_categories (ctr_name ,ctr_code , active_status) 
                         VALUES (?, ? ,?)`;
            await conn.query(sql, [ ctr_name ,ctr_code, active_status ]);
            conn.release(); // Release connection
        } catch (error) {
            console.error("Error inserting category:", error);
            throw error;
        }
    }

    static async updateCategory(id,ctr_name ,ctr_code, active_status ) {
        try {
            const conn = await db.getConnection();
            console.log("Model Received Data:",id,ctr_name ,ctr_code , active_status);
    
            // Correct SQL query
            const query = `
                UPDATE tbl_head_categories 
                SET ctr_name = ?,ctr_code=? , active_status = ? 
                WHERE nid = ?
            `;
            const values = [ctr_name ,ctr_code, active_status, id];
    
            // Log the query and values
            console.log("Executing Query:", query);
            console.log("Query Values:", values);
    
            // Execute the query
            const [result] = await conn.query(query, values);
            conn.release();
    
            // Log the result
            console.log("Query Result:", result);
    
            if (result.affectedRows > 0) {
                return { message: "category updated successfully" };
            } else {
                throw new Error("No rows affected.Category may not exist.");
            }
        } catch (error) {
            console.error("Error updating :", error);
            throw error;
        }
    }    
    // Delete user
    static async dltcategory(id) {
        try {
            const conn = await db.getConnection();
            const query = `DELETE FROM tbl_head_categories WHERE nid = ?`;
            const [result] = await conn.query(query, [id]);
            conn.release();
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Error deleting category:", error);
            throw error;
        }
    }
}

module.exports = HeadCategory;