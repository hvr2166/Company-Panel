const ProfitLossModel = require("../model/profitlossmodel");
const ExcelJS = require('exceljs');

class ProfitLossController {
    static async getProfitLossReport(req, res) {
        try {
            const sales = await ProfitLossModel.getSalesWithDates();
            const approvedSales = await ProfitLossModel.getApprovedSalesWithDates();
            const purchases = await ProfitLossModel.getPurchasesWithDates();
            const approvedPurchases = await ProfitLossModel.getApprovedPurchasesWithDates();

            // Combine all entries
            const allEntries = [...sales, ...approvedSales, ...purchases, ...approvedPurchases];

            // Extract unique years
            const uniqueYears = Array.from(new Set(allEntries.map(entry => {
                const date = entry.sale_date || entry.approval_date || entry.purchase_date;
                return date ? new Date(date).getFullYear() : null;
            }))).filter(year => year !== null);

            // Filter by year if provided
            const selectedYear = req.query.year;
            const filteredEntries = allEntries.filter(entry => {
                const date = entry.sale_date || entry.approval_date || entry.purchase_date;
                const entryYear = date ? new Date(date).getFullYear() : null;
                return selectedYear ? entryYear === parseInt(selectedYear) : true;
            });

            // Calculate totals
            const totalSales = sales.reduce((sum, entry) => sum + (entry.net_total_amt || 0), 0);
            const totalApprovedSales = approvedSales.reduce((sum, entry) => sum + (entry.net_amount || 0), 0);
            const totalPurchases = purchases.reduce((sum, entry) => sum + (entry.net_total_amt || 0), 0);
            const totalApprovedPurchases = approvedPurchases.reduce((sum, entry) => sum + (entry.net_amount || 0), 0);

            const totalIncome = totalSales + totalApprovedSales;
            const totalExpenses = totalPurchases + totalApprovedPurchases;

            // Log amounts for debugging
            console.log("Total Sales:", totalSales);
            console.log("Total Approved Sales:", totalApprovedSales);
            console.log("Total Purchases:", totalPurchases);
            console.log("Total Approved Purchases:", totalApprovedPurchases);

            // Create structured response for EJS
            res.render("profitlossreport", {
                report: {
                    expenses: [
                        { particular: "Purchases", amount: totalPurchases },
                        { particular: "Approved Purchases", amount: totalApprovedPurchases }
                    ],
                    income: [
                        { particular: "Sales", amount: totalSales },
                        { particular: "Approved Sales", amount: totalApprovedSales }
                    ],
                    totalExpenses,
                    totalIncome,
                    uniqueYears: uniqueYears.length > 0 ? uniqueYears : []
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Database error" });
        }
    }

       static async exportToExcel(req, res) {
        try {
            const selectedYear = req.query.year;
            const sales = await ProfitLossModel.getSalesWithDates();
            const approvedSales = await ProfitLossModel.getApprovedSalesWithDates();
            const purchases = await ProfitLossModel.getPurchasesWithDates();
            const approvedPurchases = await ProfitLossModel.getApprovedPurchasesWithDates();

            const totalSales = sales.reduce((sum, entry) => sum + (entry.net_total_amt || 0), 0);
            const totalApprovedSales = approvedSales.reduce((sum, entry) => sum + (entry.net_amount || 0), 0);
            const totalPurchases = purchases.reduce((sum, entry) => sum + (entry.net_total_amt || 0), 0);
            const totalApprovedPurchases = approvedPurchases.reduce((sum, entry) => sum + (entry.net_amount || 0), 0);

            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet('Profit & Loss Report');

            sheet.columns = [
                { header: 'Sr No', key: 'sr', width: 10 },
                { header: 'Particulars', key: 'particular', width: 30 },
                { header: 'Amount', key: 'amount', width: 15 }
            ];

            // Expenses
            sheet.addRow({ sr: '', particular: 'Expenses', amount: '' });
            sheet.addRow({ sr: 1, particular: 'Purchases', amount: totalPurchases.toFixed(2) });
            sheet.addRow({ sr: 2, particular: 'Approved Purchases', amount: totalApprovedPurchases.toFixed(2) });
            sheet.addRow({ sr: '', particular: 'Total Expenses', amount: (totalPurchases + totalApprovedPurchases).toFixed(2) });

            // Income
            sheet.addRow({});
            sheet.addRow({ sr: '', particular: 'Income', amount: '' });
            sheet.addRow({ sr: 1, particular: 'Sales', amount: totalSales.toFixed(2) });
            sheet.addRow({ sr: 2, particular: 'Approved Sales', amount: totalApprovedSales.toFixed(2) });
            sheet.addRow({ sr: '', particular: 'Total Income', amount: (totalSales + totalApprovedSales).toFixed(2) });

            // Net Profit/Loss
            const net = (totalSales + totalApprovedSales) - (totalPurchases + totalApprovedPurchases);
            sheet.addRow({});
            sheet.addRow({ sr: '', particular: 'Net Profit/Loss', amount: net.toFixed(2) });

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=ProfitLossReport_${selectedYear || 'All'}.xlsx`);

            await workbook.xlsx.write(res);
            res.end();

        } catch (err) {
            console.error(err);
            res.status(500).send('Error generating Excel file.');
        }
    }
}

module.exports = ProfitLossController;
