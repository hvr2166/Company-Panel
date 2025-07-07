console.log("stockhistory controller loading ");
const db = require("../db");

class Mngstockhistorymodel{

    static async getAll(){
        try{
            const conn = await db.getConnection();
            const [data] = await conn.query(`SELECT 
                l.*, 
                s.sup_name AS supplier_name,
                c.cust_name AS customer_name
              FROM tbl_stock_log l
              LEFT JOIN tbl_suppliers s ON l.supplier = s.nid
              LEFT JOIN tbl_customers c ON l.customer = c.nid
              ORDER BY l.action_date DESC
            `);
            conn.release();
            return data;
        }catch(error){
            console.error("Error fetching lots:", error);
            throw error;
        }
    }

    static async getByLot(lot_no) {
        try {
            const conn = await db.getConnection();
            const [data] = await conn.query(`
                SELECT 
                    l.*, 
                    s.sup_name AS supplier_name,
                    c.cust_name AS customer_name
                FROM tbl_stock_log l
                LEFT JOIN tbl_suppliers s ON l.supplier = s.nid
                LEFT JOIN tbl_customers c ON l.customer = c.nid
                WHERE l.lot = ?
                ORDER BY l.action_date DESC
            `, [lot_no]);
            conn.release();
            return data;
        } catch (error) {
            console.error("Error fetching filtered lots:", error);
            throw error;
        }
    }
    
}

module.exports=Mngstockhistorymodel;