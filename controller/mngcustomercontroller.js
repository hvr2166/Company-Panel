console.log("mngusercontroller.js is running");
const Customer = require('../model/mngcustomermodel'); 

class MngCustomerController {
    static async getAll(req, res) {
        try {
            console.log("Fetching Customers...");
            const users = await Customer.getAll(); // Fetch all users from the model
            console.log("Users:", users); // Debugging log
            res.render('mngcustomer', { users }); // Pass users data to the EJS view
        } catch (error) {
            console.error("Error fetching customer:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    static async addCustomer(req, res) {
        console.log("Adding Customer...");
        console.log("Received Data:", req.body); // 🔍 Log the incoming data
    
        const { cust_name, cust_mobile , cust_email, cust_firm_name, cust_address ,status } = req.body;
    
        if (!cust_name || !cust_mobile || !cust_email || !cust_firm_name || !cust_address || !status) {
            console.error("🚨 Missing fields! Received:", req.body); // Debug missing data
            req.flash("error", "All fields are required");
            return res.status(400).send("All fields are required"); // 🔹 Send plain text response
        }
    
        try {
            await Customer.createcustomer({cust_name, cust_mobile , cust_email, cust_firm_name, cust_address ,status });
    
            req.flash("success", "Customer added successfully!");
            return res.status(200).send("Customer added successfully"); // 🔹 Send success response
        } catch (error) {
            console.error("Error adding Customer:", error);
            req.flash("error", "Internal Server Error");
            return res.status(500).send("Internal Server Error"); // 🔹 Send plain text response
        }
    }
    
    
    

    static async editCustomer(req, res) {
        try {
            const CustomerId = req.body.nid; // Get user ID from hidden field
            const {  cust_name, cust_mobile , cust_email, cust_firm_name, cust_address ,active_status } = req.body; // Extract fields
    
            console.log("Received Data:", req.body); // Debugging log
    
            if (!cust_name || !cust_mobile || !cust_email || !cust_firm_name || !cust_address || !active_status) {
                return res.status(400).send("Missing required fields.");
            }
    
            const result = await Customer.updatecustomer(CustomerId, cust_name, cust_mobile , cust_email, cust_firm_name, cust_address ,active_status);
            console.log(result);
            if (result) {
                res.redirect("/mngcustomer");
            } else {
                res.status(400).send("Error updating Customer");
            }
        } catch (error) {
            console.error("Error editing Customer:", error);
            res.status(500).send("Internal Server Error");
        }
    }
    

    // Delete user
    static async delete(req, res) {
        try {
            const CustomerId = req.params.id;
            const result = await Customer.deletecustomer(CustomerId);

            if (result) {
                res.redirect("/mngcustomer");
            } else {
                res.status(400).send("Error deleting Customer");
            }
        } catch (error) {
            console.error("Error deleting Customer:", error);
            res.status(500).send("Internal Server Error");
        }
    }

}

module.exports = MngCustomerController;
