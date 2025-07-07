const Ledger = require("../model/ledgermodel");
const ExcelJS = require("exceljs"); // Install via: npm install exceljs

class LedgerController {
    static async getLedgerReport(req, res) {
        try {
            const searchQuery = req.query.search ? req.query.search.trim() : "";
            const ledgerData = await Ledger.fetchLedgerData(searchQuery);
            const customerNames = await Ledger.fetchCustomerNames();

            // If request is an AJAX request, return JSON
            if (req.xhr) {
                return res.json({ ledgerData });
            }

            // Otherwise, render the full page
            res.render("ledgerReport", { ledgerData, customerNames });
        } catch (error) {
            console.error("Error fetching ledger data:", error);
            res.status(500).send("Internal Server Error");
        }
    }

      static async exportLedgerToExcel(req, res) {
        try {
            const ledgerData = await Ledger.fetchLedgerData();

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Ledger Report");

            worksheet.columns = [
                { header: 'Date', key: 'date', width: 15 },
                { header: 'Customer Name', key: 'customer_name', width: 25 },
                { header: 'Type', key: 'type', width: 20 },
                { header: 'Commission', key: 'commission', width: 15 },
                { header: 'Cash In', key: 'cash_in', width: 15 },
                { header: 'Cash Out', key: 'cash_out', width: 15 },
                { header: 'Due Date', key: 'due_date', width: 15 }
            ];

            ledgerData.forEach(entry => {
                worksheet.addRow({
                    date: entry.date,
                    customer_name: entry.customer_name,
                    type: entry.type,
                    commission: entry.commission || "-",
                    cash_in: entry.cash_in || 0,
                    cash_out: entry.cash_out || 0,
                    due_date: entry.due_date || "-"
                });
            });

            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=Ledger_Report.xlsx"
            );

            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            console.error("Export Error:", error);
            res.status(500).send("Error exporting ledger");
        }
    }
}

module.exports = LedgerController;
