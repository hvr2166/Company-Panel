const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const db = require("./db");
const flash = require("connect-flash");
const session = require("express-session");
const multer = require("multer");
var passport = require('passport');
const port = 3000;

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, "public/uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

require('./config/passport')(passport);

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Save files in 'public/uploads'
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Rename files to avoid conflicts
    }
});

const upload = multer({ storage: storage });

// Serve uploaded files statically
app.use('/uploads', express.static(uploadDir));

// Middleware for handling file uploads (should be before express.json)
app.use(upload.any()); // Allows any file upload before JSON parsing

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration (use env variable for security)
//express session
app.use(session({
    secret: 'your-secret-key',          // A secret key to sign the session ID cookie
    resave: false,                      // Don't save session if unmodified
    saveUninitialized: false,           // Don't create session until something is stored
    cookie: { secure: false }           // Set to true if using HTTPS
  }));
  

// Flash messages
app.use(flash());
//global vars
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error= req.flash('error');
  
    next();
  });


  


// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
const route = require('./route/indexroutes');
app.use('/', route);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
