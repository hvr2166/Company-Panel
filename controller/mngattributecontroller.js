console.log("mngusercontroller.js is running");
const Attribute = require('../model/mngattributemodel'); // Import the user model

class MngAttributeController {
    static async getAll(req, res) {
        try {
            console.log("Fetching users...");
            const users = await Attribute.getAll(); // Fetch all users from the model
            console.log("Users:", users); // Debugging log
            res.render('mngattribute', { users }); // Pass users data to the EJS view
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).send("Internal Server Error");
        }
    }

static async addAttribute(req, res) {
    console.log("Adding Attribute...");
    const { attribute_name, status } = req.body;

    if (!attribute_name || !status) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const exists = await Attribute.attributeExists(attribute_name);
        if (exists) {
            return res.status(409).json({ error: "Attribute already exists" }); // Conflict
        }

        await Attribute.createAttribute({ 
            attribute_name,
            active_status: status
        });

        return res.status(200).json({ message: "Attribute added successfully" });
    } catch (error) {
        console.error("Error adding attribute:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
    
    
    
    

    static async editAttribute(req, res) {
        try {
            const AttributeId = req.body.nid; // Get header ID from hidden field
            const { attribute_name , active_status } = req.body; // Extract fields from form
    
            console.log("Controller Received Data:", req.body); // Debugging log
    
            // Validate required fields
            if (!attribute_name || !active_status) {
                console.log("Missing required fields.", req.body);
                return res.status(400).send("Missing required fields.");
            }
    
            // Update the header with mapped field names
            const result = await Attribute.updateAttribute(
                AttributeId,
                attribute_name,
                active_status
            );
    
            if (result) {
                return res.json({ message: "Attribute updated successfully!" });
            } else {
                res.status(400).send("Error updating attribute");
            }
        } catch (error) {
            console.error("Error editing attribute:", error);
            res.status(500).send("Internal Server Error");
        }
    }
    

    // Delete user
    static async deleteAttribute(req, res) {
        try {
            const AttributeId = req.params.id;
            const result = await Attribute.deleteAttribute(AttributeId);

            if (result) {
                return res.json({ message: "Attribute deleted successfully!" });
            } else {
                res.status(400).send("Error deleting attribute");
            }
        } catch (error) {
            console.error("Error deleting attribute:", error);
            res.status(500).send("Internal Server Error");
        }
    }

 


}

module.exports = MngAttributeController;
