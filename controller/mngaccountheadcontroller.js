console.log("mngaccount headcontroller.js is running");
const Accounthead = require('../model/mngaccountheadmodel') // Import the user model;
const balancesheetgrp = require("../model/mngbalacesheetgrpmodel") // Import the user model

class MngAccountHeadController {
    static async getAll(req, res) {
        try {
            console.log("Fetching Account heads...");
            const users = await Accounthead.getAll(); // Fetch all users from the model
            const grp = await balancesheetgrp.getAll(); // Fetch all users from the model
            console.log("Group name:", grp); // Debugging log
            console.log("Users:", users); // Debugging log
            res.render('manageaccounthead', { users , grp }); // Pass users data to the EJS view
        } catch (error) {
            console.error("Error fetching heads:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    static async addAccounthead(req, res) {
        console.log("Adding accounthead...");
        console.log("Received Data:", req.body); // 🔍 Log the incoming data
    
        const { head_name , grp_name ,  status } = req.body; // Use the correct field names
    
        if (!head_name || !grp_name|| !status ) { // Check the correct field names
            console.error("🚨 Missing fields! Received:", req.body); // Debug missing data
            req.flash("error", "All fields are required");
            return res.status(400).send("All fields are required"); // 🔹 Send plain text response
        }
    
        try {
            await Accounthead.createAccounthead({ 
                head_name,
               grp_name,
               active_status : status
            }); // 🚀 Call the model method
    
            req.flash("success", "account head added successfully!");
            return res.status(200).send("account head added successfully"); // 🔹 Send success response
        } catch (error) {
            console.error("Error adding account head:", error);
            req.flash("error", "Internal Server Error");
            return res.status(500).send("Internal Server Error"); // 🔹 Send plain text response
        }
    }    
    
    

    static async editAccounthead(req, res) {
        try {
            const AccountheadId = req.body.nid; // Get header ID from hidden field
            const { head_name , group_name , active_status } = req.body; // Extract fields from form
    
            console.log("Controller Received Data:", req.body); // Debugging log
    
            // Validate required fields
            if (!head_name || !group_name  || !active_status) {
                console.log("Missing required fields.", req.body);
                return res.status(400).send("Missing required fields.");
            }
    
            // Update the header with mapped field names
            const result = await Accounthead.updateAccountHead(
                AccountheadId,
                head_name,
                group_name,
                active_status
            );
    
            if (result) {
                res.redirect("/manageaccounthead"); // Redirect on success
            } else {
                res.status(400).send("Error updating head");
            }
        } catch (error) {
            console.error("Error editing head:", error);
            res.status(500).send("Internal Server Error");
        }
    }
    
    

    // Delete user
    static async deleteAccounthead(req, res) {
        try {
            const AccountheadId = req.params.id;
            const result = await Accounthead.deleteAccounthead(AccountheadId);

            if (result) {
                res.redirect("/manageaccounthead"); // Redirect on success
            } else {
                res.status(400).send("Error deleting account head");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            res.status(500).send("Internal Server Error");
        }
    }
}

module.exports = MngAccountHeadController;
