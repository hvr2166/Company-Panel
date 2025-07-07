const balancesheetModel = require('../model/balancesheetModel');
const ExcelJS = require('exceljs');

class balancesheetController {
    static async getBalanceSheet(req, res) {
        try {
            const liabilities = await balancesheetModel.getLiabilities();
            const assets = await balancesheetModel.getAssets();
            console.log("Liabilities:", liabilities);
            console.log("Assets:", assets);
            const closingBalance = assets.total - liabilities.total;
            console.log("Closing Balance:", closingBalance);
            res.render('balancesheet', { liabilities, assets, closingBalance });
        } catch (error) {
            console.error("Error fetching balance sheet:", error);
            res.status(500).send('Error fetching balance sheet');
        }
    }

    
static async exportToExcel(req, res) {
    try {
        const liabilities = await balancesheetModel.getLiabilities();
        const assets = await balancesheetModel.getAssets();
        const closingBalance = parseFloat(assets.total) - parseFloat(liabilities.total);

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Balance Sheet');

        sheet.columns = [
            { header: 'Type', key: 'type', width: 30 },
            { header: 'Amount', key: 'amount', width: 20 },
        ];

        // Liabilities
        sheet.addRow({ type: '--- Liabilities ---' });
        sheet.addRow({ type: 'Total Purchase', amount: liabilities.purchase });
        sheet.addRow({ type: 'Total Expense', amount: liabilities.expense });
        sheet.addRow({ type: 'Purchase Approval', amount: liabilities.purchaseApproval });
        sheet.addRow({ type: 'Liabilities Total', amount: liabilities.total });

        // Empty row
        sheet.addRow({});

        // Assets
        sheet.addRow({ type: '--- Assets ---' });
        sheet.addRow({ type: 'Total Sales + Approvals', amount: assets.sales });
        sheet.addRow({ type: 'Assets Total', amount: assets.total });

        // Empty row
        sheet.addRow({});

        // Summary
        sheet.addRow({ type: '--- Summary ---' });
        sheet.addRow({ type: 'Total Income', amount: assets.total });
        sheet.addRow({ type: 'Total Expense', amount: liabilities.total });
        sheet.addRow({ type: 'Closing Balance', amount: closingBalance.toFixed(2) });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=BalanceSheet.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error("Error exporting balance sheet to Excel:", error);
        res.status(500).send("Failed to export balance sheet");
    }
}
}

module.exports = balancesheetController;
