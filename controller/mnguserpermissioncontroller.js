console.log("mnguserpermissioncontroller.js is running");
const db = require("../db"); // Import database connection

const UserPermission = require("../model/mnguserpermissionmodel"); // Import permission model
const User = require("../model/mngusermodel"); // Import user model

class MngUserPermissionController {
    static async getAll(req, res) {
        try {
            console.log("Fetching users and permissions...");

            // Fetch users
            const users = await User.getAll();
            console.log("Users:", users);

            // Fetch menus (properly formatted)
            const menus = await UserPermission.getAll();
            console.log("Formatted Menus (to EJS):", JSON.stringify(menus, null, 2));

            // Render the view and pass the formatted menus
            res.render("managepermissions", { users, menus });
        } catch (error) {
            console.error("Error fetching data:", error);
            res.status(500).send("Internal Server Error");
        }
    }
    static async addpermission(req, res) {
        try {
            console.log("adding permissions");
            const { user_nid, permissions } = req.body;

            if (!user_nid || !permissions) {
                return res.status(400).json({ message: "Missing data!" });
            }

            // Call model to update permissions
            await UserPermission.updateUserPermissions(user_nid, permissions);
            return res.json({ message: "Permissions updated successfully!" });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Database error!" });
        }
    }

    static async getUserPermissions(req, res) {
        try {
            const userId = req.params.userId;
            const [result] = await db.query("SELECT roles FROM tbl_user WHERE nid = ?", [userId]);
    
            if (result.length === 0) return res.status(404).json({ message: "User not found" });
    
            const roles = result[0].roles ? result[0].roles.split(",").map(id => parseInt(id)) : [];
            res.json({ permissions: roles });
        } catch (error) {
            console.error("Error fetching user permissions:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    
}

module.exports = MngUserPermissionController;
