console.log("mngpscontroller.js is running");
const Personalexp = require('../model/mngpersonalexpensemodel'); // Import the user model

class MngpersonalexpController {
    static async getAll(req, res) {
        try {
            console.log("Fetching expense...");
            const users = await Personalexp.getAll(); // Fetch all users from the model
            console.log("Users:", users); // Debugging log
            res.render('mngpersonalexpense', { users }); // Pass users data to the EJS view
        } catch (error) {
            console.error("Error fetching expense:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    static async addpersonalexpense(req, res) {
        console.log("Adding expense...");
        console.log("Received Data:", req.body); // 🔍 Log the incoming data
    
        const { date, description, amount, remarks } = req.body;
    
        if (!date || !description || !amount || !remarks) {
            console.error("🚨 Missing fields! Received:", req.body); // Debug missing data
            req.flash("error", "All fields are required");
            return res.status(400).send("All fields are required"); // 🔹 Send plain text response
        }
    
        try {
            await Personalexp.createExpense({ date, description, amount, remarks  });
    
            req.flash("success", "expense added successfully!");
            return res.status(200).send("expense added successfully"); // 🔹 Send success response
        } catch (error) {
            console.error("Error adding expense:", error);
            req.flash("error", "Internal Server Error");
            return res.status(500).send("Internal Server Error"); // 🔹 Send plain text response
        }
    }
    
    
    

    static async editpersonalexpense(req, res) {
        try {
            const ExpenseId = req.body.nid; // Get user ID from hidden field
            const {  date, description, amount, remarks } = req.body; // Extract fields
    
            console.log("Received Data:", req.body); // Debugging log
    
            if (!date || !description || !amount || !remarks) {
                return res.status(400).send("Missing required fields.");
            }
    
            const result = await Personalexp.updateExpense(ExpenseId, date, description, amount, remarks);
            
            if (result) {
                res.redirect("/mngpersonalexpense");
            } else {
                res.status(400).send("Error updating expense");
            }
        } catch (error) {
            console.error("Error editing expense:", error);
            res.status(500).send("Internal Server Error");
        }
    }
    

    // Delete expense
    static async deletepersonalexpense(req, res) {
        try {
            const ExpenseId = req.params.id;
            const result = await Personalexp.deleteExpense(ExpenseId);

            if (result) {
                res.redirect("/mngpersonalexpense");
            } else {
                res.status(400).send("Error deleting expense");
            }
        } catch (error) {
            console.error("Error deleting expense:", error);
            res.status(500).send("Internal Server Error");
        }
    }

}

module.exports = MngpersonalexpController;
