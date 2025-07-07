
console.log("mng p model running ");
const db = require("../db")

class mngpmodel{

    static async getAll() {
        try {
            const conn = await db.getConnection(); // Get DB connection
            const [data] = await conn.query(`
                SELECT 
                    p.*, 
                    s.sup_name AS supplier_name 
                FROM 
                    tbl_mng_purchase p
                LEFT JOIN 
                    tbl_suppliers s 
                ON 
                    p.supplier_name = s.nid
            `);
            console.log("Data:", data); // Debugging log
            conn.release(); // Release connection
            return data; // Return fetched user data
        } catch (error) {
            console.error("Error fetching purchases:", error);
            throw error; // Throw error to handle in controller
        }
    }

    static async createPurchase(purchaseData) {
        try {
            const {
                supplier, purchase_date, due_date, lot_no, description,weight_unit,pcs,
                weight, price, tax, netamount, additional_charges,
                discount_percent, discount_amount, exchange_rate,
                nett_total_amount, multiply_price_by, actual_currency,
                currency_value, remarks
            } = purchaseData;

            const query = `
                INSERT INTO tbl_mng_purchase (
                    supplier_name, purchase_date, due_date, lot_no, description,
                    weight, price, tax, net_amount, additional_charges,
                    discount_percent, discount_amount, exchange_rate,
                    net_total_amt, price_multiply_by, currency,
                    currency_value, remarks ,weightunit,pcs
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)
            `;

             const values = [
                supplier || null, purchase_date || null, due_date || null, lot_no || null, description || null,
                weight || null, price || null, tax || null, netamount || null, additional_charges || null,
                discount_percent || null, discount_amount || null, exchange_rate || null,
                nett_total_amount || null, multiply_price_by || null, actual_currency || null,
                currency_value || null, remarks || null ,weight_unit || null,pcs || null
            ];

            const [oldValueResult] = await db.execute(`SELECT pcs, price FROM tbl_managestockno WHERE lot = ?`, [lot_no]);
            const old_value = oldValueResult.length > 0 ? oldValueResult[0].pcs : null;
            const old_price = oldValueResult.length > 0 ? oldValueResult[0].price : null;

            // 2. Compute new average price
            let final_price = parseFloat(price);
            if (old_price !== null) {
            const parsed_old = parseFloat(old_price);
            final_price = (parsed_old + final_price) / 2;
            }

            // 3. Update with average price
            await db.execute(
            `UPDATE tbl_managestockno SET weight = ?, pcs = ?, price = ? WHERE lot = ?`,
            [weight, pcs, final_price, lot_no]
            );

            // 4. Insert into stock log
            await db.execute(
            `INSERT INTO tbl_stock_log (lot, action, action_date, old_value, new_value, price, supplier) 
            VALUES (?, 'purchased', ?, ?, ?, ?, ?)`,
            [lot_no, purchase_date, old_value, pcs, final_price, supplier]);

            const result = await db.execute(query, values);    

            return result;
        } catch (error) {
            console.error("Database Error in createPurchase:", error);
            throw error;
        }
    }

    static async createPayment(paymentData) {
        try {
            const { 
                parent_id,
                suppliers, purchase_ref_no, payment_mode, bank, payment_date, 
                amount, remark,
                invoice_amount,
                total_paid,
                due_amount
            } = paymentData;
    
            const query = `
                INSERT INTO tbl_supplier_payment (
                    supplier_name, purchase_ref, payment_mode, 
                    payment_date, amount, remark ,parent_id,bank,
                    invoice_amount, paid_amount, due_amount
                ) VALUES (?, ?, ?, ?, ?, ?,?,?,?,?,?)
            `;
    
            const values = [
                suppliers || null, purchase_ref_no || null, payment_mode || null, 
                payment_date || null, amount || null, remark || null , parent_id || null, bank || null,
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
            SELECT * FROM tbl_supplier_payment WHERE parent_id = ?
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
                suppliers, purchase_ref_no, payment_mode, payment_date, 
                amount, remark
            } = paymentData;
    
            const query = `
                UPDATE tbl_supplier_payment SET
                    supplier_name = ?,
                    purchase_ref = ?,
                    payment_mode = ?,
                    payment_date = ?,
                    amount = ?,
                    remark = ?
                WHERE parent_id = ?
            `;
    
            const values = [
                suppliers || null, purchase_ref_no || null, payment_mode || null, 
                payment_date || null, amount || null, remark || null , parent_id || null
            ];
    
            const [result] = await db.execute(query, values);
            return result;
        } catch (error) {
            console.error("Database Error in updatePaymentDetails:", error);
            throw error;
        }
    }

