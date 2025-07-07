const CashflowModel = require('../model/cashflowModel');
const ExcelJS = require('exceljs');

class CashflowController {
    static async getCashFlow(req, res) {
        try {
            const selectedMonth = req.query.month || new Date().toISOString().slice(0, 7); // Default to current month
            console.log("Fetching cash flow data for month:", selectedMonth);
            
            const cashFlowData = await CashflowModel.getCashFlow(selectedMonth);
            console.log("Cash flow data fetched:", cashFlowData);
            
            res.render("cashflowreport", { cashFlowData , selectedMonth });
        } catch (error) {
            console.error("Error in getCashFlow:", error);
            res.status(500).json({ error: 'Server error' });
        }
    }
    
    static async getTransactions(req, res) {
        try {
            const selectedMonth = req.query.month;
            if (!selectedMonth) {
                console.warn("Month parameter is missing");
                return res.status(400).json({ error: 'Month is required' });
            }
    
            console.log("Fetching transactions for month:", selectedMonth);
            const transactions = await CashflowModel.getTransactions(selectedMonth);
            console.log("Transactions fetched:", transactions);
            
            res.json(transactions);
        } catch (error) {
            console.error("Error in getTransactions:", error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    
static async exportToExcel(req, res) {
    try {
        const selectedMonth = req.query.month || new Date().toISOString().slice(0, 7);
        const cashFlowData = await CashflowModel.getCashFlow(selectedMonth);

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Cash Flow Report');

        worksheet.columns = [
            { header: 'Payment Date', key: 'paymentDate', width: 20 },
            { header: 'Cash In', key: 'cashIn', width: 15 },
            { header: 'Cash Out', key: 'cashOut', width: 15 }
        ];

        cashFlowData.forEach(row => {
            worksheet.addRow({
                paymentDate: row.paymentDate,
                cashIn: row.cashIn || 0,
                cashOut: row.cashOut || 0
            });
        });

        worksheet.addRow({});
        worksheet.addRow({ paymentDate: 'Total Cash In', cashIn: cashFlowData.reduce((acc, row) => acc + (row.cashIn || 0), 0) });
        worksheet.addRow({ paymentDate: 'Total Cash Out', cashOut: cashFlowData.reduce((acc, row) => acc + (row.cashOut || 0), 0) });
        worksheet.addRow({ paymentDate: 'Net Cash Flow', cashIn: cashFlowData.reduce((acc, row) => acc + (row.cashIn || 0), 0) - cashFlowData.reduce((acc, row) => acc + (row.cashOut || 0), 0) });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=CashFlowReport.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error exporting cash flow report:', error);
        res.status(500).send('Failed to export cash flow report');
    }
}
    
}

module.exports = CashflowController;