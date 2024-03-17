const admindatacollection = require('../models/adminDB');
const userdatacollection = require('../models/userDB');
const categorydatacollection = require('../models/categoryDB');
const fooddatacollection = require('../models/foodDB');

const controls = {
    adminloginget : (req, res)=>{
        // req.session.adminAlerts = {};
        // console.log(req.session)
        res.render('adminlogin');
    },

    adminloginpost : async (req, res)=>{
        const {email, password} = req.body;
        try{
            const adminauthcheck = await admindatacollection.findOne({adminemail : email});
            if(email==adminauthcheck.adminemail && password==adminauthcheck.adminpassword){
                req.session.isAdminLoggedIn = true;
                // req.session.adminID = adminData._id;(authorization for multi-admin)
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
            console.error(err);
        }
    },

    admineditproductcategorypost : async (req, res)=>{
        try{
            const duplicate = await categorydatacollection.findOne({category : req.body.category});
            if(duplicate){
                const categorydata = await categorydatacollection.findById(req.params.id);
                res.render('admineditcategory', {categorydata, catinfofail : `Category ${req.body.category} already exists.`})
            }
            else{
                await categorydatacollection.findByIdAndUpdate(req.params.id, {category : req.body.category});
                res.redirect(`/admin/productcategory?cat=${req.body.category} updated`);
            }
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

    adminproductsget : async (req, res)=>{
        try{
            const fooddata = await fooddatacollection.find();
            res.render('adminproduct', {fooddata});
        }
        catch(err){
            console.error(err);
        }
    },

    adminaddproductsget : async (req, res)=>{
        // actually try catch block is not necessary.(Here just used assuming that no categories are existed)
        try{
            const categorydata = await categorydatacollection.find();
            res.render('adminaddproduct', {categorydata});
            //req.session.adminAlerts.foodadded = false; //instead of session.destroy()
            //console.log(req.session)
        }
        catch(err){
            console.error(err.stack);
        }
    },

    adminaddproductspost : async (req, res)=>{
        const fooddata = {
            foodname : req.body.foodname,
            foodcategory : req.body.foodcategory,
            foodprice : req.body.foodprice,
            // foodrating : req.body.foodrating,
            foodtype : req.body.foodtype,
            fooddescription : req.body.fooddescription,
            foodimage : req.files.map(file => file.path.substring(6))
        }
        console.log(fooddata);
        try{
            await fooddatacollection.insertMany([fooddata]);
            // creating adminAlert object to pass alerts (nullish coaliesing) {using this way inorder to handle session in future}
            //req.session.adminAlerts.foodadded = true;
            //console.log(req.session);
            res.redirect('/admin/products');
        }
        catch(error){
            console.log('Add product error');
            console.error(error.stack);
        }
    },

    admineditproductsget : async (req, res)=>{
        try{
            const fooddata = await fooddatacollection.findById(req.params.id);
            const categorydata = await categorydatacollection.find();
            res.render('admineditproduct', {fooddata, categorydata});
        }
        catch(err){
            console.error(err);
        }
    },

    admineditproductspost : async (req, res)=>{
        // Getting current food data from DB
        const currentdata = await fooddatacollection.findById(req.params.id);
        const fooddata = {
            foodname : req.body.foodname,
            foodcategory : req.body.foodcategory,
            foodprice : req.body.foodprice,
            // foodrating : req.body.foodrating,
            foodtype : req.body.foodtype,
            fooddescription : req.body.fooddescription,
            // concatenating old images with new images
            foodimage : [...currentdata.foodimage, ...req.files.map(file => file.path.substring(6))]
        }
        console.log(fooddata);
        try{
            await fooddatacollection.findByIdAndUpdate(req.params.id, fooddata);
            res.redirect('/admin/products');
        }
        catch{
            console.log('Update product error');
            console.error(error.stack);
        }
    },

    adminremoveImagefetchAPI : async (req, res)=>{
        const foodid = req.body.foodid;
        const foodindex = req.body.foodindex;
        console.log(foodid, foodindex);

        fooddata = await fooddatacollection.findById(foodid);
        fooddata.foodimage.splice(foodindex, 1)
        await fooddata.save();
        // try redirecting using /:id - note on ejs JS part
        // await fooddatacollection.findByIdAndUpdate(foodid, {foodimage : fooddata.foodimage.splice(foodindex, 1)}); error as splice returns removed items and that stores to DB
    },

    admindeleteproductsget : async (req, res)=>{
        await fooddatacollection.findByIdAndDelete(req.params.id);
        res.redirect('/admin/products');
    },
}

module.exports = controls;