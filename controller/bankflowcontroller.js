const ReportModel = require("../model/ReportModel");
const ExcelJS = require('exceljs');

class ReportController {
    static async getBankBook(req, res) {
       
    
        const cashOut = await ReportModel.getCashOut();
        const cashIn = await ReportModel.getCashIn();
        const banks = await ReportModel.getBanks();
        
    
console.log("cashin:",cashIn);
console.log("cashout:",cashOut);
try {
            res.render("bankflowreport", { cashOut, cashIn, banks });
        } catch (error) {
            console.error("Error fetching bank book data:", error);
            res.status(500).send("Server Error");
        }
    }

    
static async exportToExcel(req, res) {
    try {
        const cashOut = await ReportModel.getCashOut();
        const cashIn = await ReportModel.getCashIn();

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Bank Flow Report');

        // --- Cash Out Section ---
        sheet.addRow(['Cash Out']);
        sheet.addRow(['Sr No', 'Date', 'Bank', 'Mode', 'Cheque No', 'Name', 'Amount']);
        cashOut.forEach((row, index) => {
            sheet.addRow([
                index + 1,
                new Date(row.payment_date).toISOString().split('T')[0],
                row.bank_name,
                row.payment_mode,
                row.payment_ref_no || 'N/A',
                row.account_name,
                row.amount
            ]);
        });

        sheet.addRow([]); // spacer

        // --- Cash In Section ---
        sheet.addRow(['Cash In']);
        sheet.addRow(['Sr No', 'Date', 'Bank', 'Mode', 'Cheque No', 'Name', 'Amount']);
        cashIn.forEach((row, index) => {
            sheet.addRow([
                index + 1,
                new Date(row.payment_date).toISOString().split('T')[0],
                row.bank_name,
                row.payment_mode,
                row.payment_ref_no || 'N/A',
                row.account_name,
                row.amount
            ]);
        });

        // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=BankFlowReport.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error("Error exporting Bank Flow report:", error);
        res.status(500).send("Failed to export report");
    }
}
    
}

module.exports = ReportController;
