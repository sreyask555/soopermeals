const admindatacollection = require('../models/adminDB');
const userdatacollection = require('../models/userDB');
const categorydatacollection = require('../models/categoryDB');

const controls = {
    adminloginget : (req, res)=>{
        res.render('adminlogin');
    },

    adminloginpost : async (req, res)=>{
        const {email, password} = req.body;
        try{
            const adminauthcheck = await admindatacollection.findOne({adminemail : email});
            if(email==adminauthcheck.adminemail && password==adminauthcheck.adminpassword){
                req.session.isAdminLoggedIn = true;
                console.log(req.session);
                res.redirect('/admin/home')
            }
            else{
                res.redirect('/admin/');
            }
        }
        catch(error){
            console.log('Admin login error, check catch side - DEVELOPER PART');
            console.error(error.stack);
            res.redirect('/admin/');
        }
    },

    adminhome : (req, res)=>{
        res.render('adminhome');
    },

    adminuserdetails : async (req, res)=>{
        try{
            const userdata = await userdatacollection.find();
            if(userdata){
                res.render('adminuserdetails', {userdata});
            }
            else{
                res.render('adminuserdetails', {userdata : []});
            }
        }
        catch(error){
            console.log('User data fetching error');
            console.error(error.stack);
        }
    },

    adminusertoggleblock : async(req, res)=>{
        // const blockstat = await userdatacollection.findById({_id : req.params.id}); not need to specifically mention _id again.
        const blockstat = await userdatacollection.findById(req.params.id);
        await userdatacollection.findByIdAndUpdate(req.params.id, {isBlocked : !blockstat.isBlocked});
        res.redirect('/admin/userdetails');
    },

    adminproductcategory : async (req, res)=>{
        try{
            const categorydata = await categorydatacollection.find();
            if(categorydata){
                res.render('admincategory', {categorydata, catinfosuccess : req.query.cat, catdelsuccess : req.query.catdel});
            }
            else{
                res.render('admincategory', {categorydata : []});
            }
        }
        catch(error){
            console.log('Category data fetching error');
            console.error(error.stack);
        }
    },

    adminaddproductcategoryget : (req, res)=>{
        res.render('adminaddcategory')
    },

    adminaddproductcategorypost : async (req, res)=>{
        try{
            const duplicate = await categorydatacollection.findOne({category : req.body.category});
            if(duplicate){
                res.render('adminaddcategory', {catinfofail : `Category ${req.body.category} already exists.`})
            }
            else{
                await categorydatacollection.insertMany([{category : req.body.category}]);
                res.redirect(`/admin/productcategory?cat=${req.body.category} added`);
            }
        }
        catch{
            console.log('Add product category error');
            console.error(error.stack);
        }
    },

    admineditproductcategoryget : async (req, res)=>{
        try{
            const categorydata = await categorydatacollection.findById(req.params.id);
            res.render('admineditcategory', {categorydata});
        }
        catch(err){
            console.log(err)
        }
    },

    admineditproductcategorypost : async (req, res)=>{
        try{
            await categorydatacollection.findByIdAndUpdate(req.params.id, {category : req.body.category});
            res.redirect(`/admin/productcategory?cat=${req.body.category} updated`);
        }
        catch{
            console.log('Update product category error');
            console.error(error.stack);
        }
    },

    admindeleteproductcategory : async (req, res)=>{
        const categorydata = await categorydatacollection.findById(req.params.id);
        await categorydatacollection.findByIdAndDelete(req.params.id);
        res.redirect(`/admin/productcategory?catdel=${categorydata.category}`);
    },

    adminaddproductsget : async (req, res)=>{
        // actually try catch block is not necessary.(Here just used assuming that no categories are existed)
        try{
            const categorydata = await categorydatacollection.find();
            res.render('adminaddproduct', {categorydata});
        }
        catch(err){
            console.error(err.stack);
        }
    },
}

module.exports = controls;