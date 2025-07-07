console.log("stockprintingcontroller.js is running");

const stockno = require('../model/mngstocknomodel');
const stockReportController = require('./stockreportcontroller');

async function getStockByBarcode(req, res) {
    try {
        const { barcode } = req.params;
        console.log("Scanning Barcode:", barcode);
        
        // Retrieve stock details using the barcode
        const stockItem = await stockno.getByBarcode(barcode);

        if (!stockItem) {
            return res.status(404).json({ success: false, message: "Stock item not found" });
        }

        console.log("Scanned Data:", stockItem);

        // Return full details including ID, Barcode, Lot, Weight, Pcs, and Barcode Image (Base64)
        res.json({
            success: true,
            id: stockItem.id,
            barcode: stockItem.barcode,
            barcode_image: stockItem.barcode_image,
            lot: stockItem.lot,
            weight: stockItem.weight,
            pcs: stockItem.pcs || 0
        });

    } catch (error) {
        console.error("Error fetching stock details:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

// ✅ Exporting both stockReportController and getStockByBarcode
module.exports = {
    ...stockReportController,
    getStockByBarcode
};
