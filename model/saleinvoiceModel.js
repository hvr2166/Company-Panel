const db = require("../db")

class InvoiceModel {
    static async getCustomerById(SalesId) {
        const [result] = await db.query('SELECT * FROM tbl_mng_sales WHERE nid = ?', [SalesId]);
        if (result.length > 0) {
            const customerId = result[0].customer_name; // Assuming customer_name holds the supplier ID
            const [customer] = await db.query('SELECT * FROM tbl_customers WHERE nid = ?', [customerId]);
            return customer.length > 0 ? customer[0] : null; // Return the first supplier object or null
        }
        return null; // Return null if no sales found
    }

    static async getPurchaseByCustomerId(SalesId) {
        const [sales] = await db.query('SELECT * FROM tbl_mng_sales WHERE nid = ?', [SalesId]);
        return sales;;
    }

}

module.exports = InvoiceModel; 
