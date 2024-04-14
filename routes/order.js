const express = require('express');
const router = express.Router();

const order = require('../controller/ordercontroller');
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

// Order Management
router.get('/', checkUserIsBlocked, order.orderget)

router.get('/orderdetails/:id', checkUserIsBlocked, order.orderdetailsget);

router.get('/cancelorder/:id', checkUserIsBlocked, order.cancelorderget);

module.exports = router;