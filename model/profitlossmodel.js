const db = require("../db");

class ProfitLossModel {
    static async getSalesWithDates() {
        const [sales] = await db.execute(
            "SELECT CAST(net_total_amt AS DECIMAL(10, 2)) AS net_total_amt, sales_date FROM tbl_mng_sales WHERE b_status = 1"
        );
        return sales.map(sale => ({
            ...sale,
            net_total_amt: parseFloat(sale.net_total_amt) || 0 // Ensure it's a number
        }));
    }

    static async getApprovedSalesWithDates() {
        const [sales] = await db.execute(
            "SELECT CAST(net_amount AS DECIMAL(10, 2)) AS net_amount, entry_date FROM tbl_sales_approvals WHERE status = 'approved'"
        );
        return sales.map(sale => ({
            ...sale,
            net_amount: parseFloat(sale.net_amount) || 0 // Ensure it's a number
        }));
    }

    static async getPurchasesWithDates() {
        const [purchases] = await db.execute(
            "SELECT CAST(net_total_amt AS DECIMAL(10, 2)) AS net_total_amt, purchase_date FROM tbl_mng_purchase WHERE b_status = 1"
        );
        return purchases.map(purchase => ({
            ...purchase,
            net_total_amt: parseFloat(purchase.net_total_amt) || 0 // Ensure it's a number
        }));
    }

    static async getApprovedPurchasesWithDates() {
        const [purchases] = await db.execute(
            "SELECT CAST(net_amount AS DECIMAL(10, 2)) AS net_amount, entry_date FROM tbl_purchase_approvals WHERE status = 'approved'"
        );
        return purchases.map(purchase => ({
            ...purchase,
            net_amount: parseFloat(purchase.net_amount) || 0 // Ensure it's a number
        }));
    }
}

module.exports = ProfitLossModel;