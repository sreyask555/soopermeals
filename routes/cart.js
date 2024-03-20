const express = require('express');
const router = express.Router();

const cart = require('../controller/cartcontroller');
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

// Cart Management
router.get('/', checkUserIsBlocked, cart.cartget);

router.get('/addtocart/:id', checkUserIsBlocked, cart.addtocartget);

router.get('/addquantity/:id', checkUserIsBlocked, cart.addquantityget);
router.get('/removequantity/:id', checkUserIsBlocked, cart.removequantityget);

router.get('/removefromcart/:id', checkUserIsBlocked, cart.removefromcartget);

router.get('/checkout', checkUserIsBlocked, cart.checkoutget);
router.post('/checkout', cart.checkoutpost);

module.exports = router;