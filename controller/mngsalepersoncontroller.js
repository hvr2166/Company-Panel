console.log("mngsalepersoncontroller.js is running");
const SalePerson = require('../model/mngsalepersonmodel'); // Import the sale person model

class MngSalePersonController {
    static async getAll(req, res) {
        try {
            console.log("Fetching sale persons...");
            const users = await SalePerson.getAll(); // Fetch all sale persons from the model
            console.log("Sale Persons:", users); // Debugging log
            res.render('mngsaleperson', { users }); // Pass sale persons data to the EJS view
        } catch (error) {
            console.error("Error fetching sale persons:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    static async addsaleperson(req, res) {
        console.log("Adding Sale Person...");
        console.log("Received Data:", req.body); // Log the incoming data
    
        const { sale_per_name, sale_per_mob ,status } = req.body; // Use the correct field names
     
        if (!sale_per_name || !sale_per_mob || !status) { // Check the correct field names
            console.error("Missing fields! Received:", req.body); // Debug missing data
            req.flash("error", "All fields are required");
            return res.status(400).send("All fields are required"); // Send plain text response
        }
    
        try {
            await SalePerson.createSalePerson({ 
                sale_per_name, 
                sale_per_mob,
               active_status: status
            }); // Call the model method
    
            req.flash("success", "Sale Person added successfully!");
            return res.status(200).send("Sale Person added successfully"); // Send success response
        } catch (error) {
            console.error("Error adding sale person:", error);
            req.flash("error", "Internal Server Error");
            return res.status(500).send("Internal Server Error"); // Send plain text response
        }
    }  
    
    static async editsaleperson(req, res) {
        try {
            const salePersonId = req.body.nid; // Get sale person ID from hidden field
            const {  sale_per_name, sale_per_mob , active_status } = req.body; // Extract fields from form
            console.log("id",salePersonId)
            console.log("Controller Received Data:", req.body); // Debugging log
    
            // Validate required fields
            if (!sale_per_name || !sale_per_mob || !active_status) {
                console.log("Missing required fields.", req.body);
                return res.status(400).send("Missing required fields.");
            }
    
            // Update the sale person with mapped field names
            const result = await SalePerson.updateSalePerson(
                salePersonId,
                sale_per_name, 
                sale_per_mob ,
                active_status
            );
    
            if (result) {
                res.redirect("/mngsaleperson"); // Redirect on success
            } else {
                res.status(400).send("Error updating sale person");
            }
        } catch (error) {
            console.error("Error editing sale person:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    static async deletesaleperson(req, res) {
        try {
            const salePersonId = req.params.id;
            const result = await SalePerson.deleteSalePerson(salePersonId);

            if (result) {
                res.redirect("/mngsaleperson");
            } else {
                res.status(400).send("Error deleting sale person");
            }
        } catch (error) {
            console.error("Error deleting sale person:", error);
            res.status(500).send("Internal Server Error");
        }
    }
}

module.exports = MngSalePersonController;