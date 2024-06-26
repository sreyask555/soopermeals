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

// Profile Management
router.get('/', checkUserIsBlocked, profile.profileget);

router.post('/editprofilename/:id', profile.editprofilenamepost);
router.post('/editprofilenumber/:id', profile.editprofilenumberpost);
router.post('/editprofilepassword/:id', profile.editprofilepasswordpost);

router.get('/address',checkUserIsBlocked, profile.addressget);

router.get('/addaddress',checkUserIsBlocked, profile.addaddressget);
router.post('/addaddress', profile.addaddresspost);

router.get('/editaddress/:id', checkUserIsBlocked, profile.editaddressget);
router.post('/editaddress/:id', profile.editaddresspost);

router.get('/deleteaddress/:id', profile.deleteaddressget);

module.exports = router;