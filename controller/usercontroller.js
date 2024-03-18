const userdatacollection = require('../models/userDB');
const fooddatacollection = require('../models/foodDB');
const categorydatacollection = require('../models/categoryDB');

const nodemailer = require('nodemailer');

// Otp Mail Service
const transporter = nodemailer.createTransport({
    host : 'smtp.ethereal.email',
    port : 587,
    auth : {
        user: 'juwan.reinger@ethereal.email',
        pass: 'UnjM5zk67JvbUSXEn8'
    }
});

// Otp generation
let otpgen; // checking generated OTP same as OTP entered
let formData; // data collecting from signup page and saves data to DB if OTP is valid.
const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

const controls = {
    landing : async (req, res)=>{
        const fooddata = await fooddatacollection.find();
        res.render('landing', {fooddata});
    },

    userloginget : (req, res)=>{
        // For redirected requests, taking values from session stored keys, then rendering to pass values to ejs files.
        if(req.session.unauth){
            res.render('userlogin', {unauth : true});
            req.session.destroy();
            return;
        }
        else if(req.session.signed){
            res.render('userlogin', {signed : true});
            req.session.destroy();
            return;
        }
        else if(req.session.userblocked){
            res.render('userlogin', {userblocked : true});
            req.session.destroy();
            return;
        }
        res.render('userlogin');
    },

    userlogoutget : (req, res)=>{
        req.session.destroy();
        res.redirect('/login');
    },

    userloginpost : async (req, res)=>{
        const {email, password} = req.body;
        try{
            const userData = await userdatacollection.findOne({useremail : email});
            if(email==userData.useremail && password==userData.userpassword){
                req.session.isUserLoggedIn = true;
                req.session.userID = userData._id;
                console.log(req.session);
                res.redirect('/home');
            }
            else{
                console.log('Auth Failed');
                console.log(req.body);
                req.session.unauth = true;
                res.redirect('/login');
            }   
        }
        catch{
            console.log('Auth Failed');
            console.log(req.body);
            req.session.unauth = true;
            res.redirect('/login');
        }
    },

    usersignupget : (req, res)=>{
        if(req.session.incorrectotp){
            res.render('usersignup', {incorrectotp : req.session.incorrectotp, formData : req.session.formData});
            req.session.destroy();
            return;
        }
        res.render('usersignup');
    },

    // userfetchapi : async (req, res) => {
    //     res.json(req.body);
    // },

    userfetchapi : async (req, res) => {
        formData = req.body;
        console.log('Form Data : ', formData);

        // check duplicate user
        try{
            const duplicatecheck = await userdatacollection.findOne({useremail : formData.email});
            if(duplicatecheck){
                // req.session.duplicate = true;
                // console.log(req.session);
                res.redirect('/login');
                // res.render('userlogin');
            }
            else{
                // OTP generation
                otpgen = generateOtp();
                console.log('OTP gen : '+ otpgen);
                const mailOptions = {
                from: "soopermeals-admin@gmail.com",
                to: formData.email,
                subject: "OTP Verification",
                text: `Your OTP is: ${otpgen}. Please don't share your OTP with others`,
                };

                transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(`OTP error, Reason : ${error}`);
                    res.json(formData);
                }
                else {
                    console.log("OTP sent: " + info.response);
                    res.json(formData);
                }
                });
            }
        }
        catch{
                console.log('Some error happened at catch block.. Please look into catch block side - DEVELOPER PART')
        }
    },

    userotppost : async (req, res)=>{
        if(otpgen == req.body.otp){
            const usersignupdata = {
                username : formData.name,
                usernumber : formData.number,
                useremail : formData.email,
                userpassword : formData.password
            }
            await userdatacollection.insertMany([usersignupdata]);
            req.session.signed = true;
            res.redirect('/login');
        }
        else{
            req.session.incorrectotp = true;
            req.session.formData = formData;
            res.redirect('/signup');
            // res.render('usersignup',{message : 'Incorrect OTP'})
        }
    },
  
    userhome : async (req, res)=>{
        const fooddata = await fooddatacollection.find();
        const categorydata = await categorydatacollection.find();
        const userdata = await userdatacollection.findOne({_id : req.session.userID});
        res.render('userhome', {fooddata, userdata, categorydata});
    },

    usersearchFoodfetchAPI : async (req, res)=>{
        const searchQuery = req.query.search;
        const regexPattern = new RegExp(`^${searchQuery}`, 'i');
        const filteredFood = await fooddatacollection.find({foodname : {$regex: regexPattern}});
        res.json(filteredFood);
    },

    userfilterFoodfetchAPI : async (req, res)=>{
        const searchQuery = req.query.search;
        const regexPattern = new RegExp(`^${searchQuery}`, 'i');
        const filteredFood = await fooddatacollection.find({foodtype : {$regex: regexPattern}});
        res.json(filteredFood);
    },

    usersortFoodfetchAPI : async (req, res)=>{
        const searchQuery = req.query.search;
        const regexPattern = new RegExp(`^${searchQuery}`, 'i');
        const filteredFood = await fooddatacollection.find({foodcategory : {$regex: regexPattern}});
        res.json(filteredFood);
    },

    usergetproductinfo : async (req, res)=>{
        const fooddata = await fooddatacollection.findById(req.params.id);
        res.render('userproductinfo', {fooddata})
    }
}

module.exports = controls;