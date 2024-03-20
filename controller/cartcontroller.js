const userdatacollection = require('../models/userDB');
const fooddatacollection = require('../models/foodDB');
const addressdatacollection = require('../models/addressDB');
const cartdatacollection = require('../models/cartDB');

const controls = {
    cartget : async (req, res)=>{
        try{
            const userdata = await userdatacollection.findById(req.session.userID);
            // finding all cart items for a user with userid(ObjectID)
            const cartdata = await cartdatacollection.find({userid : req.session.userID});
            res.render('usercart', {cartdata, userdata});
        }
        catch(err){
            console.error(err);
            res.redirect('/login');
        }
    },
}

module.exports = controls;