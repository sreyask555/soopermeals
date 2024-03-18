const userdatacollection = require('../models/userDB');
const fooddatacollection = require('../models/foodDB');

const controls = {
    profileget : async (req, res)=>{
        try{
            const userdata = await userdatacollection.findById(req.session.userID);
            res.render('userprofile', {userdata});
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
        }
    },

    editprofilenumberpost : async (req, res)=>{
        try{
            await userdatacollection.findByIdAndUpdate(req.params.id, {usernumber : req.body.value});
            res.redirect('/profile');
        }
        catch(err){
            console.error(err);
        }
    },
}

module.exports = controls;