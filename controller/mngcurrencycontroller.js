console.log("mngcurrencycontroller.js is running");
const Mngcurrency = require('../model/mngcurrencymodel'); // Import the user model

class MngCurrencyController {
    static async getAll(req, res) {
        try {
            console.log("Fetching Currency...");
            const users = await Mngcurrency.getAll(); // Fetch all users from the model
            console.log("Users:", users); // Debugging log
            res.render('managecurrency', { users }); // Pass users data to the EJS view
        } catch (error) {
            console.error("Error fetching currency:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    static async addcurrency(req, res) {
        console.log("Adding currency...");
        console.log("Received Data:", req.body); // 🔍 Log the incoming data
    
        const { cur_name, symbol } = req.body; // Use the correct field names
    
        if (!cur_name || !symbol) { // Check the correct field names
            console.error("🚨 Missing fields! Received:", req.body); // Debug missing data
            req.flash("error", "All fields are required");
            return res.status(400).send("All fields are required"); // 🔹 Send plain text response
        }
    
        try {
            await Mngcurrency.createcurrency({ 
               cur_name,
               symbol 
            }); // 🚀 Call the model method
    
            req.flash("success", "Currency added successfully!");
            return res.status(200).send("Currency added successfully"); // 🔹 Send success response
        } catch (error) {
            console.error("Error adding currency:", error);
            req.flash("error", "Internal Server Error");
            return res.status(500).send("Internal Server Error"); // 🔹 Send plain text response
        }
    }  
    
    
    
    

    static async editcurrency(req, res) {
        try {
            const CurrencyId = req.body.nid; // Get header ID from hidden field
            const {cur_name, symbol } = req.body; // Extract fields from form
    
            console.log("Controller Received Data:", req.body); // Debugging log
    
            // Validate required fields
            if (!cur_name || !symbol) {
                console.log("Missing required fields.", req.body);
                return res.status(400).send("Missing required fields.");
            }
    
            // Update the header with mapped field names
            const result = await Mngcurrency.updatecurrency(
              CurrencyId,
              cur_name,
              symbol 
            );
    
            if (result) {
                res.redirect("/managecurrency"); // Redirect on success
            } else {
                res.status(400).send("Error updating currency");
            }
        } catch (error) {
            console.error("Error editing currency:", error);
            res.status(500).send("Internal Server Error");
        }
    }
    

    // Delete user
    static async deletecurrency(req, res) {
        try {
            const CurrencyId = req.params.id;
            const result = await Mngcurrency.dltcurrency(CurrencyId);

            if (result) {
                res.redirect("/managecurrency");
            } else {
                res.status(400).send("Error deleting currency");
            }
        } catch (error) {
            console.error("Error deleting currency :", error);
            res.status(500).send("Internal Server Error");
        }
    }

}

module.exports = MngCurrencyController;
