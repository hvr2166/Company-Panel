const db = require('../db'); // your database connection module

class StockModel {
    static async getAllLots() {
        const query = 'SELECT nid, lot FROM tbl_managestockno WHERE active_status = "active"';
        const [rows] = await db.execute(query);
        return rows;
    }

    static async getLotDetailsById(nid) {
        const query = 'SELECT * FROM tbl_managestockno WHERE lot = ?';
        const [rows] = await db.execute(query, [nid]);
        return rows[0];
    }

    static async insertTransferData(data) {
        const sql = `INSERT INTO tbl_tranferstock 
          (from_lot, from_current_qty, from_trans_qty, from_final_qty, from_price, from_amount, 
           to_lot, to_current_qty, to_trans_qty, to_final_qty, to_price, to_amount,
           total_tans_qty, recut_charges, total_amount, recut_loss_qty, missing_qty, 
           total_trans_qty, net_total_amt, remarks, avg_price)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?  )`;
    
        const values = [
          data.from_lot ?? null,
          data.from_current_qty ?? null,
          data.from_trans_qty ?? null,
          data.from_final_qty ?? null,
          data.from_price ?? null,
          data.from_amount ?? null,
          data.to_lot ?? null,
          data.to_current_qty ?? null,
          data.to_trans_qty ?? null,
          data.to_final_qty ?? null,
          data.to_price ?? null,
          data.to_amount ?? null,
          data.total_tans_qty ?? null,
          data.recut_charges ?? null,
          data.total_amount ?? null,
          data.recut_loss_qty ?? null,
          data.missing_qty ?? null,
          data.total_trans_qty ?? null,
          data.net_total_amt ?? null,
          data.remarks ?? null,
            data.avg_price ?? null
        ];

        await db.execute(`update tbl_managestockno set pcs = pcs - ? where lot = ? `, [data.from_trans_qty, data.from_lot]);
        await db.execute(`update tbl_managestockno set pcs = pcs + ? where lot = ? `, [data.from_trans_qty, data.to_lot]);
    
        await db.execute(sql, values);
    }

    static async getAllTransferStock() {
        const query = `SELECT * FROM tbl_tranferstock`;
        const [rows] = await db.execute(query);
        return rows;
    }
}

module.exports = StockModel;