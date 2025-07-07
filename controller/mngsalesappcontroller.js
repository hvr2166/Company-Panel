console.log("sales approvals running ");
const sapprovals= require("../model/mngsalesappmodel");
const custname = require("../model/mngcustomermodel");
const salesname =require("../model/mngsalepersonmodel");
const Lots =require("../model/mngstocknomodel");

class mngsalesappcontroller{

    static async getAll(req, res) {
        try {
            console.log("Fetching  sales approvals...");
            const users = await sapprovals.getAll(); // Fetch all users from the model
            const names = await custname.getAll();
            const snames = await salesname.getAll(); 
            const lots = await Lots.getAll();
            users.forEach(user => {
            user.entry_date = formatDate(user.entry_date); // Format the entry date
            });
            console.log("Users:", users); // Debugging log
            res.render('mngsalesapproval', { users ,names ,snames, lots}); // Pass users data to the EJS view
        } catch (error) {
            console.error("Error fetching sa:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    static async addSalesApproval(req, res) {
        console.log("Adding approval...");
        console.log("Received Data:", req.body);
    
        const { Customer, sales_person, item } = req.body;
    
        // Check for required fields
        if (!Customer || !sales_person || !item || !Array.isArray(item) || item.length === 0) {
            console.error("Missing required fields!");
            return res.status(400).send("Customer, sales person, and item details are required.");
        }
    
        try {
            for (const itemDetail of item) {
                const { lot_no, description, weight_unit , weight,pcs, price,net_amount } = itemDetail;
    
                // Check for required item fields
                if (!lot_no || !description ||!weight_unit || !weight ||!pcs || !price||! net_amount) {
                    console.error("Missing item fields! Received:", itemDetail);
                    req.flash("error", "Item fields are missing");
                    return res.status(400).send("Item fields are missing");
                }
    
                // Create sale entry for each item
                const saleResponse = await sapprovals.addSalesApproval(Customer, lot_no, description,weight_unit, weight,pcs, price, sales_person,net_amount);

              // Check if the sale was successful
              if (!saleResponse.success) {
                // If not successful, handle the error
                console.error("Sale creation failed:", saleResponse.message);
                req.flash("error", saleResponse.message); // Set flash message
                return res.status(400).send(saleResponse.message); // Send error message back to client
            }
        }
            req.flash("success", "Approval added successfully!");
            return res.status(200).send("Approval added successfully");
        } catch (error) {
            console.error("Error adding a sales approval:", error);
            res.status(500).send("Internal Server Error");
        }
    }
 
    static async getApprovalDetails(req, res) {
        console.log("Fetching approval details...");
        const { id } = req.params;
    
        try {
            const user = await sapprovals.getApprovalDetails(id);
            if (!user) {
                console.error("Approval not found!");
                return res.status(404).send("Approval not found");
            }
            console.log("User:", user);
            return res.status(200).send(user);
        } catch (error) {
            console.error("Error fetching approval details:", error);
            return res.status(500).send("Internal Server Error");
        }
    }

    static async editApproval(req, res) {
        console.log("Editing approval...");
        console.log("Received Data:", req.body);
    
        const { nid, Customers, Sales_person,status, item } = req.body;
    
        // Check for required fields
        if (!nid || !Customers || !Sales_person ||!status || !item || !Array.isArray(item) || item.length === 0) {
            console.error("Missing required fields!");
            return res.status(400).send("ID, Customer, sales person, and item details are required.");
        }
    
        try {
            for (const itemDetail of item) {
                const { approval_lot_no, approval_description,approval_weight_unit, approval_weight,approval_pcs , approval_price ,approval_net_amount} = itemDetail;
    
                // Check for required item fields
                if (!approval_lot_no || !approval_description ||!approval_weight_unit|| !approval_weight ||!approval_pcs|| !approval_price|| !approval_net_amount) {
                    console.error("Missing item fields! Received:", itemDetail);
                    req.flash("error", "Item fields are missing");
                    return res.status(400).send("Item fields are missing");
                }
    
                // Create purchase entry for each item
                await sapprovals.editApproval(nid, Customers , approval_lot_no, approval_description,approval_weight_unit, approval_weight,approval_pcs, approval_price,status, Sales_person,approval_net_amount);
            }
            req.flash("success", "Approval edited successfully!");
            return res.status(200).json({
                success: true,
                message: "Approval edited successfully",
                status: status // Send the updated status back
            });
        } catch (error) {
            console.error("Error editing a sales approval:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    static async updatesalesApproval(req, res) {
        console.log("Updating sales approval...");
        console.log("Received Data:", req.body);

        console.log("✏️ Edit sales Approval Triggered, ID:", req.body.nid);

    
        const { nid, Customer, sales_person } = req.body;
        const item = req.body.item?.[0]; // Since only one row is edited
    
        if (!nid || !Customer || !sales_person || !item) {
            return res.status(400).send("Missing required fields.");
        }
    
        const {
            lot_no,
            description,
            weight_unit,
            weight,
            pcs,
            price,
            net_amount
        } = item;
    
        if (!lot_no || !description || !weight || !pcs || !price || !net_amount) {
            return res.status(400).send("Incomplete item data.");
        }
    
        try {
            const result = await sapprovals.updatesalesApproval(
                nid,
                Customer,
                lot_no,
                description,
                weight_unit,
                weight,
                pcs,
                price,
                sales_person,
                net_amount
            );
    
            return res.status(200).send("Approval updated successfully.");
        } catch (error) {
            console.error("Error updating approval:", error);
            return res.status(500).send("Internal Server Error");
        }
    }
}

module.exports = mngsalesappcontroller;


function formatDate(date) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-GB', options); // 'en-GB' for dd/mm/yyyy format
}

