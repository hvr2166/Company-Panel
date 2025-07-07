console.log("mngusercontroller.js is running");
const AttributeValue = require('../model/mngattributevaluemodel');
const Attribute = require("../model/mngattributemodel") // Import the user model

class MngAttributeValueController {
    static async getAll(req, res) {
        try {
            console.log("Fetching users...");
            const users = await AttributeValue.getAll(); // Fetch all users from the model
            const attributes = await Attribute.getAll(); // Fetch all users from the model
            console.log("Attributes:", attributes); // Debugging log
            console.log("Users:", users); // Debugging log
            res.render('mngattributevalue', { users , attributes }); // Pass users data to the EJS view
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    static async addAttributevalue(req, res) {
        console.log("Adding Attribue value...");
        console.log("Received Data:", req.body); // 🔍 Log the incoming data
    
        const { attribute_name , attribute_value } = req.body; // Use the correct field names
    
        if (!attribute_name || !attribute_value ) { // Check the correct field names
            console.error("🚨 Missing fields! Received:", req.body); // Debug missing data
            req.flash("error", "All fields are required");
            return res.status(400).send("All fields are required"); // 🔹 Send plain text response
        }
    
        try {
            await AttributeValue.createAttributevalue({ 
               attribute_name,
               attribute_value
            }); // 🚀 Call the model method
    
            req.flash("success", "Attribute value added successfully!");
            return res.status(200).send("Attribute value added successfully"); // 🔹 Send success response
        } catch (error) {
            console.error("Error adding user:", error);
            req.flash("error", "Internal Server Error");
            return res.status(500).send("Internal Server Error"); // 🔹 Send plain text response
        }
    }  
    
    

    static async editAttributevalue(req, res) {
        try {
            const AttributeId = req.body.nid; // Get header ID from hidden field
            const { attribute_name ,  attribute_value } = req.body; // Extract fields from form
    
            console.log("Controller Received Data:", req.body); // Debugging log
    
            // Validate required fields
            if (!attribute_name || !attribute_value) {
                console.log("Missing required fields.", req.body);
                return res.status(400).send("Missing required fields.");
            }
    
            // Update the header with mapped field names
            const result = await AttributeValue.updateAttributevalue(
                AttributeId,
                attribute_name,
                attribute_value
            );
    
            if (result) {
                res.redirect("/mngattributevalue"); // Redirect on success
            } else {
                res.status(400).send("Error updating header");
            }
        } catch (error) {
            console.error("Error editing header:", error);
            res.status(500).send("Internal Server Error");
        }
    }
    

    // Delete user
    static async deleteAttributevalue(req, res) {
        try {
            const AttributeId = req.params.id;
            const result = await AttributeValue.deleteAttributevalue(AttributeId);

            if (result) {
                res.redirect("/mngattributevalue");
            } else {
                res.status(400).send("Error deleting user");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            res.status(500).send("Internal Server Error");
        }
    }

}

module.exports = MngAttributeValueController;
