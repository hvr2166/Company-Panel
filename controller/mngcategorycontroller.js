console.log("mngCategorycontroller.js is running");
const Category = require('../model/mngcategoryemodel'); // Import the user model

class MngCategoryController {
    static async getAll(req, res) {
        try {
            console.log("Fetching categories...");
            const users = await Category.getAll(); // Fetch all users from the model
            console.log("Users:", users); // Debugging log
            res.render('managecategories', { users }); // Pass users data to the EJS view
        } catch (error) {
            console.error("Error fetching categories:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    static async addCategory(req, res) {
        console.log("Adding Category...");
        console.log("Received Data:", req.body); // 🔍 Log the incoming data
    
        const { ctr_name ,ctr_code , status } = req.body; // Use the correct field names
    
        if (!ctr_name || !ctr_code || !status ) { // Check the correct field names
            console.error("🚨 Missing fields! Received:", req.body); // Debug missing data
            req.flash("error", "All fields are required");
            return res.status(400).send("All fields are required"); // 🔹 Send plain text response
        }
    
        try {
            await Category.createCategory({ 
               ctr_name,
                ctr_code,
               active_status : status
            }); // 🚀 Call the model method
    
            req.flash("success", "Category added successfully!");
            return res.status(200).send("Category added successfully"); // 🔹 Send success response
        } catch (error) {
            console.error("Error adding Category:", error);
            req.flash("error", "Internal Server Error");
            return res.status(500).send("Internal Server Error"); // 🔹 Send plain text response
        }
    }  
    
    
    
    

    static async editCategory(req, res) {
        try {
            const CategoryId = req.body.nid; // Get header ID from hidden field
            const { ctr_name ,ctr_code , active_status } = req.body; // Extract fields from form
    
            console.log("Controller Received Data:", req.body); // Debugging log
    
            // Validate required fields
            if (!ctr_name || !ctr_code || !active_status) {
                console.log("Missing required fields.", req.body);
                return res.status(400).send("Missing required fields.");
            }
    
            // Update the header with mapped field names
            const result = await Category.updateCategory(
                CategoryId,
                ctr_name,
                ctr_code,
               active_status
            );
    
            if (result) {
                return res.json({ message: "category updated successfully!" });
            } else {
                res.status(400).send("Error updating Category");
            }
        } catch (error) {
            console.error("Error editing Category:", error);
            res.status(500).send("Internal Server Error");
        }
    }
    

    // Delete user
    static async deleteCategory(req, res) {
        try {
            const CategoryId = req.params.id;
            const result = await Category.dltcategory(CategoryId);

            if (result) {
                return res.json({ message: "Category Deleted successfully!" });
            } else {
                res.status(400).send("Error deleting Category");
            }
        } catch (error) {
            console.error("Error deleting Category:", error);
            res.status(500).send("Internal Server Error");
        }
    }

}

module.exports = MngCategoryController;
