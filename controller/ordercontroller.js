const userdatacollection = require('../models/userDB');
const fooddatacollection = require('../models/foodDB');
const addressdatacollection = require('../models/addressDB');
const cartdatacollection = require('../models/cartDB');
const orderdatacollection = require('../models/orderDB');

const mongoose = require('mongoose')
const {Schema, ObjectId} = mongoose;

const controls = {
    orderget : async (req, res)=>{
        try{
            const userdata = await userdatacollection.findById(req.session.userID);
            const orderdata = await orderdatacollection.find({userid : req.session.userID});
            // const distinctorderdates = await orderdatacollection.find({userid : req.session.userID}).distinct('orderdate'); //sort and distinct doesnt work simultaneously. So needs aggregation pipe.
            const distinctorderdates = await orderdatacollection.aggregate([{$match : {userid : new mongoose.Types.ObjectId(`${req.session.userID}`)}}, {$group : {_id : '$orderdate'}}, {$sort : {_id : -1}}, {$project : {_id : 0, orderdate : '$_id'}}]);
            res.render('userorder', {userdata, orderdata, distinctorderdates});
        }
        catch(err){
            console.error(err);
            res.redirect('/login');
        }
    },

    orderdetailsget : async (req, res)=>{
        const userdata = await userdatacollection.findById(req.session.userID);
        const orderdata = await orderdatacollection.find({orderdate : req.params.id});
        const addressdata = await addressdatacollection.findById(orderdata[0].orderaddress);
        res.render('userorderdetails', {userdata, orderdata, addressdata});
    },

    cancelorderget : async (req, res)=>{
        // wallet should work ifonlyif user is cancelling order
        await orderdatacollection.findByIdAndUpdate(req.params.id, {orderstatus : 'Cancelled'});
        res.redirect('/order');
    },
}

module.exports = controls;