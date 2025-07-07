
console.log("mng s model running ");
const db = require("../db")

class mngsmodel{

    static async getAll() {
        try {
            const conn = await db.getConnection(); // Get DB connection
           const [data] = await conn.query(`
    SELECT 
        s.*, 
        c.cust_firm_name AS customer_name 
    FROM 
        tbl_mng_sales s
    LEFT JOIN 
        tbl_customers c 
    ON 
        s.customer_name = c.nid
`);

            
            console.log("Data:", data); // Debugging log
            conn.release(); // Release connection
            return data; // Return fetched user data
        } catch (error) {
            console.error("Error fetching purchases:", error);
            throw error; // Throw error to handle in controller
        }
    }

    static async createsales(salesData) {
        try {
            const {
                Customer, sales_date, due_date, lot_no, description,
                weight, weight_unit, pcs, price, tax, netamount, sales_person, commission_type, tax_7,
                commission_percentage, sales_commission, additional_charges,
                discount_percent, discount_amount, exchange_rate,
                nett_total_amount, multiply_price_by, actual_currency,
                currency_value, remarks,
            } = salesData;
    
            // Step 1: Check available pcs in stock
            const stockQuery = `SELECT pcs FROM tbl_managestockno WHERE lot = ?`;
            const [stockResult] = await db.execute(stockQuery, [lot_no]);
    
            if (stockResult.length === 0) {
                throw new Error("Lot number not found.");
            }
    
            const availablePcs = parseInt(stockResult[0].pcs, 10);
            const recivedPcs = parseInt(pcs, 10);
            console.log("Available pcs:", availablePcs);
            console.log("Received pcs:", pcs);
            // Step 2: Check if there are enough pcs available
            if (availablePcs < recivedPcs) {
                return { success: false, message: `Error: Can't sell ${recivedPcs} pieces. Only ${availablePcs} pieces available in stock.` };
               
            }

             // Step 2: Check available weight in stock
             const weightQuery = `SELECT weight FROM tbl_managestockno WHERE lot = ?`;
             const [weightResult] = await db.execute(weightQuery, [lot_no]);
     
             if (weightResult.length === 0) {
                 throw new Error("Lot number not found.");
             }
     
             const availableweight = parseInt(weightResult[0].weight, 10);
             const recivedweight = parseInt(weight, 10);
             console.log("Available pcs:", availableweight);
             console.log("Received pcs:", recivedweight);
             // Step 2: Check if there are enough pcs available
             if (availableweight < recivedweight) {
                 return { success: false, message: `Error: Can't sell ${recivedweight} weighted material. Only ${availableweight} weighted material available in stock.` };
                
             }

            const query = `
                INSERT INTO tbl_mng_sales (
                    customer_name, sales_date, due_date, lot_no, description,
                    weight, weight_unit, pcs, price, tax, net_amount, additional_charges,
                    discount_percent, discount_amount, exchange_rate,
                    net_total_amt, price_multiply_by, currency,
                    currency_value, remarks, sales_person, commission_type,
                    commission_percentage, sales_commission, tax_7
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
    
            const values = [
                Customer || null, sales_date || null, due_date || null, lot_no || null, description || null,
                weight || null, weight_unit || null, pcs || null, price || null, tax || null, netamount || null,
                additional_charges || null, discount_percent || null, discount_amount || null, exchange_rate || null,
                nett_total_amount || null, multiply_price_by || null, actual_currency || null,
                currency_value || null, remarks || null, sales_person || null,
                commission_type || null, commission_percentage || null, sales_commission || null, tax_7 || null
            ];
    
            const [result] = await db.execute(query, values);
            
            // Step 3: Update stock after successful sale
            const [oldValueResult] = await db.execute(`SELECT pcs FROM tbl_managestockno WHERE lot = ?`, [lot_no]);
            const old_value = oldValueResult.length > 0 ? oldValueResult[0].pcs : null; // Get the old pcs value
            await db.execute(`UPDATE tbl_managestockno SET weight=weight-? ,pcs = pcs -? WHERE lot = ?`, [weight, pcs, lot_no]);
           
            await db.execute(`insert into tbl_stock_log (lot, action, action_date,old_value,new_value,price,customer) values (?, 'sold', ?,?,?,?,?)`, [lot_no, sales_date,old_value,pcs,price,Customer]);
            console.log("Sale created successfully:");
            return { success: true, message: "Sale created successfully." };
        } catch (error) {
            console.error("Database Error in createSales:", error);
            throw error;
        }
    }

    static async createPayment(paymentData) {
        try {
            const {
                parent_id,
                customers,
                sale_ref_no,
                payment_mode,
                bank,
                payment_date,
                amount,
                remark,
                invoice_amount,
                total_paid,
                due_amount
            } = paymentData;
    
            const query = `
                INSERT INTO tbl_customer_payment (
                    customer_name, sale_ref, payment_mode, 
                    payment_date, amount, remark, parent_id, bank,
                    invoice_amount, paid_amount, due_amount
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
    
            const values = [
                customers || null, sale_ref_no || null, payment_mode || null,
                payment_date || null, amount || null, remark || null, parent_id || null, bank || null,
                invoice_amount || 0, total_paid || 0, due_amount || 0
            ];
    
            const [result] = await db.execute(query, values);
            return result;
        } catch (error) {
            console.error("Database Error in createPayment:", error);
            throw error;
        }
    }
    
    
    static async getPaymentDetailsByParentId(parentId) {
        console.log("Fetching Payment Details from Database...");
        console.log("Received Parent ID:", parentId);
    
        const query = `
            SELECT * FROM tbl_customer_payment WHERE parent_id = ?
        `;
        const values = [parentId];
    
        try {
            const [rows] = await db.execute(query, values);
            if (rows.length === 0) {
                console.error("No payment details found for Parent ID:", parentId);
                return null;
            }
            console.log("Payment Details Retrieved Successfully!");
            console.log("Payment Details:", rows);
            return rows[0]; // Return the first result
        } catch (error) {
            console.error("Database Error in getPaymentDetailsByParentId:", error);
            throw error;
        }
    }

    static async updatePaymentDetails(paymentData) {
        try {
            const { 
                parent_id,
                customers, sale_ref_no, payment_mode, payment_date, 
                amount, remark
            } = paymentData;
    
            const query = `
                UPDATE tbl_customer_payment SET
                    customer_name = ?,
                    sale_ref = ?,
                    payment_mode = ?,
                    payment_date = ?,
                    amount = ?,
                    remark = ?
                WHERE parent_id = ?
            `;
    
            const values = [
                customers || null, sale_ref_no || null, payment_mode || null, 
                payment_date || null, amount || null, remark || null , parent_id || null
            ];
    
            const [result] = await db.execute(query, values);
            return result;
        } catch (error) {
            console.error("Database Error in updatePaymentDetails:", error);
            throw error;
        }
    }

    
    static async getSaleDetailsById(saleId) {
        const query = `SELECT * FROM tbl_mng_sales WHERE nid = ?`;
        const [rows] = await db.execute(query, [saleId]);
        return {
            ...rows[0],
            customer_id: rows[0].customer_name,
            items: [{
                lot_no: rows[0].lot_no,
                description: rows[0].description,
                weight: rows[0].weight,
                weight_unit: rows[0].weight_unit,
                pcs: rows[0].pcs,
                price: rows[0].price,
                tax: rows[0].tax,
                netamount: rows[0].net_amount
            }]
        };
    }
    
    static async updateSaleById(saleId, data) {
        const query = `
            UPDATE tbl_mng_sales SET
                customer_name = ?, sales_date = ?, due_date = ?, lot_no = ?, description = ?,
                weight = ?, weight_unit = ?, pcs = ?, price = ?, tax = ?, net_amount = ?,
                additional_charges = ?, discount_percent = ?, discount_amount = ?,
                exchange_rate = ?, net_total_amt = ?, price_multiply_by = ?, currency = ?,
                currency_value = ?, remarks = ?, sales_person = ?, commission_type = ?,
                commission_percentage = ?, sales_commission = ?, tax_7 = ?
            WHERE nid = ?
        `;
    
        const values = [
            data.Customer, data.sales_date, data.due_date, data.lot_no, data.description,
            data.weight, data.weight_unit, data.pcs, data.price, data.tax, data.netamount,
            data.additional_charges, data.discount_percent, data.discount_amount,
            data.exchange_rate, data.nett_total_amount, data.multiply_price_by, data.actual_currency,
            data.currency_value, data.remarks, data.sales_person, data.commission_type,
            data.commission_percentage, data.sales_commission, data.tax_7, saleId
        ];
    
        await db.execute(query, values);
    }

    static async getInvoiceAmount(saleId) {
        const [rows] = await db.execute(
            "SELECT net_total_amt FROM tbl_mng_sales WHERE nid = ?",
            [saleId]
        );
        return parseFloat(rows[0]?.net_total_amt || 0);
    }
    
    static async getTotalPaidAmount(saleId) {
        const [rows] = await db.execute(
            "SELECT SUM(amount) as total_paid FROM tbl_customer_payment WHERE sale_ref = ?",
            [saleId]
        );
        return parseFloat(rows[0]?.total_paid || 0);
    }
    
    
}

module.exports = mngsmodel;