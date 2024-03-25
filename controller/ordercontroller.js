const userdatacollection = require('../models/userDB');
const fooddatacollection = require('../models/foodDB');
const addressdatacollection = require('../models/addressDB');
const cartdatacollection = require('../models/cartDB');
const orderdatacollection = require('../models/orderDB');

const controls = {
    orderget : async (req, res)=>{
        try{
            const userdata = await userdatacollection.findById(req.session.userID);
            const orderdata = await orderdatacollection.find({userid : req.session.userID});
            res.render('userorder', {userdata, orderdata})
        }
        catch(err){
            console.error(err);
            res.redirect('/login');
        }
    }
}

module.exports = controls;