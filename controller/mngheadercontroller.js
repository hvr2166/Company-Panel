console.log("mngusercontroller.js is running");
const Header = require('../model/mngheadermodel'); // Import the user model

class MngHeaderController {
    static async getAll(req, res) {
        try {
            console.log("Fetching users...");
            const users = await Header.getAll(); // Fetch all users from the model
            console.log("Users:", users); // Debugging log
            res.render('adminheader', { users }); // Pass users data to the EJS view
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    static async addAdminHeader(req, res) {
        console.log("Adding adminheader...");
        console.log("Received Data:", req.body); // 🔍 Log the incoming data
    
        const { comp_name, sub_head, email, Address } = req.body; // Use the correct field names
    
        if (!comp_name || !sub_head || !email || !Address) { // Check the correct field names
            console.error("🚨 Missing fields! Received:", req.body); // Debug missing data
            req.flash("error", "All fields are required");
            return res.status(400).send("All fields are required"); // 🔹 Send plain text response
        }
    
        try {
            await Header.createHeader({ 
                comp_name, 
                sub_head, 
                adminhead_email: email, // Map form field to database field
                adminhead_address: Address // Map form field to database field
            }); // 🚀 Call the model method
    
            req.flash("success", "Admin head added successfully!");
            return res.status(200).send("Admin head added successfully"); // 🔹 Send success response
        } catch (error) {
            console.error("Error adding user:", error);
            req.flash("error", "Internal Server Error");
            return res.status(500).send("Internal Server Error"); // 🔹 Send plain text response
        }
    }  
    
    
    
    

    static async editAdminHeader(req, res) {
        try {
            const headerId = req.body.nid; // Get header ID from hidden field
            const { comp_name, sub_head, email, Address } = req.body; // Extract fields from form
    
            console.log("Controller Received Data:", req.body); // Debugging log
    
            // Validate required fields
            if (!comp_name || !sub_head || !email || !Address) {
                console.log("Missing required fields.", req.body);
                return res.status(400).send("Missing required fields.");
            }
    
            // Update the header with mapped field names
            const result = await Header.updateHeader(
                headerId, // Pass headerId as the first parameter
                comp_name,
                sub_head,
                email, // Map form field to database field
                Address // Map form field to database field
            );
    
            if (result) {
                return res.json({ message: "Header updated successfully!" });
            }
             else {
                res.status(400).send("Error updating header");
            }
        } catch (error) {
            console.error("Error editing header:", error);
            res.status(500).send("Internal Server Error");
        }
    }
    

    // Delete user
    static async deleteAdminHeader(req, res) {
        try {
            const headerId = req.params.id;
            const result = await Header.deleteHeader(headerId);

            if (result) {
                return res.json({ message: "Header deleted successfully!" });
            } else {
                res.status(400).send("Error deleting header");
            }
        } catch (error) {
            console.error("Error deleting header:", error);
            res.status(500).send("Internal Server Error");
        }
    }

}

module.exports = MngHeaderController;
