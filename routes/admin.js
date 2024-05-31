const express = require('express');
const router = express.Router();

const admin = require('../controller/admincontroller');
// authorization levels for multiple admins if any
const admindatacollection = require('../models/adminDB');

// Application Middlewares
const multer = require('multer');
const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, 'assets/img/uploads');
    },
    filename : (req, file, cb) => {
        cb(null, file.originalname);
    }
});

// Middleware for multiple images uploading
const multerImageUpload = multer({ storage : storage}).array('foodimage');

// Authentication Middleware
const checkAdminLoggedIn =  async (req, res, next) => {
    try{
        if(req.session.isAdminLoggedIn){
            next();
        }
        else{
            // req.session.destroy();
            res.redirect('/admin');
        }
    }
    catch{
        // req.session.destroy();
        res.redirect('/admin');
    }
}

// ADMIN ROUTES
// Login
router.get('/', admin.adminloginget);
router.post('/', admin.adminloginpost);

// Home
router.get('/home',checkAdminLoggedIn, admin.adminhome);

// User Management
router.get('/userdetails', admin.adminuserdetails);
router.get('/usertoggleblock/:id', admin.adminusertoggleblock);

// Category Management
router.get('/productcategory', admin.adminproductcategory)

router.get('/addproductcategory', admin.adminaddproductcategoryget);
router.post('/addproductcategory', admin.adminaddproductcategorypost);

router.get('/editproductcategory/:id', admin.admineditproductcategoryget);
router.post('/editproductcategory/:id', admin.admineditproductcategorypost);

router.get('/deleteproductcategory/:id', admin.admindeleteproductcategory);

// Product Management
router.get('/products', admin.adminproductsget);

router.get('/addproducts', admin.adminaddproductsget);
router.post('/addproducts', multerImageUpload, admin.adminaddproductspost);

router.get('/editproducts/:id', admin.admineditproductsget);
router.post('/editproducts/:id', multerImageUpload, admin.admineditproductspost);

router.post('/removeImagefetchAPI', admin.adminremoveImagefetchAPI);

router.get('/producttogglelist/:id', admin.adminproductstogglelist)

router.get('/deleteproducts/:id', admin.admindeleteproductsget);

// also we could use ordercontroller here so that order.adminorderget; MVC vs CLEAN

// Order Management
router.get('/order', admin.adminorderget);
router.post('/updateorder/:id', admin.adminupdateorderpost);

module.exports = router;