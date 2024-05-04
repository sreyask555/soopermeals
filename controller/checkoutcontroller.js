const userdatacollection = require('../models/userDB');
const fooddatacollection = require('../models/foodDB');
const addressdatacollection = require('../models/addressDB');
const cartdatacollection = require('../models/cartDB');
const orderdatacollection = require('../models/orderDB');
const walletdatacollection = require('../models/walletDB');

const controls = {
    checkoutget : async (req, res)=>{
        const userdata = await userdatacollection.findById(req.session.userID);
        // finding all cart items by a user with userid(ObjectID)
        const existingcartdata = await cartdatacollection.find({userid : req.session.userID});
        const addressdata = await addressdatacollection.find({userid : req.session.userID});

        let totalprice = 0;
        // forEach loop does not wait for asynchronous operations to complete, so by the time you try to access totalprice, the asynchronous operations inside the loop may not have finished, resulting in an incorrect value.
        const cartpromises = existingcartdata.map(async (cdata)=>{
            const fooddata = await fooddatacollection.findById(cdata.foodid);
            if(fooddata.isListed && fooddata.foodstock>=cdata.foodquantity){
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
        
        if(req.session.nowallet){
            req.session.nowallet = null;
            res.render('usercheckout', {userdata, cartdata, addressdata, totalprice, nowallet : true});
            return;
        }
        res.render('usercheckout', {userdata, cartdata, addressdata, totalprice, nowallet : null});

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

        const createOrder = async ()=>{
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

        if(req.body.paymentMethod == 'COD'){
            createOrder();
        }

        else if(req.body.paymentMethod == 'WALLET'){
            try{
                // if no wallet is created for the userID, create one
                const existingwalletdata = await walletdatacollection.findOne({userid : req.session.userID});
                if(existingwalletdata == null){
                    const new_walletdata = new walletdatacollection({
                        userid : req.session.userID
                    });
                    await new_walletdata.save();
                }

                const walletdata = await walletdatacollection.findOne({userid : req.session.userID});
                const walletid = walletdata._id;
                let totalprice = 0;
                for(let cdata of cartdata){
                    totalprice += cdata.foodquantity * cdata.foodprice;
                }
                if(walletdata.walletamount >= totalprice+20){
                    await walletdatacollection.findByIdAndUpdate(walletid, {$inc:{walletamount : -(totalprice+20)}})
                    createOrder();
                }
                else{
                    req.session.nowallet = true;
                    res.redirect('/checkout');
                }
            }
            catch(err){
                console.error(err);
            }
        }

        else if(req.body.paymentMethod == 'UPI'){
            console.log('UPI')
        }
    }
}

module.exports = controls;