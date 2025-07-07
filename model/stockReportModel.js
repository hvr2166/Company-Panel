const db = require("../db");

class stockreportmodel {
static async fetchReportData() {
    const query = `
        SELECT 
            ms.lot AS lot,
            ms.description AS description,
            ms.size AS size,
            ms.shape AS shape,
            ms.mines AS mine,
            ms.weight AS weight_in_hand,
            ms.price AS purchase_price,
            COALESCE(SUM(p.weight), 0) AS total_weight,
            MIN(sup.sup_name) AS supplier_name,
            MIN(p.purchase_date) AS purchase_date,
            COALESCE(SUM(p.net_total_amt), 0) AS total_purchase,
            COALESCE(SUM(s.net_total_amt), 0) AS total_sales,
            (COALESCE(SUM(s.net_total_amt), 0) - COALESCE(SUM(p.net_total_amt), 0)) AS total_profit
        FROM tbl_managestockno ms
        LEFT JOIN tbl_mng_purchase p ON ms.lot = p.lot_no
        LEFT JOIN tbl_suppliers sup ON p.supplier_name = sup.nid
        LEFT JOIN tbl_mng_sales s ON ms.lot = s.lot_no
        GROUP BY ms.lot;
    `;

    try {
        const [rows] = await db.query(query);
        return rows;
    } catch (error) {
        console.error("Database query error:", error);
        throw error;
    }
}



    static async getLotData(lotNo) {
        try {
            const [rows] = await db.query("SELECT * FROM tbl_stock_log WHERE lot = ?", [lotNo]);

            return rows;
        } catch (error) {
            console.error("Database Error:", error);
            throw error;
        }
    }

    static async getLotPurchases(lot) {
    const query = `
        SELECT weight, purchase_date, due_date
        FROM tbl_mng_purchase
        WHERE lot_no = ?
    `;
    const [rows] = await db.query(query, [lot]);
    return rows;
}


static async getLotSales(lot) {
    const query = `
        SELECT pcs, sales_date AS due_date
        FROM tbl_mng_sales
        WHERE lot_no = ?
    `;
    const [rows] = await db.query(query, [lot]);
    return rows;
}

}

module.exports= stockreportmodel ;