console.log("manage voucher controller is running ");
const mngvoucher = require("../model/mngvouchermodel");
const accountheadmodel = require("../model/mngaccountheadmodel");
const bankmodel = require("../model/mngbankmodel");

class ManageVoucherController {
  static async getAll(req,res){
    try {
      const voucherData = await mngvoucher.getAll();
      const accname = await accountheadmodel.getAll();
      const banks = await bankmodel.getAll();

      const formattedVoucherData = voucherData.map(voucher => {
        return {
            ...voucher,
            payment_date: formatDate(voucher.payment_date) // Format the payment_date
        };
    });
      
      res.render("managevoucher", { voucherData: formattedVoucherData, accname, banks });
    } catch (error) {
      console.error("Error fetching voucher data:", error);
      res.status(500).send("Internal Server Error");
    }
  }

    static async addVoucher(req, res) {
        try {
        const voucherData = req.body;
        console.log("Received voucher data:", voucherData);
        const result = await mngvoucher.addVoucher(voucherData);
        res.status(201).json({ message: "Voucher added successfully", id: result });
        } catch (error) {
        console.error("Error adding voucher:", error);
        res.status(500).send("Internal Server Error");
        }
    }

    static async deleteVoucher(req, res) {
        try {
            const voucherId = req.params.id;
            console.log("Deleting voucher with ID:", voucherId);
            await mngvoucher.deleteVoucher(voucherId);
            res.status(200).json({ message: "Voucher deleted successfully" });
        } catch (error) {
            console.error("Error deleting voucher:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    static async editVoucher(req, res) {
        const voucherId = req.body.nid; // Ensure this is being set correctly
        const { edit_account_name, edit_payment_type, edit_payment_mode, edit_bank_name, edit_payment_ref_no, edit_amount, edit_payment_date, edit_remarks } = req.body;
    
        console.log("Updating voucher with ID:", voucherId);
        console.log("Received data:", { edit_account_name, edit_payment_type, edit_payment_mode, edit_bank_name, edit_payment_ref_no, edit_amount, edit_payment_date, edit_remarks });
    
        try {
            await mngvoucher.editVoucher(voucherId, edit_account_name, edit_payment_type, edit_payment_mode, edit_bank_name, edit_payment_ref_no, edit_amount, edit_payment_date, edit_remarks);
            res.status(200).json({ message: "Voucher updated successfully" });
        } catch (error) {
            console.error("Error updating voucher:", error);
            res.status(500).send("Internal Server Error");
        }
    }
}

module.exports =  ManageVoucherController;

function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}