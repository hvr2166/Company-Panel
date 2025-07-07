console.log("indexroutes.js is running");
const express = require("express");
const router = express.Router();
const passport = require("passport");
const db = require("../db"); // Import the database connection

// Import the controller
const MngUserController = require("../controller/mngusercontroller");
const AdminHeaderController = require("../controller/mngheadercontroller");
const MngAttributeController = require("../controller/mngattributecontroller")
const MngAttributeValueController = require("../controller/mngattributevaluecontroller")
const MngUserPermissionController = require("../controller/mnguserpermissioncontroller")
const  MngbalacesheetgrpController = require("../controller/mngbalacesheetgrpcontroller")  
const MngaccountheadController = require("../controller/mngaccountheadcontroller")
const MngBankController = require("../controller/mngbankcontroller")
const MngCategoryController = require("../controller/mngcategorycontroller")
const MngCurrencyController = require("../controller/mngcurrencycontroller")
const MngHeadCategoryController = require("../controller/mngheadcategorycontroller")
const MngpersonalExpenseController = require("../controller/mngpersonalexpensecontroller")
const MngsupplierController = require("../controller/mngsuppliercontroller")
const Mngsalepersoncontroller = require("../controller/mngsalepersoncontroller")
const MngStocknoController = require("../controller/mngstocknocontroller")
const MngpurchaseappController = require("../controller/mngpurchaseappcontroller")
const MngsupplierpaymentController = require("../controller/mngsupplierpaymentcontroller")
const MngcustomerController =require ("../controller/mngcustomercontroller")
const MngStockhistoryController = require("../controller/mngstockhistorycontroller")
const  MngpurchaseController= require("../controller/mngpurchasecontroller")
const MngsalesappController = require("../controller/mngsalesappcontroller")
const MngcustomerpaymentController = require("../controller/mngcustomerpaymentcontroller")
const MngsaleController = require("../controller/mngsalecontroller")
const ProfitLossController = require("../controller/profitlosscontroller");
const ledgerController = require("../controller/ledgercontroller");
const balanceSheetController = require('../controller/balancesheetcontroller');
const managevoucherController = require("../controller/managevouchercontroller")
const cashflowController = require("../controller/cashflowcontroller");
const bankflowController = require("../controller/bankflowcontroller")
const stockreportController = require("../controller/stockreportcontroller")
const InvoiceController =require("../controller/purchaseinvoicecontroller")
const saleInvoiceController = require("../controller/saleinvoicecontroller")    
const Mngtransferstockcontroller = require("../controller/mngtransferstockcontroller")
const DashboardController = require('../controller/dashboardController');
const DashboardModel = require('../model/dashboardModel');
const upload = require("../middleware/uploadExcel"); // We'll create this
const stockprintingcontroller = require("../controller/stockprintingController");



const exportAllDataController = require("../controller/exportalldataController");

router.get("/exportalldata", exportAllDataController.exportAllToExcel);


// Route for the main page
router.get("/index", (req, res) => {
    const hasDashboardAccess = req.session.user.permissions.some(p => p.rolename === 'Dashboard');
    
    res.render("index", {
        user: req.session.user,
        permissions: req.session.user.permissions,
        initialPage: hasDashboardAccess ? "/dashboard" : ""
    });
});

// login 
router.get("/", function (req, res, next) {
    res.render('login');
  });

  router.post('/login', async (req, res, next) => {
    passport.authenticate('local', async (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        req.flash('error', info.message);
        return res.redirect('/');
      }
  
      req.logIn(user, async (err) => {
        if (err) return next(err);
  
        const roleIds = user.roles.split(',').map(id => parseInt(id.trim()));
        const [permissions] = await db.execute(
          `SELECT * FROM tbl_permission WHERE nid IN (${roleIds.join(',')}) AND b_status = 1`
        );
  
        req.session.user = {
          id: user.nid,
          name: user.user_name,
          email: user.user_email,
          firstname: user.firstname,
          lastname: user.lastname,
          phone: user.phone,
          permissions: permissions
        };
  


            // Redirect based on permission
            res.redirect( '/index');
      });
    })(req, res, next);
  });  
 
  router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Logout Error:", err);
            return res.redirect('/'); // Redirect to home on error
        }
        res.redirect('/'); // Redirect to login after logout
    });
  });

