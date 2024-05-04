const userdatacollection = require('../models/userDB');
const orderdatacollection = require('../models/orderDB');
const walletdatacollection = require('../models/walletDB');

const controls = {
    walletget : async (req, res)=>{
        try{
            const userdata = await userdatacollection.findById(req.session.userID);
            const walletdata = await walletdatacollection.find({userid : req.session.userID});
            const orderdata = await orderdatacollection.find({orderpaymentmode : 'WALLET', userid : req.session.userID}).sort({orderdate : -1});
            res.render('userwallet', {userdata, walletdata, orderdata});
        }
        catch(err){
            console.error(err);
        }
    },
}

module.exports = controls;