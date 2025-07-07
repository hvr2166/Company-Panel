console.log("pirchase approvals running ");
const purchasemodel= require("../model/mngpurchasemodel");
const supname = require("../model/mngsuppliermodel");
const salesname =require("../model/mngsalepersonmodel");
const Lots =require("../model/mngstocknomodel");
const payments = require("../model/mngsupplierpaymentmodel");
const banks = require("../model/mngbankmodel");
const xlsx = require("xlsx");
const path = require("path");
const fs = require("fs");
const db =require("../db");

class mngpurchasecontroller{
 
    static async getAll(req, res) {
        try {
            console.log("Fetching  purchase approvals...");
            const users = await purchasemodel.getAll(); // Fetch all users from the model
            const names = await supname.getAll();
            const snames = await salesname.getAll();
            const lots = await Lots.getAll();
           const pay = await payments.getAll();
           const banksData = await banks.getAll();
            res.render('managepurchase', {pay ,users ,names ,snames, lots,banksData}); // Pass users data to the EJS view
        } catch (error) {
            console.error("Error fetching pa:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    static async addpurchase(req, res) {
        console.log("Adding Purchase...");
        console.log("Received Data:", req.body);
    
        const {
            supplier, purchase_date, due_date, additional_charges,
            discount_percent, discount_amount, exchange_rate,
            nett_total_amount, multiply_price_by, actual_currency,
            currency_value, remarks, item
        } = req.body;
    
        // Check for required fields
        if (!supplier || !purchase_date || !due_date || !item || item.length === 0) {
            console.error("Missing required fields! Received:", req.body);
            req.flash("error", "Required fields are missing");
            return res.status(400).send("Required fields are missing");
        }
    
        try {
            // Iterate over each item and create a purchase entry
            for (const itemDetail of item) {
                const {
                    lot_no, description, weight_unit ,weight,pcs , price, tax, netamount
                } = itemDetail;
    
                // Check for required item fields
                if (!lot_no || !description || !weight_unit || !weight ||!pcs|| !price || !tax || !netamount) {
                    console.error("Missing item fields! Received:", itemDetail);
                    req.flash("error", "Item fields are missing");
                    return res.status(400).send("Item fields are missing");
                }
    
                // Create purchase entry for each item
                await purchasemodel.createPurchase({
                    supplier, purchase_date, due_date, lot_no, description,weight_unit,pcs,  
                    weight, price, tax, netamount, additional_charges,
                    discount_percent, discount_amount, exchange_rate,
                    nett_total_amount, multiply_price_by, actual_currency,
                    currency_value, remarks
                });
            }
    
            req.flash("success", "Purchase added successfully!");
            return res.status(200).send("Purchase added successfully");
        } catch (error) {
            console.error("Error adding purchase:", error);
            req.flash("error", "Internal Server Error");
            return res.status(500).send("Internal Server Error");
        }
    }

    static async addpurchasepayment(req, res) {
        console.log("Adding Supplier Payment...");
        console.log("Received Data:", req.body);
    
        const { parent_id ,suppliers, purchase_ref_no, payment_mode,bank, payment_date, amount, remark} = req.body;
    
        if ( !parent_id || !suppliers || !purchase_ref_no || !payment_mode || !payment_date || !amount) {
            console.error("Missing required fields! Received:", req.body);
            req.flash("error", "Required fields are missing");
            return res.status(400).send("Required fields are missing");
        }
    
        try {

               // 1. Get total invoice amount from sales
               const invoice_amount = await purchasemodel.getInvoiceAmount(purchase_ref_no);
    
               // 2. Get total paid before this payment
               const paid_before = await purchasemodel.getTotalPaidAmount(purchase_ref_no);
       
               // 3. Calculate total paid (including current)
               const total_paid = paid_before + parseFloat(amount);
               const due_amount = invoice_amount - total_paid;
    
               
            await purchasemodel.createPayment({
                parent_id,
                suppliers,
                purchase_ref_no,
                payment_mode,
                payment_date,
                amount,
                remark,
                bank,
                invoice_amount,
                total_paid,
                due_amount
            });
    
            req.flash("success", "Supplier Payment added successfully!");
            return res.status(200).send("Supplier Payment added successfully");
        } catch (error) {
            console.error("Error adding supplier payment:", error);
            req.flash("error", "Internal Server Error");
            return res.status(500).send("Internal Server Error");
        }
    }
    
    static async getPaymentDetails(req, res) {
        console.log("Fetching Payment Details...");
        console.log("Received Purchase ID:", req.params.id);
    
        const purchaseId = req.params.id;
    
        if (!purchaseId) {
            console.error("Missing purchase ID!");
            req.flash("error", "Purchase ID is required");
            return res.status(400).send("Purchase ID is required");
        }
    
        try {
            const paymentDetails = await purchasemodel.getPaymentDetailsByParentId(purchaseId);
    
            return res.status(200).json(paymentDetails);
        } catch (error) {
            console.error("Error fetching payment details:", error);
            req.flash("error", "Internal Server Error");
            return res.status(500).send("Internal Server Error");
        }
    }

    static async updatePaymentDetails(req, res) {
        console.log("Updating Payment Details...");
        console.log("Received Data:", req.body);
    
        const { parent_id, suppliers, purchase_ref_no, payment_mode, payment_date, bank , amount, remark } = req.body;
    
        if (!parent_id || !suppliers || !purchase_ref_no || !payment_mode || !payment_date || !amount) {
            console.error("Missing required fields! Received:", req.body);
            req.flash("error", "Required fields are missing");
            return res.status(400).send("Required fields are missing");
        }
    
        try {
            await purchasemodel.updatePaymentDetails({
                parent_id,
                suppliers,
                purchase_ref_no,
                payment_mode,
                bank,
                payment_date,
                amount,
                remark
            });
    
            req.flash("success", "Supplier Payment updated successfully!");
            return res.status(200).send("Supplier Payment updated successfully");
        } catch (error) {
            console.error("Error updating supplier payment:", error);
            req.flash("error", "Internal Server Error");
            return res.status(500).send("Internal Server Error");
        }
    }

    static async getPurchaseDetails(req, res) {
        console.log("Fetching Purchase Details...");
        console.log("Received Purchase ID:", req.params.id);
    
        const purchaseId = req.params.id;
    
        if (!purchaseId) {
            console.error("Missing purchase ID!");
            return res.status(400).json({ status: "error", message: "Purchase ID is required" });
        }
    
        try {
            const purchaseDetails = await purchasemodel.getPurchaseDetailsById(purchaseId);
            if (!purchaseDetails) {
                return res.status(404).json({ status: "error", message: "Purchase not found" });
            }
            return res.status(200).json(purchaseDetails); // Send the purchase details directly
        } catch (error) {
            console.error("Error fetching purchase details:", error);
            return res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }

    static async updatePurchase(req, res) {
        console.log("Updating Purchase...");
        console.log("Received Data:", req.body);
    
        const purchaseId = req.params.id;
    
        if (!purchaseId) {
            console.error("Missing purchase ID!");
            return res.status(400).json({ status: "error", message: "Purchase ID is required" });
        }
    
        try {
            const item = req.body.item && req.body.item[0]; // ✅ pick first item from array
            if (!item) {
                return res.status(400).json({ status: "error", message: "Item details missing" });
            }
    
            const data = {
                ...req.body,
                lot_no: item.lot_no,
                description: item.description,
                weight: item.weight,
                pcs: item.pcs,
                price: item.price,
                tax: item.tax,
                netamount: item.netamount
            };
    
            await purchasemodel.updatePurchaseById(purchaseId, data);
            return res.status(200).json({ status: "success", message: "Purchase updated successfully!" });

        } catch (error) {
            console.error("Error updating purchase:", error);
            return res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }

    static async uploadExcel(req, res) {
        try {
          if (!req.files || req.files.length === 0) {
            return res.status(400).send("No file uploaded");
          }
      
          // Find the uploaded Excel file
          const file = req.files.find(f => f.fieldname === "excelFile");
          if (!file) {
            return res.status(400).send("Excel file not found");
          }
      
          const workbook = xlsx.readFile(file.path);
          const sheetName = workbook.SheetNames[0];
          const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
      
          for (const row of sheet) {
            await purchasemodel.createPurchase({
              supplier: row.supplier,
              purchase_date: row.purchase_date,
              due_date: row.due_date,
              lot_no: row.lot_no,
              description: row.description,
              weight: row.weight,
              weight_unit: row.weightunit,
              pcs: row.pcs,
              price: row.price,
              tax: row.tax,
              netamount: row.net_amount,
              additional_charges: row.additional_charges,
              discount_percent: row.discount_percent,
              discount_amount: row.discount_amount,
              exchange_rate: row.exchange_rate,
              nett_total_amount: row.net_total_amt,
              multiply_price_by: row.price_multiply_by,
              actual_currency: row.currency,
              currency_value: row.currency_value,
              remarks: row.remarks,
            });
          }
      
          fs.unlinkSync(file.path); // Optional: remove file after processing
      
          req.flash("success", "Excel file uploaded and processed successfully!");
          res.redirect("/manage%20purchase");
        } catch (error) {
          console.error("Excel Upload Error:", error);
          res.status(500).send("Failed to upload purchases");
        }
      }
      
      
    
static async downloadSampleExcel(req, res) {
    try {
        const workbook = xlsx.utils.book_new();

        // 1. Sample Sheet
        const sampleData = [{
            supplier: "1",
            purchase_date: "2025-04-03",
            due_date: "2025-04-22",
            lot_no: "xyz",
            description: "test item",
            weight: "100",
            weightunit: "carat",
            pcs: "10",
            price: "50",
            tax: "5",
            net_amount: "525",
            additional_charges: "5",
            discount_percent: "2",
            discount_amount: "10",
            exchange_rate: "1",
            net_total_amt: "520",
            price_multiply_by: "1",
            currency: "THB",
            currency_value: "1",
            remarks: "Test entry"
        }];
        const sampleSheet = xlsx.utils.json_to_sheet(sampleData);
        xlsx.utils.book_append_sheet(workbook, sampleSheet, "Sample Purchase");

        // 2. Suppliers Sheet
        const [suppliers] = await db.query("SELECT nid, sup_name FROM tbl_suppliers WHERE b_status = 1");
        const supplierFormatted = suppliers.map(s => ({
            supplier_id: s.nid,
            supplier_name: s.sup_name
        }));
        const supplierSheet = xlsx.utils.json_to_sheet(supplierFormatted);
        xlsx.utils.book_append_sheet(workbook, supplierSheet, "Suppliers");

        // 3. Lots Info Sheet
        const [lots] = await db.query("SELECT lot, weight, pcs FROM tbl_managestockno WHERE b_status = 1");
        const lotFormatted = lots.map(l => ({
            lot_no: l.lot,
            weight: l.weight,
            pcs: l.pcs
        }));
        const lotSheet = xlsx.utils.json_to_sheet(lotFormatted);
        xlsx.utils.book_append_sheet(workbook, lotSheet, "Lot Info");

        // Write to file
        const filePath = path.join(__dirname, "../public/sample_purchase.xlsx");
        xlsx.writeFile(workbook, filePath);

        // Send file
        res.download(filePath);
    } catch (error) {
        console.error("Error generating sample Excel:", error);
        res.status(500).send("Failed to generate sample file");
    }
}


    static async getpurchaseInvoicePaymentSummary(req, res) {
        const purchaseId = req.params.id;
        try {
          const [[invoice]] = await db.execute("SELECT net_total_amt FROM tbl_mng_purchase WHERE nid = ?", [purchaseId]);
          const [[payment]] = await db.execute("SELECT SUM(amount) as total_paid FROM tbl_supplier_payment WHERE purchase_ref = ?", [purchaseId]);
      
          const total = parseFloat(invoice?.net_total_amt || 0);
          const paid = parseFloat(payment?.total_paid || 0);
      
          res.status(200).json({
            total,
            paid,
            due: (total - paid)
          });
        } catch (err) {
          console.error("Error fetching invoice summary:", err);
          res.status(500).json({ error: "Failed to fetch purchase/payment summary." });
        }
      }
    
}

module.exports = mngpurchasecontroller