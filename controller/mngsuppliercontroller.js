console.log("mngsuppliercontrooler.js is running");
const Suppliers = require('../model/mngsuppliermodel'); // Import the user model

class MngSupplierController {
    static async getAll(req, res) {
        try {
            console.log("Fetching supplier...");
            const users = await Suppliers.getAll(); // Fetch all users from the model
            console.log("Users:", users); // Debugging log
            res.render('managesuppliers', { users }); // Pass users data to the EJS view
        } catch (error) {
            console.error("Error fetching supplier:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    static async addsupplier(req, res) {
        console.log("Adding supplier...");
        console.log("Received Data:", req.body); // 🔍 Log the incoming data
    
        const { sup_name ,sup_comp_name , sup_email , sup_mobile , sup_address , sup_tax_id, status } = req.body; // Use the correct field names
    
        if (!sup_name || !sup_comp_name || !sup_email || !sup_mobile || !sup_address || !sup_tax_id || !status ) { // Check the correct field names
            console.error("🚨 Missing fields! Received:", req.body); // Debug missing data
            req.flash("error", "All fields are required");
            return res.status(400).send("All fields are required"); // 🔹 Send plain text response
        }
    
        try {
            await Suppliers.createSupplier({ 
                sup_name ,
                sup_comp_name , 
                sup_email , 
                sup_mobile , 
                sup_address , 
                sup_tax_id,
               active_status : status
            }); // 🚀 Call the model method
    
            req.flash("success", "supplier added successfully!");
            return res.status(200).send("supplier added successfully"); // 🔹 Send success response
        } catch (error) {
            console.error("Error adding supplier:", error);
            req.flash("error", "Internal Server Error");
            return res.status(500).send("Internal Server Error"); // 🔹 Send plain text response
        }
    }  
    
    
    
    

    static async editsupplier(req, res) {
        try {
            const SuppliersId = req.body.nid; // Get header ID from hidden field
            const { sup_name ,sup_comp_name , sup_email , sup_mobile , sup_address , sup_tax_id, active_status } = req.body; // Extract fields from form
    
            console.log("Controller Received Data:", req.body); // Debugging log
    
            // Validate required fields
            if (!sup_name || !sup_comp_name || !sup_email || !sup_mobile || !sup_address || !sup_tax_id || !active_status) {
                console.log("Missing required fields.", req.body);
                return res.status(400).send("Missing required fields.");
            }
    
            // Update the header with mapped field names
            const result = await Suppliers.updateSupplier(
                SuppliersId,
                sup_name ,
                sup_comp_name , 
                sup_email , 
                sup_mobile , 
                sup_address , 
                sup_tax_id,
                active_status
            );
    
            if (result) {
                res.redirect("/managesuppliers"); // Redirect on success
            } else {
                res.status(400).send("Error updating supplier");
            }
        } catch (error) {
            console.error("Error editing supplier:", error);
            res.status(500).send("Internal Server Error");
        }
    }
    

    // Delete user
    static async deletesupplier(req, res) {
        try {
            const SuppliersId = req.params.id;
            const result = await Suppliers.deleteSupplier(SuppliersId);

            if (result) {
                res.redirect("/managesuppliers");
            } else {
                res.status(400).send("Error deleting supplier");
            }
        } catch (error) {
            console.error("Error deleting supplier:", error);
            res.status(500).send("Internal Server Error");
        }
    }

}

module.exports =  MngSupplierController;
