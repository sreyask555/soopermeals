const express = require('express');
const router = express.Router();

const profile = require('../controller/profilecontroller');
const userdatacollection = require('../models/userDB');

// Middleware for user auth and block status
const checkUserIsBlocked =  async (req, res, next) => {
    const userData = await userdatacollection.findById(req.session.userID);
    try{
        if(!userData.isBlocked){
            next();
        }
        else{
            req.session.userblocked = true;
            res.redirect('/login');
        }
    }
    catch(err){
        // req.session.destroy();
        console.error(err);
        res.redirect('/login');
    }
}

// Show Profile
router.get('/', profile.profileget);

module.exports = router;