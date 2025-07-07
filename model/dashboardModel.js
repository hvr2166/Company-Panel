const pool = require('../db');

class DashboardModel {
 // 1. Total rows in tbl_mng_purchase
static async getTotalMngPurchases() {
  const [rows] = await pool.query('SELECT COUNT(*) AS count FROM tbl_mng_purchase');
  return rows[0].count;
}
 
// 2. Total rows in tbl_mng_sales
static async getTotalMngSales() {
  const [rows] = await pool.query('SELECT COUNT(*) AS count FROM tbl_mng_sales');
  return rows[0].count;
}

// 3. Total rows in tbl_managestockno
static async getTotalStockCount() {
  const [rows] = await pool.query('SELECT COUNT(*) AS count FROM tbl_managestockno');
  return rows[0].count;
}

// 4. Sum net_total_amt from tbl_mng_purchase
static async getMonthlyPurchaseTotal() {
  const [rows] = await pool.query('SELECT SUM(CAST(net_total_amt AS DECIMAL(10,2))) AS total FROM tbl_mng_purchase');
  return rows[0].total || 0;
}

// 5. Sum net_total_amt from tbl_mng_sales
static async getMonthlySalesTotal() {
  const [rows] = await pool.query('SELECT SUM(CAST(net_total_amt AS DECIMAL(10,2))) AS total FROM tbl_mng_sales');
  return rows[0].total || 0;
}

// 6. Sum amount from tbl_personal_exp
static async getMonthlyExpenses() {
  const [rows] = await pool.query('SELECT SUM(CAST(amount AS DECIMAL(10,2))) AS total FROM tbl_personal_exp');
  return rows[0].total || 0;
}

// 7. Get all bank names
static async getBanks() {
  const [rows] = await pool.query('SELECT bank_name FROM tbl_bank');
  return rows;
}

// 7. Get total amount for a specific bank
static async getBankAmount(bankName) {
  const [received] = await pool.query(`
    SELECT SUM(CAST(amount AS DECIMAL(10,2))) AS total FROM tbl_voucher 
    WHERE payment_mode IN ('cheque', 'onlinetransfer') AND payment_type = 'received' AND bank_name = ?`, [bankName]);

  const [paid] = await pool.query(`
    SELECT SUM(CAST(amount AS DECIMAL(10,2))) AS total FROM tbl_voucher 
    WHERE payment_mode IN ('cheque', 'onlinetransfer') AND payment_type = 'paid' AND bank_name = ?`, [bankName]);

  return (received[0].total || 0) - (paid[0].total || 0);
}

// 8. Get total cash flow (cash received - cash paid)
static async getCashFlow() {
  const [received] = await pool.query(`
    SELECT SUM(CAST(amount AS DECIMAL(10,2))) AS total FROM tbl_voucher 
    WHERE payment_mode = 'cash' AND payment_type = 'received'`);

  const [paid] = await pool.query(`
    SELECT SUM(CAST(amount AS DECIMAL(10,2))) AS total FROM tbl_voucher 
    WHERE payment_mode = 'cash' AND payment_type = 'paid'`);

  return (received[0].total || 0) - (paid[0].total || 0);
}

// 9. Get profit or loss = sales - purchases
static async getProfitLoss() {
  const [sales] = await pool.query('SELECT SUM(CAST(net_total_amt AS DECIMAL(10,2))) AS total FROM tbl_mng_sales');
  const [purchases] = await pool.query('SELECT SUM(CAST(net_total_amt AS DECIMAL(10,2))) AS total FROM tbl_mng_purchase');

  return (sales[0].total || 0) - (purchases[0].total || 0);
}

  // Add chart data function if needed
  static async getMonthlyPurchaseSales() {
    try {
      const [purchases] = await pool.query(`
        SELECT 
          MONTH(STR_TO_DATE(purchase_date, '%Y-%m-%d')) AS month,
          SUM(CAST(net_total_amt AS DECIMAL(10,2))) AS total_purchase
        FROM tbl_mng_purchase
        GROUP BY MONTH(STR_TO_DATE(purchase_date, '%Y-%m-%d'))
      `);

      const [sales] = await pool.query(`
        SELECT 
          MONTH(STR_TO_DATE(sales_date, '%Y-%m-%d')) AS month,
          SUM(CAST(net_total_amt AS DECIMAL(10,2))) AS total_sales
        FROM tbl_mng_sales
        GROUP BY MONTH(STR_TO_DATE(sales_date, '%Y-%m-%d'))
      `);

      return { purchases, sales };
    } catch (error) {
      console.error('Error fetching monthly data:', error);
      throw error;
    }
  }

  static async getStoneTypeTrend() {
    try {
      const [rows] = await pool.query(`
        SELECT 
          MONTH(STR_TO_DATE(p.purchase_date, '%Y-%m-%d')) AS month,
          s.stone_type,
          SUM(CAST(p.pcs AS UNSIGNED)) AS total_pcs
        FROM tbl_mng_purchase p
        JOIN tbl_managestockno s ON s.lot = p.lot_no
        GROUP BY MONTH(STR_TO_DATE(p.purchase_date, '%Y-%m-%d')), s.stone_type
        ORDER BY month
      `);
      return rows;
    } catch (error) {
      console.error('Error fetching stone type trend:', error);
      throw error;
    }
  }

  static async getCustomerDues(startDate, endDate, minAmount, maxAmount) {
    let query = `
      SELECT customer_name, invoice_amount, paid_amount, (invoice_amount - paid_amount) AS due_balance, payment_date 
      FROM tbl_customer_payment 
      WHERE 1=1
    `;
    const params = [];
  
    if (startDate && endDate) {
      query += ` AND payment_date BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    }
  
    if (minAmount && maxAmount) {
      query += ` AND CAST(invoice_amount AS DECIMAL(10,2)) BETWEEN ? AND ?`;
      params.push(minAmount, maxAmount);
    }
  
    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async getSupplierDues(startDate, endDate, minAmount, maxAmount) {
    let query = `
      SELECT supplier_name, invoice_amount, paid_amount, (invoice_amount - paid_amount) AS due_balance, payment_date 
      FROM tbl_supplier_payment 
      WHERE 1=1
    `;
    const params = [];
  
    if (startDate && endDate) {
      query += ` AND payment_date BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    }
  
    if (minAmount && maxAmount) {
      query += ` AND CAST(invoice_amount AS DECIMAL(10,2)) BETWEEN ? AND ?`;
      params.push(minAmount, maxAmount);
    }
    
  
    const [rows] = await pool.execute(query, params);
    return rows;
  }
  
}

module.exports = DashboardModel;