// dashboard route
// Render dashboard view 
router.get('/dashboard', DashboardController.renderDashboard);
router.get('/api/get-dues', DashboardController.getDuesData);


// API route for chart
router.get('/api/chart-data', DashboardController.getChartData);
router.get('/api/stone-type-chart', DashboardController.getStoneTypeChart);
router.get('/api/bank-amount', async (req, res) => {
  try {
    const bank = req.query.bank;
    const amount = await DashboardModel.getBankAmount(bank);
    res.json({ amount });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching bank amount' });
  }
});

// menu manage users routes
//  manage users routes
router.get("/manage%20user", MngUserController.getAll);
router.post("/adduser", MngUserController.addUser);
router.post("/edituser", MngUserController.editUser); 
router.post("/deleteuser/:id", MngUserController.deleteUser);
//manage admin header routes
router.get("/admin%20header", AdminHeaderController.getAll);
router.post("/addadminheader", AdminHeaderController.addAdminHeader);
router.post("/deleteadminheader/:id", AdminHeaderController.deleteAdminHeader);
router.post("/editadminhead", AdminHeaderController.editAdminHeader);
//manage user permissions
router.get("/user%20permission", MngUserPermissionController.getAll);
router.post("/assign-permissions", MngUserPermissionController.addpermission);
router.get("/get-permissions/:userId", MngUserPermissionController.getUserPermissions);

// manage attribute routes
router.get("/add%20attribute", MngAttributeController.getAll);
router.post("/addingattribute", MngAttributeController.addAttribute);
router.post("/editattribute", MngAttributeController.editAttribute);    
router.post("/deleteattribute/:id", MngAttributeController.deleteAttribute);

// menu stocks routes
//manage stock no
// menu stocks routes
router.get("/manage%20stockno", MngStocknoController.getAll);
router.post("/addlot", MngStocknoController.addlot);
router.post("/editlot", MngStocknoController.editlot);
router.post("/deletelot/:id", MngStocknoController.deletelot);
router.get("/getStockDetails/:barcode", MngStocknoController.getStockDetails);
router.post("/uploadstockfile", upload.fields([{ name: "excelFile" }]), MngStocknoController.uploadExcel);
router.get("/downloadsamplestock", MngStocknoController.downloadSampleStockExcel);
router.get("/exportstock", MngStocknoController.exportStockToExcel);
router.get("/generate-barcode", MngStocknoController.generateBarcode);
router.get("/get-next-lot", MngStocknoController.getNextLotNumber);


// stock history routes
router.get("/stock%20history",MngStockhistoryController.getAll);

//manage category routes
router.get("/categories", MngCategoryController.getAll);
router.post("/addcategory", MngCategoryController.addCategory);
router.post("/editcategory", MngCategoryController.editCategory);
router.post("/deletecategory/:id", MngCategoryController.deleteCategory);

//manage head category routes
router.get("/head%20categories", MngHeadCategoryController.getAll);
router.post("/addheadcategory",  MngHeadCategoryController.addCategory);
router.post("/editheadcategory", MngHeadCategoryController.editCategory);
router.post("/deleteheadcategory/:id", MngHeadCategoryController.deleteCategory);

// manage attribute values routes
router.get("/attribute%20value", MngAttributeValueController.getAll);
router.post("/addattributevalue", MngAttributeValueController.addAttributevalue);
router.post("/editattributevalue", MngAttributeValueController.editAttributevalue);
router.post("/deleteattributevalue/:id", MngAttributeValueController.deleteAttributevalue);
// stock printing routes
router.get("/stock%20printing", (req, res) => {
    res.render("stockprinting"); // Render views/stockprinting.ejs
});
router.get('/getStockByBarcode/:barcode', stockprintingcontroller.getStockByBarcode);

// stock transfer routes

