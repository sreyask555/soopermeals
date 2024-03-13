const express = require('express');
const router = express.Router();

const admin = require('../controller/admincontroller');

// ADMIN ROUTES
// Login and Home
router.get('/', admin.adminloginget);

router.post('/home', admin.adminloginpost);
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
router.get('/products')

router.get('/addproducts', admin.adminaddproductsget);


module.exports = router;