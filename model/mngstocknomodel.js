console.log("mngstocknomodel.js is running");
const db = require('../db');
const JsBarcode = require('jsbarcode');
const { createCanvas } = require('canvas');

// Function to generate a random 11-digit barcode
function generateRandomBarcode() {
    return Math.floor(10000000000 + Math.random() * 90000000000).toString();
}

class Stockno { 
    static async getAll() {
        try {
            const conn = await db.getConnection();
            const [data] = await conn.query('SELECT * FROM tbl_managestockno');
            conn.release();
            return data;
        } catch (error) {
            console.error("Error fetching lots:", error);
            throw error;
        }
    }

      static async createLot(lotData) {
    const {
        head_category, category, lot, barcode, barcodeImage,  image, certificate_image,
        description, dimension, colour, size,Quality, Mines, Shapes, stone,
         price_code, treatment, partner, cut, location,weightunit
    } = lotData;

    console.log("Barcode Image being inserted:", barcodeImage.slice(0, 100));  // Only log first 100 chars

        const weight = 0; // ✅ Force zero
    const pcs = 0;    // ✅ Force zero


    try {
        const conn = await db.getConnection();

        const sql = `INSERT INTO tbl_managestockno (
            head_category, category, lot, barcode, barcode_image, weight,
            image, certificate_image, description, dimension, colour, size,
            quality, mines, shape, stone_type, pcs, price_code, treatment,
            partner, cut, location,weight_unit
        ) VALUES (?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?,?)`;

        await conn.query(sql, [
            head_category, category, lot, barcode, barcodeImage, weight,
            image, certificate_image, description, dimension, colour, size,
            Quality, Mines, Shapes, stone, pcs, price_code, treatment,
            partner, cut, location,weightunit
        ]);

        console.log()

        conn.release();
        return ;
    } catch (error) {
        console.error("Error inserting lot:", error);
        throw error;
    }
}

    // Fetch stock item by barcode
    static async getByBarcode(barcode) {
        try {
            const conn = await db.getConnection();
            const [data] = await conn.query(
                'SELECT nid AS id, barcode, barcode_image, lot, weight, pcs FROM tbl_managestockno WHERE barcode = ?',
                [barcode]
            );
            conn.release();
            return data[0]; // Returns full stock item data
        } catch (error) {
            console.error("Error fetching stock by barcode:", error);
            throw error;
        }
    }

    static async updateLot(id, updatedData) {
        const {
            head_category,
            category,
            lot,
            barcode,
            weight,
            image,
            certificate_image,
            description,
            dimension,
            colour,
            size,
            quality,
            mines,
            shape,
            stone_type,
            pcs,
            price_code,
            treatment,
            partner,cut,location,weightunit
        } = updatedData;

        console.log("Updating lot with ID:", id);
        console.log("Updated Data:", updatedData);

        try {
            const conn = await db.getConnection();

            // Regenerate barcode image
            const canvas = createCanvas();
            JsBarcode(canvas, barcode, {
                format: "CODE128",
                displayValue: true,
                fontSize: 12,
                height: 30,
                width: 1
            });
            const barcodeImage = canvas.toDataURL();

            // SQL query to update the lot
            const query = `
                UPDATE tbl_managestockno 
                SET 
                    head_category = ?, 
                    category = ?, 
                    lot = ?, 
                    barcode = ?, 
                    barcode_image = ?, 
                    weight = ?, 
                    image = ?, 
                    certificate_image = ?, 
                    description = ?, 
                    dimension = ?, 
                    colour = ?, 
                    size = ?, 
                    quality = ?, 
                    mines = ?, 
                    shape = ?, 
                    stone_type = ?, 
                    pcs = ?, 
                    price_code = ?, 
                    treatment = ?, 
                    partner = ? , cut = ?, location = ?,weight_unit=?
                WHERE nid = ?
            `;

            const values = [
                head_category, category, lot, barcode, barcodeImage, weight, image, certificate_image,
                description, dimension, colour, size, quality, mines, shape, stone_type, pcs,
                price_code, treatment, partner , cut, location ,weightunit, id
            ];

            console.log("Executing Query:", query);
            console.log("Query Values:", values);

            const [result] = await conn.query(query, values);
            conn.release();

            if (result.affectedRows > 0) {
                console.log("Lot updated successfully");
                return { message: "Lot updated successfully" };
            } else {
                console.warn("No rows were updated. Lot ID might not exist.");
                return { message: "No rows were updated. Lot ID might not exist." };
            }
        } catch (error) {
            console.error("Error updating lot:", error);
            throw new Error("Failed to update lot in the database");
        }
    }

    static async deleteLot(id) {
        try {
            const conn = await db.getConnection();
            const query = `DELETE FROM tbl_managestockno WHERE nid = ?`;
            const [result] = await conn.query(query, [id]);
            conn.release();
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Error deleting lot:", error);
            throw error;
        }
    }
}

module.exports = Stockno;