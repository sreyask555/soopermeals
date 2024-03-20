const userdatacollection = require('../models/userDB');
const fooddatacollection = require('../models/foodDB');
const addressdatacollection = require('../models/addressDB');
const cartdatacollection = require('../models/cartDB');
const orderdatacollection = require('../models/orderDB');

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
    
    addtocartget : async (req, res)=>{
        try{
            const userdata = await userdatacollection.findById(req.session.userID);
            const fooddata = await fooddatacollection.findById(req.params.id);
            const existingcartdata = await cartdatacollection.findOne({userid : req.session.userID, foodid : fooddata._id});
            if(existingcartdata){
                existingcartdata.foodquantity += 1;
                await existingcartdata.save();
                res.redirect('/cart');
            }
            else{
                const newcartdata = new cartdatacollection({
                    userid : req.session.userID,
                    username : userdata.username,
                    foodid : fooddata._id,
                    foodname : fooddata.foodname,
                    foodprice : fooddata.foodprice,
                    foodquantity : 1,
                    foodimage : fooddata.foodimage[0]
                });
                console.log(newcartdata);
                await newcartdata.save();
                res.redirect('/cart');
            }
        }
        catch(err){
            console.error(err);
            res.redirect('/login');
        }
    },

    addquantityget : async (req, res)=>{
        const cartid = req.params.id;
        const cartdata = await cartdatacollection.findById(cartid);
        cartdata.foodquantity += 1;
        await cartdata.save();
        res.json({updateQuantity : cartdata.foodquantity});
    },

    removequantityget : async (req, res)=>{
        const cartid = req.params.id;
        const cartdata = await cartdatacollection.findById(cartid);
        if(cartdata.foodquantity>1){
            cartdata.foodquantity -= 1;
            await cartdata.save();
            res.json({updateQuantity : cartdata.foodquantity});
        }
        else{
            res.redirect('/cart');
        }
    },

    removefromcartget : async (req, res)=>{
        await cartdatacollection.findByIdAndDelete(req.params.id);
        res.redirect('/cart');
    },

    checkoutget : async (req, res)=>{
        const userdata = await userdatacollection.findById(req.session.userID);
        // finding all cart items by a user with userid(ObjectID)
        const cartdata = await cartdatacollection.find({userid : req.session.userID});
        const addressdata = await addressdatacollection.find({userid : req.session.userID});
        if(cartdata){
            let totalprice = 0;
            cartdata.forEach((data)=>{
                totalprice += data.foodquantity * data.foodprice;
            });
            const totalquantity = cartdata.reduce((total, item)=>total + item.foodquantity, 0);
            res.render('usercheckout', {userdata, cartdata, addressdata, totalquantity, totalprice});
        }
        else{
            res.redirect('/cart');
        }
    },

    checkoutpost : async (req, res)=>{
        const cartdata = await cartdatacollection.find({userid : req.session.userID});
        const currentdate = new Date();

        for(let cdata of cartdata){
            const neworder = new orderdatacollection({
                userid : cdata.userid,
                username : cdata.username,
                foodid : cdata.foodid,
                foodname : cdata.foodname,
                foodquantity : cdata.foodquantity,
                foodprice : cdata.foodprice,
                orderdate : currentdate,
                orderaddress : req.body.selectedAddress,
                orderpaymentmode : req.body.paymentMethod
            });
            console.log(neworder);
            await neworder.save();
        }

        await cartdatacollection.deleteMany({userid : req.session.userID});
        res.render('userorderconfirm');
    }
}

module.exports = controls;