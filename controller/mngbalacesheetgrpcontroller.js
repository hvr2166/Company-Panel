console.log("mngbalacesheetgrpcontroller.js is running");
const mngbalacesheetmodel = require("../model/mngbalacesheetgrpmodel.js");


class Mngbalacesheetgrp {
    static async getAll(req, res) {
        try {
            console.log("Fetching expense head...");
            const users = await mngbalacesheetmodel.getAll(); // Fetch all users from the model
            console.log("Users:", users); // Debugging log
            res.render('viewbalancesheetgrp', { users }); // Pass users data to the EJS view
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    static async addexpensehead(req, res) {
        console.log("Adding expensehead...");
        console.log("Received Data:", req.body); // 🔍 Log the incoming data
    
        const { grp_name , grp_type , grp_rev_cap } = req.body;
    
        if (!grp_name|| !grp_type || !grp_rev_cap ) {
            console.error("🚨 Missing fields! Received:", req.body); // Debug missing data
            req.flash("error", "All fields are required");
            return res.status(400).send("All fields are required"); // 🔹 Send plain text response
        }
    
        try {
            await mngbalacesheetmodel.createexpensehead({grp_name , grp_type , grp_rev_cap });
    
            req.flash("success", "expense head added successfully!");
            return res.status(200).send("expense head added successfully"); // 🔹 Send success response
        } catch (error) {
            console.error("Error adding user:", error);
            req.flash("error", "Internal Server Error");
            return res.status(500).send("Internal Server Error"); // 🔹 Send plain text response
        }
    }
    
    
    

    static async editexpensehead(req, res) {
        try {
            const userId = req.body.nid; // Get user ID from hidden field
            const { grp_name , grp_type , grp_rev_cap } = req.body; // Extract fields
    
            console.log("Received Data:", req.body); // Debugging log
    
            if (!grp_name|| !grp_type || !grp_rev_cap) {
                return res.status(400).send("Missing required fields.");
            }
    
            const result = await mngbalacesheetmodel.updateexpensehead(userId, grp_name , grp_type , grp_rev_cap);
            
            if (result) {
                res.json({ success: true });
            } else {
                res.status(400).send("Error updating user");
            }
        } catch (error) {
            console.error("Error editing expensehead:", error);
            res.status(500).send("Internal Server Error");
        }
    }
    

    // Delete user
    static async deleteexpensehead(req, res) {
        try {
            const userId = req.params.id;
            console.log("Deleting expensehead with ID:", userId);
            const result = await mngbalacesheetmodel.deletehead(userId);

            if (result) {
                res.json({ success: true });
            } else {
                res.status(400).send("Error deleting expensehead");
            }
        } catch (error) {
            console.error("Error deleting expensehead:", error);
            res.status(500).send("Internal Server Error");
        }
    }

}

module.exports = Mngbalacesheetgrp;
