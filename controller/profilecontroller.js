const userdatacollection = require('../models/userDB');
const fooddatacollection = require('../models/foodDB');
const addressdatacollection = require('../models/addressDB');

const controls = {
    profileget : async (req, res)=>{
        try{
            const userdata = await userdatacollection.findById(req.session.userID);
            res.render('userprofile', {userdata, passwordchanged : null});
        }
        catch(err){
            console.error(err);
            res.redirect('/login');
        }
    },

    editprofilenamepost : async (req, res)=>{
        try{
            await userdatacollection.findByIdAndUpdate(req.params.id, {username : req.body.value});
            res.redirect('/profile');
        }
        catch(err){
            console.error(err);
            res.redirect('/login');
        }
    },

    editprofilenumberpost : async (req, res)=>{
        try{
            await userdatacollection.findByIdAndUpdate(req.params.id, {usernumber : req.body.value});
            res.redirect('/profile');
        }
        catch(err){
            console.error(err);
            res.redirect('/login');
        }
    },

    editprofilepasswordpost : async (req, res)=>{
        try{
            const userdata = await userdatacollection.findById(req.params.id);
            const {currentpassword, newpassword} = req.body;
            if(userdata.userpassword == currentpassword){
                await userdatacollection.findByIdAndUpdate(req.params.id, {userpassword : newpassword});
                res.render('userprofile', {userdata, passwordchanged : true});
            }
            else{
                res.render('userprofile', {userdata, passwordchanged : false});
            }
            // res.redirect('/profile');
        }
        catch(err){
            console.error(err);
            res.redirect('/login');
        }
    },

    addressget : async (req, res)=>{
        try{
            const userdata = await userdatacollection.findById(req.session.userID);
            // finding all addresses for a user with userid(ObjectID)
            const addressdata = await addressdatacollection.find({userid : req.session.userID});
            res.render('useraddress', {addressdata, userdata});
        }
        catch(err){
            console.error(err);
            res.redirect('/login');
        }
    },

    addaddressget : async (req, res)=>{
        try{
            const userdata = await userdatacollection.findById(req.session.userID);
            res.render('useraddaddress', {userdata});
        }
        catch(err){
            console.error(err);
            res.redirect('/login');
        }
    },

    addaddresspost : async (req, res)=>{
        try{
            const {firstname, lastname, housename, city, pincode, mobile} = req.body;
            const newAddress = {
                userid : req.session.userID,
                firstname : firstname,
                lastname : lastname,
                housename : housename,
                city : city,
                pincode : pincode,
                mobile : mobile
            }
            await addressdatacollection.insertMany([newAddress]);
            res.redirect('/profile/address');
        }
        catch(err){
            console.error(err);
            res.redirect('/login');
        }
    },

    editaddressget : async (req, res)=>{
        try{
            const userdata = await userdatacollection.findById(req.session.userID);
            const addressdata = await addressdatacollection.findById(req.params.id);
            res.render('usereditaddress', {userdata, addressdata});
        }
        catch(err){
            console.error(err);
            res.redirect('/login');
        }
    },

    editaddresspost : async (req, res)=>{
        try{
            const {firstname, lastname, housename, city, pincode, mobile} = req.body;
            const editedAddress = {
                firstname : firstname,
                lastname : lastname,
                housename : housename,
                city : city,
                pincode : pincode,
                mobile : mobile
            }
            await addressdatacollection.findByIdAndUpdate(req.params.id, editedAddress);
            res.redirect('/profile/address');
        }
        catch(err){
            console.error(err);
            res.redirect('/login');
        }
    },

    deleteaddressget : async (req, res)=>{
        try{
            await addressdatacollection.findByIdAndDelete(req.params.id);
            res.redirect('/profile/address');
        }
        catch(err){
            console.error(err);
            res.redirect('/login');
        }
    },
}

module.exports = controls;