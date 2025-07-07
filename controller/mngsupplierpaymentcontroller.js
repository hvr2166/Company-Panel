console.log( "controller running");
const supname = require("../model/mngsuppliermodel");
const suppayment = require("../model/mngsupplierpaymentmodel");

class SupPaymentController{

    static async getAll(req, res) {
        try {
            console.log("Fetching suppliers...");
            const users = await supname.getAll(); // Fetch all users from the model
            const payments = await suppayment.getAll();
            console.log("Users:", users); // Debugging log
            res.render('supplierpayment', { users ,payments }); // Pass users data to the EJS view
        } catch (error) {
            console.error("Error fetching supplier:", error);
            res.status(500).send("Internal Server Error");
        }
    }

}

module.exports = SupPaymentController;