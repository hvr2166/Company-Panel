console.log("mngCategorycontroller.js is running");
const HeadCategory = require('../model/mngheadcategoryemodel'); // Import the user model

class MngHeadCategoryController {
    static async getAll(req, res) {
        try {
            console.log("Fetching categories...");
            const users = await HeadCategory.getAll(); // Fetch all users from the model
            console.log("Users:", users); // Debugging log
            res.render('headcategories', { users }); // Pass users data to the EJS view
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
            await HeadCategory.createCategory({ 
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
        const CategoryId = req.body.nid;
        const { ctr_name, ctr_code, active_status } = req.body;

        if (!ctr_name || !ctr_code || !active_status) {
            return res.status(400).send("Missing required fields.");
        }

        const result = await HeadCategory.updateCategory(
            CategoryId,
            ctr_name,
            ctr_code,
            active_status
        );

        if (result) {
            return res.status(200).send("head Category updated successfully"); // ✅ Clean AJAX response
        } else {
            return res.status(400).send("Error updating Category");
        }
    } catch (error) {
        console.error("Error editing Category:", error);
        return res.status(500).send("Internal Server Error");
    }
}

    

    // Delete user
  static async deleteCategory(req, res) {
    try {
        const CategoryId = req.params.id;
        const result = await HeadCategory.dltcategory(CategoryId);

        if (result) {
            res.status(200).send("Deleted successfully"); // ✅ Return 200 OK with plain text
        } else {
            res.status(400).send("Error deleting Category");
        }
    } catch (error) {
        console.error("Error deleting Category:", error);
        res.status(500).send("Internal Server Error");
    }
}


}

module.exports = MngHeadCategoryController;
