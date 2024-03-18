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
}

module.exports = controls;