const express = require('express');
const router = express.Router();

const admin = require('../controller/admincontroller');

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

// ADMIN ROUTES
// Login
router.get('/', admin.adminloginget);
router.post('/', admin.adminloginpost);

// Home
// can use a middleware for admin auth check if need
router.get('/home', admin.adminhome);

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

router.get('/deleteproducts/:id', admin.admindeleteproductsget);

module.exports = router;