router.get('/transfer%20stock', Mngtransferstockcontroller.loadTransferPage);
router.get('/lot-details/:id', Mngtransferstockcontroller.getLotDetails);
router.post('/transfer-stock', Mngtransferstockcontroller.transferStock);
// view all transfers routes
router.get('/view%20all%20transfer', Mngtransferstockcontroller.getAllTransferStocks);

//menu expense routes
// balace sheet group routes
router.get("/view%20balance%20sheet%20grp", MngbalacesheetgrpController.getAll);
router.post("/addexpensehead",  MngbalacesheetgrpController.addexpensehead);
router.post("/editexpensehead",  MngbalacesheetgrpController.editexpensehead);
router.post("/deleteexpensehead/:id",  MngbalacesheetgrpController.deleteexpensehead);
// account head page routes
router.get("/manage%20account%20head" , MngaccountheadController.getAll)
router.post("/addaccounthead", MngaccountheadController.addAccounthead);
router.post("/editaccounthead", MngaccountheadController.editAccounthead);      
router.post("/deleteaccounthead/:id", MngaccountheadController.deleteAccounthead);
// manage bank routes
router.get("/manage%20bank", MngBankController.getAll)
router.post("/addbank", MngBankController.addbank);
router.post("/editbank", MngBankController.editbank);
router.post("/deletebank/:id", MngBankController.deletebank);
// manage voucher routes
router.get("/manage%20voucher", managevoucherController.getAll);
router.post("/addvoucher", managevoucherController.addVoucher);
router.post("/editvoucher", managevoucherController.editVoucher);
router.post("/deletevoucher/:id", managevoucherController.deleteVoucher);
// manage personal expenses routes  
router.get("/personal%20expense", MngpersonalExpenseController.getAll);
router.post("/addpersonalexpense", MngpersonalExpenseController.addpersonalexpense);
router.post("/editpersonalexpense", MngpersonalExpenseController.editpersonalexpense);
router.post("/deletepersonalexpense/:id", MngpersonalExpenseController.deletepersonalexpense);

//menu purchase routes
//manage purchase routes
router.get("/manage%20purchase" , MngpurchaseController.getAll); 
router.post("/addpurchase", MngpurchaseController.addpurchase);
router.get('/getPurchaseDetails/:id', MngpurchaseController.getPurchaseDetails);
router.post('/updatePurchase/:id', MngpurchaseController.updatePurchase);
router.post("/addpurchasepayment", MngpurchaseController.addpurchasepayment);
router.get('/getPaymentDetails/:id', MngpurchaseController.getPaymentDetails); 
router.post('/updatepurchasepayment/:id', MngpurchaseController.updatePaymentDetails);
router.get('/purchaseinvoice/:id', InvoiceController.generateInvoice);
router.post("/uploadpurchasefile", MngpurchaseController.uploadExcel);
router.get("/downloadsamplepurchase", MngpurchaseController.downloadSampleExcel);
router.get('/getpurchaseinvoiceinfo/:id', MngpurchaseController.getpurchaseInvoicePaymentSummary);

// manage supplier routes
router.get("/manage%20suppliers", MngsupplierController.getAll);
router.post("/addsupplier", MngsupplierController.addsupplier);
router.post("/editsupplier", MngsupplierController.editsupplier);
router.post("/deletesupplier/:id", MngsupplierController.deletesupplier);
// supplier payment routes
router.get('/supplier%20payments', MngsupplierpaymentController.getAll);

// menu sales 
//manage sales routes
router.get("/manage%20sales" , MngsaleController.getAll); 
router.post("/addsales", MngsaleController.addsale);
router.get("/getSaleDetails/:id", MngsaleController.getSaleDetails);
router.post("/updatesales/:id", MngsaleController.updateSale);
router.post("/addsalespayment", MngsaleController.addsalepayment);
router.get('/getdetails/:id', MngsaleController.getPaymentDetails);
router.post('/updatesalespayment/:id', MngsaleController.updatePaymentDetails);
router.get('/salesinvoice/:id', saleInvoiceController.generateInvoice);
router.get('/getsaleinvoiceinfo/:id', MngsaleController.getSaleInvoicePaymentSummary);



