const db = require("../db")

class InvoiceModel {
    static async getSupplierById(Purchaseid) {
        const [result] = await db.query('SELECT * FROM tbl_mng_purchase WHERE nid = ?', [Purchaseid]);
        if (result.length > 0) {
            const supplierId = result[0].supplier_name; // Assuming supplier_name holds the supplier ID
            const [supplier] = await db.query('SELECT * FROM tbl_suppliers WHERE nid = ?', [supplierId]);
            return supplier.length > 0 ? supplier[0] : null; // Return the first supplier object or null
        }
        return null; // Return null if no purchase found
    }

    static async getPurchaseBySupplierId(Purchaseid) {
        const [purchase] = await db.query('SELECT * FROM tbl_mng_purchase WHERE nid = ?', [Purchaseid]);
        return purchase;
    }

}

module.exports = InvoiceModel; 
