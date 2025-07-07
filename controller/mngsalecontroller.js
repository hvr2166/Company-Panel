console.log("sales running ");
const salesmodel= require("../model/mngsalesmodel");
const Customers = require("../model/mngcustomermodel");
const salesname =require("../model/mngsalepersonmodel");
const Lots =require("../model/mngstocknomodel");
const banks = require("../model/mngbankmodel");
const db = require("../db");


class mngsalecontroller{

    static async getAll(req, res) {
        try {
            console.log("Fetching  sales...");
            const users = await salesmodel.getAll(); // Fetch all users from the model
            const names = await Customers.getAll();
            const snames = await salesname.getAll();
            const lots = await Lots.getAll();
            const banksData = await banks.getAll();
          
            res.render('managesales', { users,names ,snames, lots , banksData}); // Pass users data to the EJS view
        } catch (error) {
            console.error("Error fetching s:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    static async addsale(req, res) {
        console.log("Adding sales...");
        console.log("Received Data:", req.body);
    
        const {
            Customer, sales_date, due_date, additional_charges,
            discount_percent, discount_amount, exchange_rate,
            nett_total_amount, multiply_price_by, actual_currency,
            currency_value, remarks, item,
            sales_person, commission_type, commission_percentage, sales_commission, tax_7
        } = req.body;
    
        // Check for required fields
        if (!Customer || !sales_date || !due_date) {
            console.error("Missing required fields! Received:", req.body);
            req.flash("error", "Required fields are missing");
            return res.status(400).send("Required fields are missing");
        }
    
        try {
            // Iterate over each item and create a sale entry
            for (const itemDetail of item) {
                const {
                    lot_no, description, weight, weight_unit, pcs, price, tax, netamount
                } = itemDetail;
    
                // Check for required item fields
                if (!lot_no || !description || !weight || !weight_unit || !pcs || !price || !tax || !netamount) {
                    console.error("Missing item fields! Received:", itemDetail);
                    req.flash("error", "Item fields are missing");
                    return res.status(400).send("Item fields are missing");
                }
    
                // Create sales entry for each item
                const saleResponse = await salesmodel.createsales({
                    Customer, sales_date, due_date, lot_no, description,
                    weight, weight_unit, pcs, price, tax, netamount, additional_charges,
                    discount_percent, discount_amount, exchange_rate,
                    nett_total_amount, multiply_price_by, actual_currency,
                    currency_value, remarks, sales_person, commission_type,
                    commission_percentage, sales_commission, tax_7
                });
    
                // Check if the sale was successful
                if (!saleResponse.success) {
                    // If not successful, handle the error
                    console.error("Sale creation failed:", saleResponse.message);
                    req.flash("error", saleResponse.message); // Set flash message
                    return res.status(400).send(saleResponse.message); // Send error message back to client
                }
            }
    
            req.flash("success", "Sales added successfully!");
            return res.status(200).send("Sales added successfully");
        } catch (error) {
            console.error("Error adding sales:", error);
            req.flash("error", "Internal Server Error");
            return res.status(500).send("Internal Server Error");
        }
    }

    static async addsalepayment(req, res) {
        console.log("Adding Customer Payment...");
        console.log("Received Data:", req.body);
    
        const {
            parent_id,
            customers,
            sale_ref_no,
            payment_mode,
            bank,
            payment_date,
            amount,
            remark
        } = req.body;
    
        if (!parent_id || !customers || !sale_ref_no || !payment_mode || !payment_date || !amount) {
            console.error("Missing required fields! Received:", req.body);
            req.flash("error", "Required fields are missing");
            return res.status(400).send("Required fields are missing");
        }
    
        try {
            // 1. Get total invoice amount from sales
            const invoice_amount = await salesmodel.getInvoiceAmount(sale_ref_no);
    
            // 2. Get total paid before this payment
            const paid_before = await salesmodel.getTotalPaidAmount(sale_ref_no);
    
            // 3. Calculate total paid (including current)
            const total_paid = paid_before + parseFloat(amount);
            const due_amount = invoice_amount - total_paid;
    
            // 4. Save payment
            await salesmodel.createPayment({
                parent_id,
                customers,
                sale_ref_no,
                payment_mode,
                payment_date,
                amount,
                remark,
                bank,
                invoice_amount,
                total_paid,
                due_amount
            });
    
            req.flash("success", "Customer Payment added successfully!");
            return res.status(200).send("Customer Payment added successfully");
        } catch (error) {
            console.error("Error adding Customer payment:", error);
            req.flash("error", "Internal Server Error");
            return res.status(500).send("Internal Server Error");
        }
    }
    
    
    static async getPaymentDetails(req, res) {
        console.log("Fetching Payment Details...");
        console.log("Received salesId:", req.params.id);
    
        const salesId = req.params.id;
    
        if (!salesId) {
            console.error("Missing salesId!");
            req.flash("error", "salesId is required");
            return res.status(400).send("salesId is required");
        }
    
        try {
            const paymentDetails = await salesmodel.getPaymentDetailsByParentId(salesId);
    
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
    
        const { parent_id, customers, sale_ref_no, payment_mode, bank ,payment_date, amount, remark } = req.body;
    
        if (!parent_id || !customers || !sale_ref_no || !payment_mode || !payment_date || !amount) {
            console.error("Missing required fields! Received:", req.body);
            req.flash("error", "Required fields are missing");
            return res.status(400).send("Required fields are missing");
        }
    
        try {
            await salesmodel.updatePaymentDetails({
                parent_id,
                customers,
                sale_ref_no,
                payment_mode,
                bank,
                payment_date,
                amount,
                remark
            });
    
            req.flash("success", "Customer Payment updated successfully!");
            return res.status(200).send("Customer Payment updated successfully");
        } catch (error) {
            console.error("Error updating Customer payment:", error);
            req.flash("error", "Internal Server Error");
            return res.status(500).send("Internal Server Error");
        }
    }
    
    static async getSaleDetails(req, res) {
        const saleId = req.params.id;
        if (!saleId) return res.status(400).send("Sale ID is required");
    
        try {
            const saleDetails = await salesmodel.getSaleDetailsById(saleId);
            return res.status(200).json(saleDetails);
        } catch (error) {
            console.error("Error fetching sale details:", error);
            return res.status(500).send("Internal Server Error");
        }
    }
    
    static async updateSale(req, res) {
        const saleId = req.params.id;
        if (!saleId) return res.status(400).send("Sale ID is required");
    
        try {
            const item = req.body.item[0];
            const updatedData = {
                ...req.body,
                lot_no: item.lot_no,
                description: item.description,
                weight: item.weight,
                weight_unit: item.weight_unit,
                pcs: item.pcs,
                price: item.price,
                tax: item.tax,
                netamount: item.netamount
            };
            console.log("Updating sale with ID:", saleId);
            console.log("Updated Data:", updatedData);
            await salesmodel.updateSaleById(saleId, updatedData);
            return res.status(200).json({ status: "success", message: "Sale updated successfully" });
        } catch (error) {
            console.error("Error updating sale:", error);
            return res.status(500).json({ status: "error", message: "Failed to update sale" });
        }
    }

    static async getSaleInvoicePaymentSummary(req, res) {
        const saleId = req.params.id;
        try {
          const [[invoice]] = await db.execute("SELECT net_total_amt FROM tbl_mng_sales WHERE nid = ?", [saleId]);
          const [[payment]] = await db.execute("SELECT SUM(amount) as total_paid FROM tbl_customer_payment WHERE sale_ref = ?", [saleId]);
      
          const total = parseFloat(invoice?.net_total_amt || 0);
          const paid = parseFloat(payment?.total_paid || 0);
      
          res.status(200).json({
            total,
            paid,
            due: (total - paid)
          });
        } catch (err) {
          console.error("Error fetching invoice summary:", err);
          res.status(500).json({ error: "Failed to fetch sale/payment summary." });
        }
      }
      
    

}

module.exports = mngsalecontroller;