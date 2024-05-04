const express = require('express');
const router = express.Router();

const checkout = require('../controller/checkoutcontroller');
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

// Checkout Management
router.get('/', checkUserIsBlocked, checkout.checkoutget);
router.post('/', checkout.checkoutpost);

module.exports = router;