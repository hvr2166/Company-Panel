const xlsx = require("xlsx");
const db = require("../db");

const TABLES = [
  "tbl_bank",
  "tbl_customers",
  "tbl_personal_exp",
  "tbl_suppliers",
  "tbl_mng_purchase",
  "tbl_mng_sales",
  "tbl_managestockno",
  "tbl_customer_payment",
  "tbl_supplier_payment"
];

exports.exportAllToExcel = async (req, res) => {
  try {
    const workbook = xlsx.utils.book_new();

    for (const table of TABLES) {
      const [rows] = await db.execute(`SELECT * FROM ${table}`);
      
      // Remove b_status and creation_date fields
      const cleanedRows = rows.map(row => {
        delete row.b_status;
        delete row.creation_date;
        return row;
      });

      const worksheet = xlsx.utils.json_to_sheet(cleanedRows);
      xlsx.utils.book_append_sheet(workbook, worksheet, table);
    }

    // Generate a buffer
    const buffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=data_export.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (error) {
    console.error("Export Error:", error);
    res.status(500).send("Failed to export data.");
  }
};
