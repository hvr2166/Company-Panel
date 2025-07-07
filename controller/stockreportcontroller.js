const stockReportModel = require("../model/stockReportModel");
const ExcelJS = require('exceljs');

class stockReportController {
static async stockreport(req, res) {
    try {
        const lot = req.query.lot || null;
        const isAjax = req.query.ajax === 'true';

        if (lot) {
            const purchases = await stockReportModel.getLotPurchases(lot);
            const sales = await stockReportModel.getLotSales(lot);

            const totalPurchaseQty = purchases.reduce((sum, p) => sum + parseFloat(p.weight || 0), 0);
            const totalSaleQty = sales.reduce((sum, s) => sum + parseFloat(s.pcs || 0), 0);
            const stockLeft = totalPurchaseQty - totalSaleQty;

            // 👉 Return only partial HTML if ajax=true
            if (isAjax) {
                return res.render('partials/lotdetail', {
                    layout: false,
                    lot,
                    purchases,
                    sales,
                    totalPurchaseQty,
                    totalSaleQty,
                    stockLeft
                });
            }

            return res.render('stockreport', {
                reportData: [],
                lot,
                purchases,
                sales,
                totalPurchaseQty,
                totalSaleQty,
                stockLeft
            });
        }



       else {
  const reportData = await stockReportModel.fetchReportData();

  // 👇 Add this condition for AJAX summary fetch
  if (isAjax) {
    return res.render('partials/_summarytable', {
      layout: false,
      reportData
    });
  }

  // Default full render
  return res.render('stockreport', {
    reportData,
    lot: null,
    purchases: [],
    sales: [],
    totalPurchaseQty: 0,
    totalSaleQty: 0,
    stockLeft: 0
  });
}

    } catch (error) {
        console.error("Error in stockreport:", error);
        res.status(500).send("Internal Server Error");
    }
}




    static async fetchLotData(req, res) {
        const lotNo = req.query.lot;
        if (!lotNo) {
            return res.status(400).json({ error: "Lot number is required" });
        }

        try {
            const data = await stockReportModel.getLotData(lotNo);
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // 🚀 NEW: Excel Export Handler
static async exportToExcel(req, res) {
    try {
        const data = await stockReportModel.fetchReportData();
        console.log("✅ Exporting data:", data); // Debugging check

        if (!data || data.length === 0) {
            return res.status(404).send("No data available for export.");
        }

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Stock Report");

        // Define new columns based on the updated table structure
        sheet.columns = [
            { header: "Lot No", key: "lot", width: 15 },
            { header: "Description", key: "description", width: 25 },
            { header: "Size", key: "size", width: 10 },
            { header: "Shape", key: "shape", width: 10 },
            { header: "Mine", key: "mine", width: 15 },
            { header: "Cut", key: "cut", width: 10 },
            { header: "Weight In Hand", key: "weight_in_hand", width: 15 },
            { header: "Weight", key: "weight", width: 12 },
            { header: "Supplier", key: "supplier_name", width: 20 },
            { header: "Purchase Date", key: "purchase_date", width: 15 },
            { header: "Purchase Price", key: "purchase_price", width: 15 },
            { header: "Total Purchase Amount", key: "total_purchase", width: 18 },
            { header: "Total Sales Amount", key: "total_sales", width: 18 },
            { header: "Total Profit", key: "total_profit", width: 15 }
        ];

        // Add rows to the Excel sheet
        data.forEach(row => sheet.addRow({
            lot: row.lot,
            description: row.description,
            size: row.size,
            shape: row.shape,
            mine: row.mine,
            cut: row.cut || "-",
            weight_in_hand: row.weight_in_hand,
            weight: row.weight,
            supplier_name: row.supplier_name,
            purchase_date: row.purchase_date,
            purchase_price: row.purchase_price,
            total_purchase: row.total_purchase,
            total_sales: row.total_sales,
            total_profit: row.total_profit
        }));

        // Set headers for file download
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=Stock_Report.xlsx");

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error("❌ Error exporting stock report:", error);
        res.status(500).send("Failed to export Excel");
    }
}

    static async lotDetailReport(req, res) {
    const lot = req.query.lot;

    if (!lot) return res.status(400).send("Lot number is required.");

    try {
        const purchases = await stockReportModel.getLotPurchases(lot);
        const sales = await stockReportModel.getLotSales(lot);

        const totalPurchaseQty = purchases.reduce((sum, p) => sum + parseFloat(p.weight || 0), 0);
        const totalSaleQty = sales.reduce((sum, s) => sum + parseFloat(s.pcs || 0), 0);
        const stockLeft = totalPurchaseQty - totalSaleQty;

        res.render("lotdetailreport", {
            lot,
            purchases,
            sales,
            totalPurchaseQty,
            totalSaleQty,
            stockLeft
        });
    } catch (err) {
        console.error("Error loading lot detail report:", err);
        res.status(500).send("Internal server error.");
    }
}
}

module.exports = stockReportController;