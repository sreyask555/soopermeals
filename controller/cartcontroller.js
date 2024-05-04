const userdatacollection = require('../models/userDB');
const fooddatacollection = require('../models/foodDB');
const addressdatacollection = require('../models/addressDB');
const cartdatacollection = require('../models/cartDB');
const orderdatacollection = require('../models/orderDB');
const wishlistdatacollection = require('../models/wishlistDB');

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

    wishlistget : async (req, res)=>{
        try{
            const userdata = await userdatacollection.findById(req.session.userID);
            const wishlistdata = await wishlistdatacollection.find({userid : req.session.userID});
            const fooddata = await fooddatacollection.find();
            res.render('userwishlist', {userdata, wishlistdata, fooddata});
        }
        catch(err){
            console.error(err);
        }
    },

    addtowishlistget : async (req, res)=>{
        try{
            const wishlistdata = await wishlistdatacollection.findOne({userid : req.session.userID});
            // if no wishlist is created for the userID, (OR we can create dummy wishlist at user signup. Then, only an update is needed, do check memory alloc.)
            if(wishlistdata == null){
                const new_wishlistdata = new wishlistdatacollection({
                    userid : req.session.userID,
                    foodid : req.params.id
                });
                await new_wishlistdata.save();
            }
            // already in wishlist
            else if(wishlistdata.foodid.includes(req.params.id)){
                console.log('already wishlisted');
            }
            // if not wishlisted, adding to existing wishlist
            else{
                wishlistdata.foodid.push(req.params.id);
                await wishlistdata.save();
            }
            res.redirect('/cart/wishlist');
        }
        catch(err){
            console.error(err);
        }
    },

    removefromwishlistget : async (req, res)=>{
        const wishlistdata = await wishlistdatacollection.findOne({userid : req.session.userID});
        wishlistdata.foodid.splice(wishlistdata.foodid.indexOf(req.params.id), 1);
        await wishlistdata.save();
        res.redirect('/cart/wishlist');
    },
}

module.exports = controls;