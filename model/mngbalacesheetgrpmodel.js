console.log("mngbalacesheetgrpmodel.js is running");
const db = require("../db");

// Model for managing balance sheet groups
class mngbalacesheetgrpmodel {
    static async getAll() {
        try {
            const conn = await db.getConnection(); // Get DB connection
            const [data] = await conn.query('SELECT * FROM tbl_balancesheet_grp'); // Fetch data
            console.log("Data:", data); // Debugging log
            conn.release(); // Release connection
            return data; // Return fetched user data
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error; // Throw error to handle in controller
        }
    }

    static async createexpensehead(userData) {
        const {grp_name , grp_type , grp_rev_cap} = userData;

        try {
            const conn = await db.getConnection(); // Get DB connection
            const sql = `INSERT INTO tbl_balancesheet_grp (grp_name, grp_type , grp_rev_cap) 
                         VALUES (?, ?, ?)`;
            await conn.query(sql, [grp_name , grp_type , grp_rev_cap]);
            conn.release(); // Release connection
        } catch (error) {
            console.error("Error inserting expense head:", error);
            throw error;
        }
    }

    static async updateexpensehead(nid,grp_name , grp_type , grp_rev_cap) {
        try {
            const conn = await db.getConnection();
    
            let query = `UPDATE tbl_balancesheet_grp
                         SET grp_name = ?, grp_type = ?, grp_rev_cap = ?`;
                            
            let values = [grp_name , grp_type , grp_rev_cap];
    
            // If user_password is provided, update it
          
    
            query += ` WHERE nid = ?`;
            values.push(nid);
    
            await conn.query(query, values); // Pass parameters correctly
            conn.release();
            return { message: "expensehead updated successfully" };
        } catch (error) {
            console.error("Error updating expense head:", error);
            throw error;
        }
    }
    
    
    // Delete user
    static async deletehead(id) {
        try {
            const conn = await db.getConnection();
            const query = `DELETE FROM tbl_balancesheet_grp WHERE nid = ?`;
            const [result] = await conn.query(query, [id]);
            conn.release();
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Error deleting expensehead:", error);
            throw error;
        }
    }
}   

module.exports = mngbalacesheetgrpmodel;