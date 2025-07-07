const db = require("../db");

class UserPermission {
    static async getAll() {
        try {
            const query = "SELECT * FROM tbl_permission ORDER BY parent_id, heading DESC";
            const result = await db.query(query);

            console.log("Query Result:", result);

            // Extract only the first array (actual permissions)
            const permissions = result[0] || [];
            console.log("Raw Permissions:", permissions);

            // Group permissions into menus and their submenus
            const menus = {};
            permissions.forEach(row => {
                if (row.heading === "menu") {
                    menus[row.nid] = {
                        id: row.nid,
                        name: row.rolename,
                        submenus: []
                    };
                } else if (row.heading === "submenu" && menus[parseInt(row.parent_id)]) {
                    menus[parseInt(row.parent_id)].submenus.push({
                        id: row.nid,
                        name: row.rolename
                    });
                }
            });

            const menuArray = Object.values(menus);
            console.log("Formatted Menus:", menuArray);
            return menuArray;
        } catch (error) {
            console.error("Error fetching permissions:", error);
            return [];
        }
    }

    static async updateUserPermissions(user_nid, permissions) {
        try {
            // Convert permissions array to a comma-separated string
            const permissionsString = permissions.join(",");

            // Update the roles field in tbl_users
            const query = "UPDATE tbl_user SET roles = ? WHERE nid = ?";
            await db.query(query, [permissionsString, user_nid]);

            return { success: true, message: "Permissions updated successfully!" };
        } catch (error) {
            console.error("Error updating user permissions:", error);
            throw error;
        }
    }
}

module.exports = UserPermission;
