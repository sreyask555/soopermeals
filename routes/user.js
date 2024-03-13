const express = require('express');
const router = express.Router();

const user = require('../controller/usercontroller');

// Landing Page
router.get('/', user.landing);

// Login and Signup
router.get('/login', user.userloginget);
router.post('/login', user.userloginpost);
router.get('/signup', user.usersignupget);
router.post('/signup', user.usersignuppost);

// otp-validation
// router.get('/otp', user.userotpget);
router.post('/otp',user.userotppost);

// Home
router.get('/home', user.userhome);

module.exports = router;