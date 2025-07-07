const InvoiceModel = require('../model/saleinvoiceModel');
const numberToWords = require('number-to-words'); // Convert amount to words

class InvoiceController {
    static async generateInvoice(req, res) {
        try {
            const SalesId = req.params.id;
            console.log("Sales id:", SalesId);

            const customer = await InvoiceModel.getCustomerById(SalesId);
            if (!customer) return res.status(404).send('customer not found');
            console.log('customer:', customer);

            const salesData = await InvoiceModel.getPurchaseByCustomerId(SalesId);
            if (!salesData || salesData.length === 0) {
                return res.status(404).send('Sales not found');
            }
            console.log("Sales:", salesData);

            // Convert price and net_amount to numbers if they are stored as VARCHAR
            salesData.forEach(sales => {
                sales.price = parseFloat(sales.price) || 0;
                sales.net_amount = parseFloat(sales.net_amount) || 0;
            });

            const totalAmount = salesData.reduce((acc, sales) => acc + sales.net_total_amt, 0);
            const totalAmountInWords = numberToWords.toWords(totalAmount); // Convert total amount to words

            const invoiceNo = `INV-${new Date().getFullYear()}-${SalesId}-${Date.now()}`;

            res.render('salesprint', { customer, data: salesData, invoiceNo ,totalAmountInWords}); // Use purchaseData[0]
        } catch (error) {
            console.error('Error generating invoice:', error);
            res.status(500).send('Internal Server Error');
        }
    }
}



module.exports =  InvoiceController;
