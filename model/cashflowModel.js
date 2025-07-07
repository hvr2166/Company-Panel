const db = require('../db'); // Assuming db.js is your database connection file

class CashflowModel {
    static async getCashFlow(month) {
        const sql = `
            SELECT DATE_FORMAT(STR_TO_DATE(CONCAT(?, '-01'), '%Y-%m-%d'), '%Y-%m-%d') AS paymentDate,
                SUM(CASE WHEN payment_type = 'received' THEN amount ELSE 0 END) AS cashIn,
                SUM(CASE WHEN payment_type = 'paid' THEN amount ELSE 0 END) AS cashOut,
                ? AS month
            FROM tbl_voucher
            WHERE DATE_FORMAT(payment_date, '%Y-%m') = ?`;
        const [rows] = await db.execute(sql, [month, month, month]);
        return rows;
    }

    static async getTransactions(month) {
        const sql = `SELECT payment_date AS date, payment_type AS type, amount FROM tbl_voucher
                     WHERE DATE_FORMAT(payment_date, '%Y-%m') = ?`;
        const [rows] = await db.execute(sql, [month]);
        return rows;
    }
}

module.exports = CashflowModel;