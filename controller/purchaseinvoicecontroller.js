const InvoiceModel = require('../model/purchaseinvoiceModel');
const numberToWords = require('number-to-words'); // Convert amount to words

class InvoiceController {
    static async generateInvoice(req, res) {
        try {
            const Purchaseid = req.params.id;
            console.log("Purchase id:", Purchaseid);

            const supplier = await InvoiceModel.getSupplierById(Purchaseid);
            if (!supplier) return res.status(404).send('Supplier not found');
            console.log('Supplier:', supplier);

            const purchaseData = await InvoiceModel.getPurchaseBySupplierId(Purchaseid);
            if (!purchaseData || purchaseData.length === 0) {
                return res.status(404).send('Purchase not found');
            }
            console.log("Purchase:", purchaseData);

            // Convert price and net_amount to numbers if they are stored as VARCHAR
            purchaseData.forEach(purchase => {
                purchase.price = parseFloat(purchase.price) || 0;
                purchase.net_amount = parseFloat(purchase.net_amount) || 0;
            });

            const totalAmount = purchaseData.reduce((acc, purchase) => acc + purchase.net_total_amt, 0);
            const totalAmountInWords = numberToWords.toWords(totalAmount); // Convert total amount to words

            const invoiceNo = `INV-${new Date().getFullYear()}-${Purchaseid}-${Date.now()}`;

            res.render('purchaseprint', { supplier, data: purchaseData, invoiceNo ,totalAmountInWords}); // Use purchaseData[0]
        } catch (error) {
            console.error('Error generating invoice:', error);
            res.status(500).send('Internal Server Error');
        }
    }
}



module.exports =  InvoiceController;
