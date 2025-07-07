console.log("mng pa modep running ");
const db = require("../db");
 
class mngpamodel{

    static async getAll() {
        try {
            const conn = await db.getConnection(); // Get DB connection
            const [data] = await conn.query('SELECT * FROM tbl_purchase_approvals'); // Fetch data
            console.log("Data:", data); // Debugging log
            conn.release(); // Release connection
            return data; // Return fetched user data
        } catch (error) {
            console.error("Error fetching approvals:", error);
            throw error; // Throw error to handle in controller
        }
    }
 
    static async addPurchaseApproval(Suppliers, lot_no, description,weight_unit, weight,pcs, price, sales_person,net_amount) {
        try {
            console.log(Suppliers, lot_no, description, weight, price, sales_person,net_amount);
            
            const query = `
                INSERT INTO tbl_purchase_approvals (
                    supplier_name, lot_no, description, weight, price, sales_person,weight_unit,pcs,net_amount
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)
            `;
    
            const values = [
                Suppliers || null, lot_no || null, description || null, weight || null, price || null, sales_person || null, weight_unit||null ,pcs||null ,net_amount||null
            ];
    
            const [result] = await db.execute(query, values);

            const [oldValueResult] = await db.execute(`SELECT pcs FROM tbl_managestockno WHERE lot = ?`, [lot_no]);
            const old_value = oldValueResult.length > 0 ? oldValueResult[0].pcs : null; // Get the old pcs value

                // Step 6: Insert into tbl_stock_log with the current date (YYYY-MM-DD format)
            const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
            console.log("Current Date:", currentDate); // Debugging: Log the current date

            await db.execute(`UPDATE tbl_managestockno SET weight=weight+? ,pcs = pcs +? WHERE lot = ?`, [weight, pcs, lot_no]);
            await db.execute(`insert into tbl_stock_log (lot, action, action_date,old_value,new_value,price,supplier) values (?, 'purchase on approval', ?,?,?,?,?)`, [lot_no, currentDate,old_value,pcs,price,Suppliers]);
            return { success: true, message: "purchase approval created successfully." };
        } catch (error) {
            console.error("Database Error in purchase approval", error);
            throw error;
        }
    }

    static async getApprovalDetails(id) {
        try {
            const conn = await db.getConnection(); // Get DB connection
            const [data] = await conn.query('SELECT * FROM tbl_purchase_approvals WHERE nid = ?', [id]); // Fetch data
            console.log("Data:", data); // Debugging log
            conn.release(); // Release connection
            return data; // Return fetched user data
        } catch (error) {
            console.error("Error fetching approvals:", error);
            throw error; // Throw error to handle in controller
        } 
    }

    static async editApproval(id, Suppliers, approval_lot_no, approval_description, approval_weight_unit, approval_weight, approval_pcs, approval_price, status, Sales_person,approval_net_amount) {
        try {
            const [oldValueResult] = await db.execute(`SELECT pcs FROM tbl_managestockno WHERE lot = ?`, [approval_lot_no]);
            const old_value = oldValueResult.length > 0 ? oldValueResult[0].pcs : null;
            
             const query = `
                INSERT INTO tbl_purchaseapp_detail (supplier_name, lot_no, description, weight, price, sales_person, status, sales_id, pcs, weight_unit,net_amount) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
            `;
    
            const values = [
                Suppliers || null, 
                approval_lot_no || null, 
                approval_description || null, 
                approval_weight || null, 
                approval_price || null, 
                Sales_person || null, 
                status || null, 
                id || null, 
                approval_pcs || null, 
                approval_weight_unit || null
                ,approval_net_amount || null
            ];
    
            const [result] = await db.execute(query, values);
    
            
            await db.execute('UPDATE tbl_purchase_approvals SET status = ? WHERE nid = ?', [status, id]);
    
            // If status is "Returned", add weight and pcs back to tbl_managestockno
            if (status.toLowerCase() === "returned") {
                const updateStockQuery = `
                    UPDATE tbl_managestockno 
                    SET weight = weight - ?, pcs = pcs - ? 
                    WHERE lot = ?
                `;
    
                const updateStockValues = [
                    approval_weight || 0, 
                    approval_pcs || 0, 
                    approval_lot_no
                ];
    
                await db.execute(updateStockQuery, updateStockValues);
                console.log("✅ Weight and pcs added back to tbl_managestockno for lot:", approval_lot_no);
            }
    
            // Step 6: Insert into tbl_stock_log with the current date (YYYY-MM-DD format)
            const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
            console.log("Current Date:", currentDate); // Debugging: Log the current date
    
            // Determine the action based on the status
            const action = status.toLowerCase() === "approved" ? "purchase approved" : "purchase returned";
    
            // Get the new pcs value from tbl_managestockno
            const [newValueResult] = await db.execute(`SELECT pcs FROM tbl_managestockno WHERE lot = ?`, [approval_lot_no]);
            const new_value = newValueResult.length > 0 ? newValueResult[0].pcs : null;
    
            // Insert into tbl_stock_log
            await db.execute(
                `INSERT INTO tbl_stock_log (lot, action, action_date, old_value, new_value,price,supplier) VALUES (?, ?, ?, ?, ?,?,?)`,
                [approval_lot_no, action, currentDate, old_value, new_value,approval_price,Suppliers]
            );
    
            return result;
        } catch (error) {
            console.error("Database Error in sales approval", error);
            throw error;
        }
    }

    static async updatePurchaseApproval(nid, supplier, lot_no, description, weight_unit, weight, pcs, price, sales_person, net_amount) {
        try {
            const [oldDataResult] = await db.execute('SELECT lot_no, pcs, weight FROM tbl_purchase_approvals WHERE nid = ?', [nid]);
            const oldData = oldDataResult[0];
    
            // Step 1: Adjust stock (reverse old entry)
            await db.execute(`
                UPDATE tbl_managestockno 
                SET pcs = pcs - ?, weight = weight - ?
                WHERE lot = ?
            `, [oldData.pcs, oldData.weight, oldData.lot_no]);
    
            // Step 2: Update current entry
            await db.execute(`
                UPDATE tbl_purchase_approvals 
                SET supplier_name = ?, lot_no = ?, description = ?, weight = ?, price = ?, sales_person = ?, weight_unit = ?, pcs = ?, net_amount = ?
                WHERE nid = ?
            `, [
                supplier, lot_no, description, weight, price, sales_person,
                weight_unit, pcs, net_amount, nid
            ]);
    
            // Step 3: Update stock with new values
            await db.execute(`
                UPDATE tbl_managestockno 
                SET pcs = pcs + ?, weight = weight + ?
                WHERE lot = ?
            `, [pcs, weight, lot_no]);
    
            // Step 4: Log the change
            const currentDate = new Date().toISOString().split('T')[0];
            await db.execute(`
                INSERT INTO tbl_stock_log (lot, action, action_date, old_value, new_value, price, supplier)
                VALUES (?, 'purchase approval edited', ?, ?, ?, ?, ?)
            `, [lot_no, currentDate, oldData.pcs, pcs, price, supplier]);
    
            return { success: true };
        } catch (error) {
            console.error("Error updating purchase approval:", error);
            throw error;
        }
    }
    

}

module.exports = mngpamodel;