    static async getPurchaseDetailsById(purchaseId) {
        console.log("Fetching Purchase Details from Database...");
        console.log("Received Purchase ID:", purchaseId);
    
        const query = `
            SELECT * FROM tbl_mng_purchase WHERE nid = ?
        `;
        const values = [purchaseId];
    
        try {
            const [rows] = await db.execute(query, values);
            if (rows.length === 0) {
                console.error("No purchase details found for Purchase ID:", purchaseId);
                return null;
            }
    
            // Return the purchase details directly
            const purchaseDetails = rows[0];
            console.log("Purchase Details Retrieved Successfully!");
            console.log("Purchase Details:", purchaseDetails);
            return purchaseDetails;
        } catch (error) {
            console.error("Database Error in getPurchaseDetailsById:", error);
            throw error;
        }
    }


   static async updatePurchaseById(purchaseId, data) {
    console.log("Updating Purchase in Database...");
    console.log("Received Purchase ID:", purchaseId);
    console.log("Received Data:", data);

    const formattedData = {
        supplier_name: data.supplier || null,
        purchase_date: data.purchase_date || null,
        due_date: data.due_date || null,
        lot_no: data.lot_no || null,
        description: data.description || null,
        weight: data.weight || null,
        pcs: data.pcs || null,
        price: data.price || null,
        tax: data.tax || null,
        net_amount: data.netamount || null,
        additional_charges: data.additional_charges || null,
        discount_percent: data.discount_percent || null,
        discount_amount: data.discount_amount || null,
        exchange_rate: data.exchange_rate || null,
        net_total_amt: data.nett_total_amount || null,
        price_multiply_by: data.multiply_price_by || null,
        currency: data.actual_currency || null,
        currency_value: data.currency_value || null,
        remarks: data.remarks || null
    };

    const query = `
        UPDATE tbl_mng_purchase SET
            supplier_name = ?,
            purchase_date = ?,
            due_date = ?,
            lot_no = ?,
            description = ?,
            weight = ?,
            pcs = ?,
            price = ?,
            tax = ?,
            net_amount = ?,
            additional_charges = ?,
            discount_percent = ?,
            discount_amount = ?,
            exchange_rate = ?,
            net_total_amt = ?,
            price_multiply_by = ?,
            currency = ?,
            currency_value = ?,
            remarks = ?
        WHERE nid = ?
    `;

    const values = [
        formattedData.supplier_name,
        formattedData.purchase_date,
        formattedData.due_date,
        formattedData.lot_no,
        formattedData.description,
        formattedData.weight,
        formattedData.pcs,
        formattedData.price,
        formattedData.tax,
        formattedData.net_amount,
        formattedData.additional_charges,
        formattedData.discount_percent,
        formattedData.discount_amount,
        formattedData.exchange_rate,
        formattedData.net_total_amt,
        formattedData.price_multiply_by,
        formattedData.currency,
        formattedData.currency_value,
        formattedData.remarks,
        purchaseId
    ];

    try {
        const [result] = await db.execute(query, values);
        return result;
    } catch (error) {
        console.error("Database Error in updatePurchaseById:", error);
        throw error;
    }
}


static async getInvoiceAmount(purchaseId) {
    const [rows] = await db.execute(
        "SELECT net_total_amt FROM tbl_mng_purchase WHERE nid = ?",
        [purchaseId]
    );
    return parseFloat(rows[0]?.net_total_amt || 0);
}

static async getTotalPaidAmount(purchaseId) {
    const [rows] = await db.execute(
        "SELECT SUM(amount) as total_paid FROM tbl_supplier_payment WHERE purchase_ref = ?",
        [purchaseId]
    );
    return parseFloat(rows[0]?.total_paid || 0);
}


    

}

module.exports = mngpmodel;