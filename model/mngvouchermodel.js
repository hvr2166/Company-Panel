console.log("manage voucher model is loading ");
const db= require("../db");

class ManageVoucherModel {
  static async getAll() {
    try {
      const sql = "SELECT * FROM tbl_voucher";
      const [rows] = await db.query(sql);
      return rows;
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      throw error;
    }
  }

  static async addVoucher(voucherData) {
    try {
      const sql = "INSERT INTO tbl_voucher SET ?";
      const [result] = await db.query(sql, voucherData);
      return result.insertId;
    } catch (error) {
      console.error("Error adding voucher:", error);
      throw error;
    }
  }

    static async deleteVoucher(voucherId) {
        try {
        const sql = "DELETE FROM tbl_voucher WHERE nid = ?";
        await db.query(sql, [voucherId]);
        } catch (error) {
        console.error("Error deleting voucher:", error);
        throw error;
        }
    }

    static async editVoucher(voucherId, edit_account_name, edit_payment_type, edit_payment_mode, edit_bank_name, edit_payment_ref_no, edit_amount, edit_payment_date, edit_remarks) {
        try {
            console.log("Editing voucher with ID:", voucherId);
            console.log("Received data:", { edit_account_name, edit_payment_type, edit_payment_mode, edit_bank_name, edit_payment_ref_no, edit_amount, edit_payment_date, edit_remarks });
    
            const sql = `
                UPDATE tbl_voucher 
                SET 
                    account_name = ?, 
                    payment_type = ?, 
                    payment_mode = ?, 
                    bank_name = ?, 
                    payment_ref_no = ?, 
                    amount = ?, 
                    payment_date = ?, 
                    remarks = ? 
                WHERE nid = ?`;
    
            await db.query(sql, [edit_account_name, edit_payment_type, edit_payment_mode, edit_bank_name, edit_payment_ref_no, edit_amount, edit_payment_date, edit_remarks, voucherId]);
        } catch (error) {
            console.error("Error updating voucher:", error);
            throw error;
        }
    }
}

module.exports = ManageVoucherModel;