const db = require("../db"); // No need for .promise() here

class Ledger {
    static async fetchLedgerData(searchQuery) {
        try {
            let query = `
                SELECT 
                    date, customer_name, type, commission, cash_in, cash_out, due_date 
                FROM (
                    SELECT sales_date AS date, customer_name, 'sales' AS type, 
                        commission_type AS commission, net_total_amt AS cash_in, 
                        NULL AS cash_out, due_date 
                    FROM tbl_mng_sales
                    
                    UNION ALL
                    
                    SELECT purchase_date AS date, supplier_name AS customer_name, 'purchase' AS type, 
                        NULL AS commission, NULL AS cash_in, net_total_amt AS cash_out, due_date 
                    FROM tbl_mng_purchase
                    
                    UNION ALL
                    
                    SELECT entry_date AS date, customer_name, 'sales approval' AS type, 
                        NULL AS commission, net_amount AS cash_in, NULL AS cash_out, NULL AS due_date 
                    FROM tbl_sales_approvals
                    
                    UNION ALL
                    
                    SELECT entry_date AS date, supplier_name AS customer_name, 'purchase approval' AS type, 
                        NULL AS commission, NULL AS cash_in, net_amount AS cash_out, NULL AS due_date 
                    FROM tbl_purchase_approvals
                ) AS ledger`;

            if (searchQuery) {
                query += ` WHERE customer_name LIKE ?`;
            }

            query += " ORDER BY date ASC";

            const values = searchQuery ? [`%${searchQuery}%`] : [];

            const [rows] = await db.query(query, values);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async fetchCustomerNames() {
        try {
            const query = `
                SELECT DISTINCT customer_name FROM (
                    SELECT customer_name FROM tbl_mng_sales
                    UNION
                    SELECT supplier_name AS customer_name FROM tbl_mng_purchase
                    UNION
                    SELECT customer_name FROM tbl_sales_approvals
                    UNION
                    SELECT supplier_name AS customer_name FROM tbl_purchase_approvals
                ) AS customers ORDER BY customer_name;
            `;

            const [rows] = await db.query(query);
            return rows.map(row => row.customer_name);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Ledger;
