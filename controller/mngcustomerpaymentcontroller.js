console.log( "controller running");
const custpayment = require("../model/mngcustomermodel");

class CustPaymentController{

    static async getAll(req, res) {
        try {
            console.log("Fetching customers...");
            const users = await custpayment.getAll(); // Fetch all users from the model
            console.log("Users:", users); // Debugging log
            res.render('customerpayment', { users }); // Pass users data to the EJS view
        } catch (error) {
            console.error("Error fetching supplier:", error);
            res.status(500).send("Internal Server Error");
        }
    }

}

module.exports = CustPaymentController;