console.log("stockprintingmodel.js is running");
const Stockno = require('./mngstocknomodel');

class StockPrintingModel {
    static async getByBarcode(barcode) {
        try {
            const stockData = await Stockno.getByBarcode(barcode);
            return stockData || null; // Ensures null is returned if no data is found
        } catch (error) {
            console.error("Error fetching stock by barcode:", error);
            throw error;
        }
    }
}

module.exports = StockPrintingModel;

