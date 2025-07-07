console.log("mngusermodel.js is running");
const db = require('../db'); // Import the database connection
const bcrypt = require('bcrypt');

class User {
    // Fetch all users from tbl_user
    static async getAll() {
        try {
            const conn = await db.getConnection(); // Get DB connection
            const [data] = await conn.query('SELECT * FROM tbl_user'); // Fetch data
            console.log("Data:", data); // Debugging log
            conn.release(); // Release connection
            return data; // Return fetched user data
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error; // Throw error to handle in controller
        }
    }

    static async createUser(userData) {
        const { user_name, user_password, user_email, firstname, lastname, phone } = userData;

        try {
            const conn = await db.getConnection(); // Get DB connection
            const hashedPassword = await bcrypt.hash(user_password, 10); // 🔒 Hash the password with salt rounds = 10
            const sql = `INSERT INTO tbl_user (user_name, user_password, user_email, firstname, lastname, phone) 
                         VALUES (?, ?, ?, ?, ?, ?)`;
            await conn.query(sql, [user_name, hashedPassword, user_email, firstname, lastname, phone]);
            conn.release(); // Release connection
        } catch (error) {
            console.error("Error inserting user:", error);
            throw error;
        }
    }

    static async updateUser(nid, user_name, user_password, user_email, firstname, lastname, phone) {
        try {
            const conn = await db.getConnection();
    
            let query = `UPDATE tbl_user 
                         SET user_name = ?, user_email = ?, firstname = ?, lastname = ?, phone = ?`;
            let values = [user_name, user_email, firstname, lastname, phone];
    
            // If user_password is provided, update it
            if (user_password) {
                query += `, user_password = ?`;
                values.push(user_password);
            }
    
            query += ` WHERE nid = ?`;
            values.push(nid);
    
            await conn.query(query, values); // Pass parameters correctly
            conn.release();
            return { message: "User updated successfully" };
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    }
    
    
    // Delete user
    static async deleteUser(id) {
        try {
            const conn = await db.getConnection();
            const query = `DELETE FROM tbl_user WHERE nid = ?`;
            const [result] = await conn.query(query, [id]);
            conn.release();
            return result;
        } catch (error) {
            console.error("Error deleting user:", error);
            throw error;
        }
    }

    static async findUserByEmail(email) {
        const query = 'SELECT COUNT(*) AS count FROM tbl_user WHERE user_email = ?';
        const [rows] = await db.execute(query, [email]);
        return rows[0].count > 0; // Returns true if email exists, false otherwise
      }

      static async findOne(email) {
        try {
          const query = 'SELECT * FROM tbl_user WHERE user_email = ?';
          const [rows] = await db.execute(query, [email]);
          console.log(rows);
          return rows.length > 0 ? rows[0] : null; // Return user object or null
        } catch (err) {
          throw new Error('Database error: ' + err.message);
        }
      }
      
}

module.exports = User;