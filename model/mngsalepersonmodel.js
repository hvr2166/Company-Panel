console.log("mngsalepersonmodel.js is running");
const db = require('../db'); // Import the database connection

class SalePerson {
    // Fetch all sale persons from tbl_saleperson
    static async getAll() {
        try {
            const conn = await db.getConnection(); // Get DB connection
            const [data] = await conn.query('SELECT * FROM tbl_sale_person'); // Fetch data
            console.log("Data:", data); // Debugging log
            conn.release(); // Release connection
            return data; // Return fetched sale person data
        } catch (error) {
            console.error("Error fetching sale persons:", error);
            throw error; // Throw error to handle in controller
        }
    }

    static async createSalePerson(salePersonData) {
        const {sale_per_name, sale_per_mob , active_status } = salePersonData;

        try {
            const conn = await db.getConnection(); // Get DB connection
            const sql = `INSERT INTO tbl_sale_person (sale_per_name, sale_per_mob , active_status) 
                         VALUES (?,?, ?)`;
            await conn.query(sql, [sale_per_name, sale_per_mob , active_status]);
            conn.release(); // Release connection
        } catch (error) {
            console.error("Error inserting sale person:", error);
            throw error;
        }
    }

    static async updateSalePerson(nid ,sale_per_name, sale_per_mob , active_status) {
        try {
            const conn = await db.getConnection();
            console.log("Model Received Data:", nid, sale_per_name, sale_per_mob , active_status);
    
            // Correct SQL query
            const query = `
                UPDATE tbl_sale_person 
                SET sale_per_name = ?, sale_per_mob = ?, active_status = ? 
                WHERE nid = ?
            `;
            const values = [sale_per_name, sale_per_mob , active_status, nid];
    
            // Log the query and values
            console.log("Executing Query:", query);
            console.log("Query Values:", values);
    
            // Execute the query
            const [result] = await conn.query(query, values);
            conn.release();
    
            // Log the result
            console.log("Query Result:", result);
    
            if (result.affectedRows > 0) {
                return { message: "Sale Person updated successfully" };
            } else {
                throw new Error("No rows affected. Sale Person may not exist.");
            }
        } catch (error) {
            console.error("Error updating sale person:", error);
            throw error;
        }
    }    

    // Delete sale person
    static async deleteSalePerson(id) {
        try {
            const conn = await db.getConnection();
            const query = `DELETE FROM tbl_sale_person WHERE nid = ?`;
            const [result] = await conn.query(query, [id]);
            conn.release();
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Error deleting sale person:", error);
            throw error;
        }
    }
}

module.exports = SalePerson;