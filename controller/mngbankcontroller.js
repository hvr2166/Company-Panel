console.log("mngbankcontroller.js is running");
const Mngbank = require('../model/mngbankmodel'); // Import the user model

class MngBankController {
    static async getAll(req, res) {
        try {
            console.log("Fetching Bank...");
            const users = await Mngbank.getAll(); // Fetch all users from the model
            console.log("Users:", users); // Debugging log
            res.render('managebank', { users }); // Pass users data to the EJS view
        } catch (error) {
            console.error("Error fetching bank:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    static async addbank(req, res) {
        console.log("Adding bank...");
        console.log("Received Data:", req.body); // 🔍 Log the incoming data
    
        const { bank_name, bank_branch,acc_num } = req.body; // Use the correct field names
    
        if (!bank_name || !bank_branch) { // Check the correct field names
            console.error("🚨 Missing fields! Received:", req.body); // Debug missing data
            req.flash("error", "All fields are required");
            return res.status(400).send("All fields are required"); // 🔹 Send plain text response
        }
    
        try {
            await Mngbank.createbank({ 
                bank_name,
                bank_branch ,
                acc_num
            }); // 🚀 Call the model method
    
            req.flash("success", "bank added successfully!");
            return res.status(200).send("bank added successfully"); // 🔹 Send success response
        } catch (error) {
            console.error("Error adding bank:", error);
            req.flash("error", "Internal Server Error");
            return res.status(500).send("Internal Server Error"); // 🔹 Send plain text response
        }
    }  
    
    
    
    

    static async editbank(req, res) {
        try {
            const BankId = req.body.nid; // Get header ID from hidden field
            const { bank_name, bank_branch ,acc_num} = req.body; // Extract fields from form
    
            console.log("Controller Received Data:", req.body); // Debugging log
    
            // Validate required fields
            if (!bank_name || !bank_branch) {
                console.log("Missing required fields.", req.body);
                return res.status(400).send("Missing required fields.");
            }
    
            // Update the header with mapped field names
            const result = await Mngbank.updatebank(
                BankId,
                bank_name,
                bank_branch ,
                acc_num
            );
    
           if (result) {
    res.status(200).json({ success: true, redirect: "/managebank" });
} else {
    res.status(400).json({ success: false, message: "Error updating bank" });
}
        } catch (error) {
            console.error("Error editing bank:", error);
            res.status(500).send("Internal Server Error");
        }
    }
    

    // Delete user
    static async deletebank(req, res) {
        try {
            const BankId = req.params.id;
            const result = await Mngbank.dltbank(BankId);

            
           if (result) {
    res.status(200).json({ success: true, redirect: "/managebank" });
} else {
    res.status(400).json({ success: false, message: "Error deleting bank" });
}
        } catch (error) {
            console.error("Error deleting bank:", error);
            res.status(500).send("Internal Server Error");
        }
    }

}

module.exports = MngBankController;
