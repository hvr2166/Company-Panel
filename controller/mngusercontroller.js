console.log("mngusercontroller.js is running");
const User = require('../model/mngusermodel'); // Import the user model

class MngUserController {
    static async getAll(req, res) {
        try {
            console.log("Fetching users...");
            const users = await User.getAll(); // Fetch all users from the model
            console.log("Users:", users); // Debugging log
            res.render('manageusers', { users }); // Pass users data to the EJS view
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    static async addUser(req, res) {
        console.log("Adding user...");
        console.log("Received Data:", req.body); // 🔍 Log the incoming data
    
        const { user_name, user_password, user_email, firstname, lastname, phone } = req.body;
    
        if (!user_name || !user_password || !user_email || !firstname || !lastname || !phone) {
            console.error("🚨 Missing fields! Received:", req.body); // Debug missing data
            req.flash("error", "All fields are required");
            return res.status(400).send("All fields are required"); // 🔹 Send plain text response
        }
    
        try {
            await User.createUser({ user_name, user_password, user_email, firstname, lastname, phone });
    
            req.flash("success", "User added successfully!");
            return res.status(200).send("User added successfully"); // 🔹 Send success response
        } catch (error) {
            console.error("Error adding user:", error);
            req.flash("error", "Internal Server Error");
            return res.status(500).send("Internal Server Error"); // 🔹 Send plain text response
        }
    }
    
    
    

    static async editUser(req, res) {
        try {
            const userId = req.body.nid; // Get user ID from hidden field
            const { user_name, user_password, user_email, firstname, lastname, phone } = req.body; // Extract fields
    
            console.log("Received Data:", req.body); // Debugging log
    
            if (!user_name || !user_email || !firstname || !lastname || !phone) {
                return res.status(400).send("Missing required fields.");
            }
    
            const result = await User.updateUser(userId, user_name, user_password, user_email, firstname, lastname, phone);
            
            if (result) {
                res.redirect("/manage%20user");
            } else {
                res.status(400).send("Error updating user");
            }
        } catch (error) {
            console.error("Error editing user:", error);
            res.status(500).send("Internal Server Error");
        }
    }
    

    // Delete user
    static async deleteUser(req, res) {
        try {
            const userId = req.params.id;
            const result = await User.deleteUser(userId);

            if (result) {
                res.redirect("/manage%20user");
            } else {
                res.status(400).send("Error deleting user");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            res.status(500).send("Internal Server Error");
        }
    }

}

module.exports = MngUserController;
