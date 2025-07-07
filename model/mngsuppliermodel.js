console.log("mngsuppliermodel.js is running");
const db = require('../db'); // Import the database connection

class Supplier {
    // Fetch all users from tbl_user
    static async getAll() {
        try {
            const conn = await db.getConnection(); // Get DB connection
            const [data] = await conn.query('SELECT * FROM tbl_suppliers'); // Fetch data
            console.log("Data:", data); // Debugging log
            conn.release(); // Release connection
            return data; // Return fetched user data
        } catch (error) {
            console.error("Error fetching Supplier:", error);
            throw error; // Throw error to handle in controller
        }
    }

    static async createSupplier(userData) {
        const { sup_name ,sup_comp_name , sup_email , sup_mobile , sup_address , sup_tax_id, active_status } = userData;

        try {
            const conn = await db.getConnection(); // Get DB connection
            const sql = `INSERT INTO tbl_suppliers (sup_name ,sup_comp_name , sup_email , sup_mobile , sup_address , sup_tax_id, active_status) 
                         VALUES (?, ? ,?,?,?,?,?)`;
            await conn.query(sql, [ sup_name ,sup_comp_name , sup_email , sup_mobile , sup_address , sup_tax_id, active_status ]);
            conn.release(); // Release connection
        } catch (error) {
            console.error("Error inserting Supplier:", error);
            throw error;
        }
    }

    static async updateSupplier(id,sup_name ,sup_comp_name , sup_email , sup_mobile , sup_address , sup_tax_id, active_status ) {
        try {
            const conn = await db.getConnection();
            console.log("Model Received Data:",id,sup_name ,sup_comp_name , sup_email , sup_mobile , sup_address , sup_tax_id, active_status);
    
            // Correct SQL query
            const query = `
                UPDATE tbl_suppliers 
                SET sup_name=? ,sup_comp_name=? , sup_email=? , sup_mobile=? , sup_address=? , sup_tax_id=?, active_status=?
                WHERE nid = ?
            `;
            const values = [sup_name ,sup_comp_name , sup_email , sup_mobile , sup_address , sup_tax_id, active_status, id];
    
            // Log the query and values
            console.log("Executing Query:", query);
            console.log("Query Values:", values);
    
            // Execute the query
            const [result] = await conn.query(query, values);
            conn.release();
    
            // Log the result
            console.log("Query Result:", result);
    
            if (result.affectedRows > 0) {
                return { message: "Supplier updated successfully" };
            } else {
                throw new Error("No rows affected. Supplier may not exist.");
            }
        } catch (error) {
            console.error("Error updating Supplier:", error);
            throw error;
        }
    }    
    
    static async deleteSupplier(id) {
        try {
            const conn = await db.getConnection();
            const query = `DELETE FROM tbl_suppliers WHERE nid = ?`;
            const [result] = await conn.query(query, [id]);
            conn.release();
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Error deleting Supplier:", error);
            throw error;
        }
    }
}

module.exports = Supplier;