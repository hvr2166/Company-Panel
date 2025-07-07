const db=require("../db");

class mngsupplier{
    static async getAll(){
        try {
            const conn = await db.getConnection(); // Get DB connection
            const [data] = await conn.query('SELECT * FROM tbl_supplier_payment'); // Fetch data
            console.log("Data:", data); // Debugging log
            conn.release(); // Release connection
            return data; // Return fetched user data
        } catch (error) {
            console.error("Error fetching suppliers payments:", error);
            throw error; // Throw error to handle in controller
        }
    }
}

module.exports = mngsupplier;