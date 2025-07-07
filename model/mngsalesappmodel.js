console.log("mng sa modep running ");
const db = require("../db");

class mngsamodel{

    static async getAll() {
        try {
            const conn = await db.getConnection(); // Get DB connection
            const [data] = await conn.query('SELECT * FROM tbl_sales_approvals'); // Fetch data
            console.log("Data:", data); // Debugging log
            conn.release(); // Release connection
            return data; // Return fetched user data
        } catch (error) {
            console.error("Error fetching approvals:", error);
            throw error; // Throw error to handle in controller
        } 
    }
       
    static async addSalesApproval(Customer, lot_no, description,weight_unit, weight,pcs, price, sales_person, net_amount) {
        try {
            console.log(Customer, lot_no, description, weight, price, sales_person);
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
                INSERT INTO tbl_sales_approvals (
                    customer_name, lot_no, description, weight, price, sales_person,weight_unit,pcs,net_amount
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)
            `;
    
            const values = [
                Customer || null, lot_no || null, description || null, weight || null, price || null, sales_person || null, weight_unit||null ,pcs||null, net_amount||null
            ];
    
            const [result] = await db.execute(query, values);

            const [oldValueResult] = await db.execute(`SELECT pcs FROM tbl_managestockno WHERE lot = ?`, [lot_no]);
            const old_value = oldValueResult.length > 0 ? oldValueResult[0].pcs : null; // Get the old pcs value

                // Step 6: Insert into tbl_stock_log with the current date (YYYY-MM-DD format)
            const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
            console.log("Current Date:", currentDate); // Debugging: Log the current date

            await db.execute(`UPDATE tbl_managestockno SET weight=weight-? ,pcs = pcs -? WHERE lot = ?`, [weight, pcs, lot_no]);
            await db.execute(`insert into tbl_stock_log (lot, action, action_date,old_value,new_value,price,customer) values (?, 'sale on approval', ?,?,?,?.?)`, [lot_no, currentDate,old_value,pcs,price,Customer]);
            return { success: true, message: "Sale approval created successfully." };
        } catch (error) {
            console.error("Database Error in sales approval", error);
            throw error;
        }
    }

    static async getApprovalDetails(id) {
        try {
            const conn = await db.getConnection(); // Get DB connection
            const [data] = await conn.query('SELECT * FROM tbl_sales_approvals WHERE nid = ?', [id]); // Fetch data
            console.log("Data:", data); // Debugging log
            conn.release(); // Release connection
            return data; // Return fetched user data
        } catch (error) {
            console.error("Error fetching approvals:", error);
            throw error; // Throw error to handle in controller
        } 
    }

    static async editApproval(id, Customers, approval_lot_no, approval_description, approval_weight_unit, approval_weight, approval_pcs, approval_price, status, Sales_person, approval_net_amount) {
        try {
            const [oldValueResult] = await db.execute(`SELECT pcs FROM tbl_managestockno WHERE lot = ?`, [approval_lot_no]);
            const old_value = oldValueResult.length > 0 ? oldValueResult[0].pcs : null;
            // Insert into tbl_salesapp_detail
             const query = `
                INSERT INTO tbl_salesapp_detail (customer_name, lot_no, description, weight, price, sales_person, status, sales_id, pcs, weight_unit,net_amount) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
            `;
    
            const values = [
                Customers || null, 
                approval_lot_no || null, 
                approval_description || null, 
                approval_weight || null, 
                approval_price || null, 
                Sales_person || null, 
                status || null, 
                id || null, 
                approval_pcs || null, 
                approval_weight_unit || null,
                approval_net_amount || null
            ];
    
            const [result] = await db.execute(query, values);
    
            // Update the status in tbl_sales_approvals
            await db.execute('UPDATE tbl_sales_approvals SET status = ? WHERE nid = ?', [status, id]);
    
            // If status is "Returned", add weight and pcs back to tbl_managestockno
            if (status.toLowerCase() === "returned") {
                const updateStockQuery = `
                    UPDATE tbl_managestockno 
                    SET weight = weight + ?, pcs = pcs + ? 
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
            const action = status.toLowerCase() === "approved" ? "sales approved" : "sales returned";
    
            // Get the new pcs value from tbl_managestockno
            const [newValueResult] = await db.execute(`SELECT pcs FROM tbl_managestockno WHERE lot = ?`, [approval_lot_no]);
            const new_value = newValueResult.length > 0 ? newValueResult[0].pcs : null;
    
            // Insert into tbl_stock_log
            await db.execute(
                `INSERT INTO tbl_stock_log (lot, action, action_date, old_value, new_value,price,customer) VALUES (?, ?, ?, ?, ?,?,?)`,
                [approval_lot_no, action, currentDate, old_value, new_value,approval_price,Customers]
            );
    
            return result;
        } catch (error) {
            console.error("Database Error in sales approval", error);
            throw error;
        }
    }

    static async updatesalesApproval(nid, Customer, lot_no, description, weight_unit, weight, pcs, price, sales_person, net_amount) {
        try {
            const [oldDataResult] = await db.execute('SELECT lot_no, pcs, weight FROM tbl_sales_approvals WHERE nid = ?', [nid]);
            const oldData = oldDataResult[0];
    
            // Step 1: Adjust stock (reverse old entry)
            await db.execute(`
                UPDATE tbl_managestockno 
                SET pcs = pcs - ?, weight = weight - ?
                WHERE lot = ?
            `, [oldData.pcs, oldData.weight, oldData.lot_no]);
    
            // Step 2: Update current entry
            await db.execute(`
                UPDATE tbl_sales_approvals 
                SET customer_name = ?, lot_no = ?, description = ?, weight = ?, price = ?, sales_person = ?, weight_unit = ?, pcs = ?, net_amount = ?
                WHERE nid = ?
            `, [
                Customer, lot_no, description, weight, price, sales_person,
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
                INSERT INTO tbl_stock_log (lot, action, action_date, old_value, new_value, price, customer)
                VALUES (?, 'sales approval edited', ?, ?, ?, ?, ?)
            `, [lot_no, currentDate, oldData.pcs, pcs, price, Customer]);
    
            return { success: true };
        } catch (error) {
            console.error("Error updating sales approval:", error);
            throw error;
        }
    }

}

module.exports = mngsamodel;
