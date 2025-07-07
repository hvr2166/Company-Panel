const DashboardModel = require('../model/dashboardModel');

class DashboardController {
  static async renderDashboard(req, res) {
    try {
      const [
        totalPurchases,
        totalSales,
        totalStock,
        monthlyPurchase, 
        monthlySales,
        monthlyExpenses,
        cashFlow,
        profitLoss,
        banks
      ] = await Promise.all([
        DashboardModel.getTotalMngPurchases(),
        DashboardModel.getTotalMngSales(),
        DashboardModel.getTotalStockCount(),
        DashboardModel.getMonthlyPurchaseTotal(),
        DashboardModel.getMonthlySalesTotal(),
        DashboardModel.getMonthlyExpenses(),
        DashboardModel.getCashFlow(),
        DashboardModel.getProfitLoss(),
        DashboardModel.getBanks()
      ]);
  
      const defaultBank = banks[0]?.bank_name || '';
      const bankAmount = await DashboardModel.getBankAmount(defaultBank);
  
      res.render('dashboard', {
        data: {
          totalPurchases,
          totalSales,
          totalStock,
          monthlyPurchase,
          monthlySales,
          monthlyExpenses,
          bankAmount,
          cashFlow,
          profitLoss,
          banks,
          selectedBank: defaultBank
        }
      });
    } catch (error) {
      console.error("Dashboard error:", error);
      res.status(500).render('error', { message: "Dashboard failed to load. Please try again later." });
    }
  }

  static async getChartData(req, res) {
    try {
      const chartData = await DashboardModel.getMonthlyPurchaseSales();
      console.log("Chart Data >>>", chartData); // add this line
      res.json(chartData);
    } catch (err) {
      console.error('Chart error:', err);
      res.status(500).json({ error: 'Error loading chart data' });
    }
  }

  static async getStoneTypeChart(req, res) {
    try {
      const stoneData = await DashboardModel.getStoneTypeTrend();
      res.json(stoneData);
    } catch (err) {
      console.error('Stone chart error:', err);
      res.status(500).json({ error: 'Error loading stone chart data' });
    }
  }

  static async getDuesData(req, res) {
    try {
      const { startDate, endDate, minAmount, maxAmount } = req.query;
  
      const customerDues = await DashboardModel.getCustomerDues(startDate, endDate, minAmount, maxAmount);
      const supplierDues = await DashboardModel.getSupplierDues(startDate, endDate, minAmount, maxAmount);
  
      const customerTotals = customerDues.reduce((acc, row) => {
        acc.total_amount += parseFloat(row.invoice_amount || 0);
        acc.paid_amount += parseFloat(row.paid_amount || 0);
        acc.due_balance += parseFloat(row.due_balance || 0);
        
        return acc;
      },{ total_amount: 0, paid_amount: 0, due_balance: 0 });
  
      const supplierTotals = supplierDues.reduce((acc, row) => {
        acc.total_amount += parseFloat(row.invoice_amount || 0);
        acc.paid_amount += parseFloat(row.paid_amount || 0);
        acc.due_balance += parseFloat(row.due_balance || 0);
        
        return acc;
      }, { total_amount: 0, paid_amount: 0, due_balance: 0 });
      
      console.log("Customer Dues >>>", customerDues); // add this line
      console.log("Supplier Dues >>>", supplierDues); // add this line  
      console.log("Customer Totals >>>", customerTotals); // add this line
      console.log("Supplier Totals >>>", supplierTotals); // add this line
      res.json({
        customerDues,
        supplierDues,
        customerTotals,
        supplierTotals
      });
    } catch (error) {
      console.error('Error fetching dues:', error);
      res.status(500).json({ error: 'Failed to fetch dues data' });
    }
  }
  
}

module.exports = DashboardController;
