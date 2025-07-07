console.log("Controller is running");
const stockno = require('../model/mngstocknomodel');
const Category = require('../model/mngcategoryemodel');
const HeadCategory = require('../model/mngheadcategoryemodel');
const JsBarcode = require('jsbarcode');
const { createCanvas } = require('canvas');
const Attribute = require('../model/mngattributemodel');
const AttributeValue = require('../model/mngattributevaluemodel');
const xlsx = require("xlsx");
const fs = require("fs");
const path = require('path');
const db = require('../db');

class MngstocknoController {
    static async getAll(req, res) { 
        try {
            console.log("Fetching lots...");
            const stockItems = await stockno.getAll();
            const category = await Category.getAll();
            const headcategory = await HeadCategory.getAll();
            const attributes = await Attribute.getAll();
            const attributeGroups  = await AttributeValue.getGroupedAttributes(); // Fetch all attribute values

            res.render('mngstockno', { stockItems, category, headcategory,attributeGroups  , attributes});
        } catch (error) {
            console.error("Error fetching lots:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    static async addlot(req, res) {
        try {
            console.log("Adding lot...");
            console.log("Received Data:", req.body);
    
    const {
    head_category, category, lot, barcode, weight, description, dimension,
    colour, size, Quality, Mines, Shapes, stone, pcs,
    price_code, treatment, partner, cut, location,weightunit
} = req.body;


// Accept uploaded files
let image = req.files?.image?.[0]?.filename ?? null;
let certificate_image = req.files?.certificate_image?.[0]?.filename ?? null;


// Validate barcode is provided
if (!head_category || !category || !lot || !barcode || !weight || !pcs) {
    return res.status(400).json({ error: "Required fields are missing" });
}


// FIX: Regenerate barcodeImage here
const canvas = createCanvas(300, 100);
JsBarcode(canvas, barcode, {
  format: "CODE128",
  displayValue: true,
  fontSize: 16,
  height: 50,
  width: 2
});
const barcodeImage = canvas.toDataURL();

// Save lot
await stockno.createLot({
    head_category, category, lot, barcode, barcodeImage,
    weight, image, certificate_image, description, dimension, colour,
    size, Quality, Mines, Shapes, stone, pcs, price_code,
    treatment, partner, cut, location,weightunit
});

res.status(200).json({ message: "Lot added successfully" });
        } catch (error) {
            console.error("Error adding lot:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

static async generateBarcode(req, res) {
  try {
    const { barcode, barcodeImage } = MngstocknoController.generateRandomBarcodeValue();
    res.json({ barcode, barcodeImage });
  } catch (err) {
    console.error("Error generating barcode:", err);
    res.status(500).json({ error: "Barcode generation failed" });
  }
}



static generateRandomBarcodeValue() {
  const barcode = Math.floor(10000000000 + Math.random() * 90000000000).toString();
  const canvas = createCanvas(300, 100);
  JsBarcode(canvas, barcode, {
    format: "CODE128",
    displayValue: true,
    fontSize: 16,
    height: 50,
    width: 2
  });
  const barcodeImage = canvas.toDataURL();
  return { barcode, barcodeImage };
}

static async getNextLotNumber(req, res) {
  const { headCategory } = req.query;
  const conn = await db.getConnection();
  const shortForm = headCategory.split(/\s+/).map(w => w[0]).join('').toUpperCase();
  const [rows] = await conn.query(
    "SELECT COUNT(*) as count FROM tbl_managestockno WHERE head_category = ?",
    [headCategory]
  );
  const nextNumber = rows[0].count;
  conn.release();
  res.json({ lotNumber: `${shortForm}${nextNumber}` });
}


    static async getStockDetails(req, res) {
        try {
            const barcode = req.params.barcode;
            console.log("Scanning Barcode:", barcode);
            
            // Retrieve stock details using the barcode
            const stockItem = await stockno.getByBarcode(barcode);
            if (!stockItem) {
                return res.status(404).json({ message: "Stock item not found" });
            }

            console.log("Scanned Data:", { lot: stockItem.lot, weight: stockItem.weight });

            // Return Lot ID & Weight when scanned
            res.json({ lot: stockItem.lot, weight: stockItem.weight });
        } catch (error) {
            console.error("Error fetching stock details:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async editlot(req, res) {
        try {
            const { nid, head_category, category, lot, barcode, old_barcode_image, weight, description, dimension, colour, size, quality, mines, shape, stone_type, pcs, price_code, treatment, partner,cut, location, old_image, old_certificate_image,weightunit } = req.body;

      let image = old_image === "" ? null : old_image;
let certificate_image = old_certificate_image === "" ? null : old_certificate_image;

if (req.files && req.files.length > 0) {
    req.files.forEach(file => {
        if (file.fieldname === "image") {
            image = file.filename;
        } else if (file.fieldname === "certificate_image") {
            certificate_image = file.filename;
        }
    });
}
let barcodeImage = old_barcode_image;

// If no image exists, regenerate it
if (!barcodeImage) {
  const canvas = createCanvas(300, 100);
  JsBarcode(canvas, barcode, {
    format: "CODE128",
    displayValue: true,
    fontSize: 16,
    height: 50,
    width: 2
  });
  barcodeImage = canvas.toDataURL();
}


            await stockno.updateLot(nid, {
                head_category,
                category,
                lot,
                barcode,
                barcodeImage,
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
                partner, cut, location,weightunit
            });

            return res.status(200).json({ message: "Lot updated successfully" });
        } catch (error) {
            console.error("Error updating lot:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

 static async deletelot(req, res) {
    try {
        const lotId = req.params.id;
        const result = await stockno.deleteLot(lotId);

        if (result) {
            return res.status(200).json({ success: true, message: "Lot deleted" });
        } else {
            return res.status(400).json({ success: false, message: "Error deleting lot" });
        }
    } catch (error) {
        console.error("Error deleting lot:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


    static async uploadExcel(req, res) {
        try {
          if (!req.files || !req.files["excelFile"] || req.files["excelFile"].length === 0) {
            return res.status(400).send("No file uploaded");
          }
    
          const file = req.files["excelFile"][0];
          const workbook = xlsx.readFile(file.path);
          const sheetName = workbook.SheetNames[0];
          const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    
          for (const row of rows) {
            await stockno.createLot({
              head_category: row.head_category,
              category: row.category,
              lot: row.lot,
              weight: row.weight,
              description: row.description,
              dimension: row.dimension,
              colour: row.colour,
              size: row.size,
              quality: row.quality,
              mines: row.mines,
              shape: row.shape,
              stone_type: row.stone_type,
              pcs: row.pcs,
              price_code: row.price_code,
              treatment: row.treatment,
              partner: row.partner
            });
          }
    
          fs.unlinkSync(file.path); // remove uploaded file
    
          req.flash("success", "Stock Excel uploaded successfully!");
          res.redirect("/manage%20stockno"); // Or your stock management page
        } catch (error) {
          console.error("❌ Stock Excel Upload Error:", error);
          res.status(500).send("Failed to upload stock file");
        }
      }
    
      static async downloadSampleStockExcel(req, res) {
        const sampleData = [
          {
            head_category: "Head A",
            category: "Cat A",
            lot: "L001",
            weight: 12.5,
            description: "Sample description",
            dimension: "10x5",
            colour: "Red",
            size: "Large",
            quality: "High",
            mines: "Mine X",
            shape: "Round",
            stone_type: "Ruby",
            pcs: 5,
            price_code: "PC001",
            treatment: "Heated",
            partner: "Partner A"
          }
        ];
    
        const worksheet = xlsx.utils.json_to_sheet(sampleData);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, "SampleLots");
    
        const filePath = path.join(__dirname, "../public/sample_lot.xlsx");
        xlsx.writeFile(workbook, filePath);
        res.download(filePath, "sample_lots.xlsx");
      }
    
      static async exportStockToExcel(req, res) {
        try {
          const stockItems = await stockno.getAll();
    
          const worksheet = xlsx.utils.json_to_sheet(stockItems);
          const workbook = xlsx.utils.book_new();
          xlsx.utils.book_append_sheet(workbook, worksheet, "ExportedLots");
    
          const filePath = path.join(__dirname, "../public/lot.xlsx");
          xlsx.writeFile(workbook, filePath);
          res.download(filePath, "stock_export.xlsx");
        } catch (error) {
          console.error("❌ Export failed:", error);
          res.status(500).json({ error: "Failed to export Excel file" });
        }
      }
}

module.exports = MngstocknoController;