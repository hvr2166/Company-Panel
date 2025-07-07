console.log("mngaccount headmodel.js is running");
const db = require('../db'); // Import the database connection

class AccountHead {
    // Fetch all users from tbl_accounthead
    static async getAll() {
        try {
            const conn = await db.getConnection(); // Get DB connection
            const [data] = await conn.query('SELECT * FROM tbl_accounthead'); // Fetch data
            console.log("Data:", data); // Debugging log
            conn.release(); // Release connection
            return data; // Return fetched user data
        } catch (error) {
            console.error("Error fetching heads:", error);
            throw error; // Throw error to handle in controller
        }
    }

    static async createAccounthead(userData) {
        const { head_name , grp_name ,  active_status } = userData;

        try {
            const conn = await db.getConnection(); // Get DB connection
            const sql = `INSERT INTO tbl_accounthead (head_name ,grp_name ,  active_status) 
                         VALUES (?, ? ,?)`;
            await conn.query(sql, [ head_name , grp_name ,  active_status ]);
            conn.release(); // Release connection
        } catch (error) {
            console.error("Error inserting head:", error);
            throw error;
        }
    }

    static async updateAccountHead(id, head_name , group_name , active_status ) {
        try {
            const conn = await db.getConnection();
            console.log("Model Received Data:",id, head_name , group_name , active_status);
    
            // Correct SQL query
            const query = `
                UPDATE tbl_accounthead 
                SET head_name = ?,grp_name =? , active_status = ? 
                WHERE nid = ?
            `;
            const values = [ head_name , group_name , active_status, id];
    
            // Log the query and values
            console.log("Executing Query:", query);
            console.log("Query Values:", values);
    
            // Execute the query
            const [result] = await conn.query(query, values);
            conn.release();
    
            // Log the result
            console.log("Query Result:", result);
    
            if (result.affectedRows > 0) {
                return { message: "account head updated successfully" };
            } else {
                throw new Error("No rows affected. head may not exist.");
            }
        } catch (error) {
            console.error("Error updating header:", error);
            throw error;
        }
    }    
    // Delete user
    static async deleteAccounthead(id) {
        try {
            const conn = await db.getConnection();
            const query = `DELETE FROM tbl_accounthead WHERE nid = ?`;
            const [result] = await conn.query(query, [id]);
            conn.release();
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Error deleting head:", error);
            throw error;
        }
    }
}

module.exports =AccountHead;