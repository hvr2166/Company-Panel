const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".xlsx") {
        return cb(new Error("Only Excel files are allowed"), false);
    }
    cb(null, true);
};

module.exports = multer({ storage, fileFilter });