//manage customer routes
router.get("/manage%20customers" , MngcustomerController.getAll);
router.post("/addcustomers" ,  MngcustomerController.addCustomer);
router.post("/editcustomers" ,  MngcustomerController.editCustomer);
router.post("/deletecustomer/:id" ,  MngcustomerController.delete);
//create sale invoice routes
router.get("/create%20saleinvoice", (req, res) => {
    res.render("createsaleinvoice"); 
});
// manage sale person routes
router.get("/manage%20saleperson", Mngsalepersoncontroller.getAll);
router.post("/addsaleperson",  Mngsalepersoncontroller.addsaleperson );
router.post("/editsaleperson", Mngsalepersoncontroller.editsaleperson );
router.post("/deletesaleperson/:id", Mngsalepersoncontroller.deletesaleperson );
// customer payment routes
router.get('/customer%20payments', MngcustomerpaymentController.getAll);

//menu approvals 
// manage sales approvals routes
router.get("/sales%20approvals" , MngsalesappController.getAll);
router.post("/addsalesapproval", MngsalesappController.addSalesApproval);
router.get("/getSalesApproval/:id", MngsalesappController.getApprovalDetails);
router.post("/salesapproval", MngsalesappController.editApproval);
router.post("/editsalesapproval", MngsalesappController.updatesalesApproval);
// manage purchase approvals routes
router.get("/purchase%20approvals" , MngpurchaseappController.getAll);
router.post("/addpurchaseapproval", MngpurchaseappController.addPurchaseApproval);
router.get("/getPurchaseApproval/:id", MngpurchaseappController.getApprovalDetails);
router.post("/purchaseapproval", MngpurchaseappController.editApproval);
router.post("/editpurchaseapproval", MngpurchaseappController.updatePurchaseApproval);



//menu reports routes
// manage profit and loss report routes
router.get("/profitloss%20report", ProfitLossController.getProfitLossReport);
router.get("/export-profitloss-excel", ProfitLossController.exportToExcel);
//stock report routes
router.get("/stock%20report", stockreportController.stockreport);
router.get("/stock%20report", stockreportController.stockreport);

router.get("/getLotData", stockreportController.fetchLotData);
router.get("/export-stockreport-excel", stockreportController.exportToExcel);
router.get('/stockreport-lotdetail', stockreportController.lotDetailReport);


//ledger report routes
router.get("/ledger%20report", ledgerController.getLedgerReport);
router.get("/export-ledger", ledgerController.exportLedgerToExcel);
//balance sheet report routes
router.get('/balance%20sheet', balanceSheetController.getBalanceSheet);
router.get("/export-balancesheet", balanceSheetController.exportToExcel);

//cash flow report routes
router.get('/cash%20book', cashflowController.getCashFlow);
router.get('/getTransactions', cashflowController.getTransactions);
router.get('/export-cashflow', cashflowController.exportToExcel);

// bank flow report
router.get("/bank%20book", bankflowController.getBankBook);
router.get('/export-bankflow', bankflowController.exportToExcel);

// purchase (by stock) route
router.get("/purchase%20by%20stock", (req, res) => {
    res.render("purchasebystock"); 
});
// purchase (by supplier) route
router.get("/purchase%20by%20supplier", (req, res) => {
    res.render("purchasebysupplier"); 
});
// sales(by stock) route
router.get("/sales%20by%20stock", (req, res) => {
    res.render("salesbystock"); 
});
// sales(by customer) route
router.get("/sales%20by%20customer", (req, res) => {
    res.render("salesbycustomer"); 
});

//menu other master routes
// manage currency routes
router.get("/manage%20currencies", MngCurrencyController.getAll);
router.post("/addcurrency", MngCurrencyController.addcurrency); 
router.post("/editcurrency", MngCurrencyController.editcurrency);
router.post("/deletecurrency/:id", MngCurrencyController.deletecurrency);



module.exports = router;
