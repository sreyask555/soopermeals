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
        const existingcartdata = await cartdatacollection.find({userid : req.session.userID});
        const addressdata = await addressdatacollection.find({userid : req.session.userID});

        let totalprice = 0;
        // forEach loop does not wait for asynchronous operations to complete, so by the time you try to access totalprice, the asynchronous operations inside the loop may not have finished, resulting in an incorrect value.
        const cartpromises = existingcartdata.map(async (cdata)=>{
            const fooddata = await fooddatacollection.findById(cdata.foodid);
            if(fooddata.isListed && fooddata.foodstock>cdata.foodquantity){
                totalprice += cdata.foodquantity * cdata.foodprice;
            }
            else{
                await cartdatacollection.findByIdAndDelete(cdata._id);
            }
        });
        // Wait for all promises to resolve
        await Promise.all(cartpromises);

        // fetching cartdata again for re-rendering on checkoutpage
        const cartdata = await cartdatacollection.find({userid : req.session.userID});
        res.render('usercheckout', {userdata, cartdata, addressdata, totalprice});

        // let totalprice = 0;
        // cartdata.forEach((cdata)=>{
        //     totalprice += cdata.foodquantity * cdata.foodprice;
        // });
        // const totalquantity = cartdata.reduce((total, item)=>total + item.foodquantity, 0);
        // res.render('usercheckout', {userdata, cartdata, addressdata, totalquantity, totalprice});
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
            // complex query and could be used behalf of await..save() in all.
            await fooddatacollection.findByIdAndUpdate(cdata.foodid, {$inc:{foodstock : -cdata.foodquantity}})
        }

        await cartdatacollection.deleteMany({userid : req.session.userID});
        res.render('userorderconfirm');
    }
}

module.exports = controls;