const db = require("../db");

class ReportModel {
    static async getCashOut() {
        const [query] = await db.execute(
            "SELECT * FROM tbl_voucher WHERE payment_mode IN ('cheque', 'online transfer') AND payment_type = 'paid'"
        );
        return query;
    }

    static async getCashIn() {
        const [query] = await db.execute(
            "SELECT * FROM tbl_voucher WHERE payment_mode IN ('cheque', 'online transfer') AND payment_type = 'received'"
        );
        return query;
    }

    static async getBanks() {
        const [query] = await db.execute(
            "SELECT DISTINCT bank_name FROM tbl_voucher WHERE bank_name IS NOT NULL AND bank_name != ''"
        );
        return query;
    }
}

module.exports = ReportModel;
