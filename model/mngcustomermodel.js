console.log("mngcustomermodel.js is running");
const db = require('../db'); // Import the database connection

class Customer {

    static async getAll() {
        try {
            const conn = await db.getConnection(); // Get DB connection
            const [data] = await conn.query('SELECT * FROM tbl_customers'); // Fetch data
            console.log("Data:", data); // Debugging log
            conn.release(); // Release connection
            return data; // Return fetched  data
        } catch (error) {
            console.error("Error fetching customers:", error);
            throw error; // Throw error to handle in controller
        }
    }

    static async createcustomer(userData) {
        const {cust_name, cust_mobile , cust_email, cust_firm_name, cust_address ,status} = userData;

        try {
            const conn = await db.getConnection(); // Get DB connection
            const sql = `INSERT INTO tbl_customers (cust_name, cust_mobile , cust_email, cust_firm_name, cust_address , active_status) 
                         VALUES (?, ? ,?,?,?,?)`;
            await conn.query(sql, [ cust_name, cust_mobile , cust_email, cust_firm_name, cust_address ,status ]);
            conn.release(); // Release connection
        } catch (error) {
            console.error("Error inserting customers:", error);
            throw error;
        }
    }

    static async updatecustomer(id,cust_name, cust_mobile , cust_email, cust_firm_name, cust_address ,active_status ) {
        try {
            const conn = await db.getConnection();
            console.log("Model Received Data:",id,cust_name, cust_mobile , cust_email, cust_firm_name, cust_address ,active_status);
    
            // Correct SQL query
            const query = `
                UPDATE tbl_customers 
                SET cust_name = ?, cust_mobile = ?, cust_email = ?, cust_firm_name = ?, cust_address = ?, active_status = ? 
                WHERE nid = ?
            `;
            const values = [cust_name, cust_mobile , cust_email, cust_firm_name, cust_address ,active_status, id];
    
            // Log the query and values
            console.log("Executing Query:", query);
            console.log("Query Values:", values);
    
            // Execute the query
            const [result] = await conn.query(query, values);
            conn.release();
    
            // Log the result
            console.log("Query Result:", result);
    
            if (result.affectedRows > 0) {
                return { message: "customers updated successfully" };
            } else {
                throw new Error("No rows affected. customers may not exist.");
            }
        } catch (error) {
            console.error("Error updating customers:", error);
            throw error;
        }
    }    
    // Delete user
    static async deletecustomer(id) {
        try {
            const conn = await db.getConnection();
            const query = `DELETE FROM tbl_customers WHERE nid = ?`;
            const [result] = await conn.query(query, [id]);
            conn.release();
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Error deleting customers:", error);
            throw error;
        }
    }
}

module.exports = Customer;