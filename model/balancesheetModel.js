const db = require('../db');

class BalanceSheetModel {
    static async getLiabilities() {
        try {
            const [purchaseResult] = await db.query("SELECT COALESCE(SUM(CAST(net_total_amt AS DECIMAL(10,2))), 0) AS total FROM tbl_mng_purchase");
            const [expenseResult] = await db.query("SELECT COALESCE(SUM(CAST(amount AS DECIMAL(10,2))), 0) AS total FROM tbl_personal_exp");
            const [purchaseApprovalResult] = await db.query("SELECT COALESCE(SUM(CAST(net_amount AS DECIMAL(10,2))), 0) AS total FROM tbl_purchase_approvals");

            const purchase = parseFloat(purchaseResult[0]?.total || 0);
            const expense = parseFloat(expenseResult[0]?.total || 0);
            const purchaseApproval = parseFloat(purchaseApprovalResult[0]?.total || 0);

            const total = purchase + expense + purchaseApproval;

            console.log("Liabilities:", { purchase, expense, purchaseApproval, total });

            return {
                purchase: purchase.toFixed(2),
                expense: expense.toFixed(2),
                purchaseApproval: purchaseApproval.toFixed(2),
                total: total.toFixed(2)
            };
        } catch (error) {
            console.error("Error fetching liabilities:", error);
            throw error;
        }
    }

    static async getAssets() {
        try {
            const [salesResult] = await db.query("SELECT COALESCE(SUM(CAST(net_total_amt AS DECIMAL(10,2))), 0) AS total FROM tbl_mng_sales");
            const [salesApprovalResult] = await db.query("SELECT COALESCE(SUM(CAST(net_amount AS DECIMAL(10,2))), 0) AS total FROM tbl_sales_approvals");

            const sales = parseFloat(salesResult[0]?.total || 0);
            const salesApproval = parseFloat(salesApprovalResult[0]?.total || 0);
            
            const total = sales + salesApproval;

            console.log("Assets:", { sales, salesApproval, total });

            return {
                sales: total.toFixed(2),
                total: total.toFixed(2)
            };
        } catch (error) {
            console.error("Error fetching assets:", error);
            throw error;
        }
    }
}

module.exports = BalanceSheetModel;
