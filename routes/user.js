const express = require('express');
const router = express.Router();

const user = require('../controller/usercontroller');
const userdatacollection = require('../models/userDB');

// Middleware for user auth and block status
const checkUserIsBlocked =  async (req, res, next) => {
    const userData = await userdatacollection.findOne({_id : req.session.userID});
    try{
        if(!userData.isBlocked){
            next();
        }
        else{
            req.session.userblocked = true;
            res.redirect('/login');
        }
    }
    catch{
        // req.session.destroy();
        res.redirect('/login');
    }
}

// Landing Page
router.get('/', user.landing);

// Login and Signup
router.get('/login', user.userloginget);
router.post('/login', user.userloginpost);
router.get('/signup', user.usersignupget);

// Forgot Password (Mail validation, OTP validation, Password change event)
router.post('/forgotpassword', user.userforgotpasswordpost);
router.post('/forgotpasswordotp', user.userforgotpasswordotppost);
router.post('/forgotpasswordchange', user.userforgotpasswordchangepost);

// Logout
router.get('/logout', user.userlogoutget)

// signup-post and JS-fetch(userotp.js) for otp-get fn.
router.post('/fetchAPI', user.userfetchapi);

// otp-validation
router.post('/otp',user.userotppost);

// Home
router.get('/home', checkUserIsBlocked, user.userhome);

// search-apis
router.get('/searchFoodfetchAPI', user.usersearchFoodfetchAPI);
router.get('/filterFoodfetchAPI', user.userfilterFoodfetchAPI);
router.get('/sortFoodfetchAPI', user.usersortFoodfetchAPI);

// Product Details
router.get('/productinfo/:id', checkUserIsBlocked, user.usergetproductinfo);

module.exports = router;