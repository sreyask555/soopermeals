const userdatacollection = require('../models/userDB');
const fooddatacollection = require('../models/foodDB');
const categorydatacollection = require('../models/categoryDB');

const nodemailer = require('nodemailer');

// Otp Mail Service
const transporter = nodemailer.createTransport({
    host : process.env.SMTP_HOST,
    port : process.env.SMTP_PORT,
    //secure : true, // for gmail smtp (port 465)
    //secure : false, // for other smtp servers (port 587, 25 etc.) It upgrades to STARTTLS automatically if server supports.
    secure : process.env.SMTP_PORT==465 ? true : false,
    auth : {
        user: process.env.SMTP_USERID,
        pass: process.env.SMTP_PASSWORD
    }
});

// Otp generation
let otpgen; // checking generated OTP same as OTP entered
let formData; // data collecting from forgotpass page and update data to DB if OTP is valid.
let forgotOtpData; // data collecting from forgotpass, may implement in future. Currently both usersignup and forgotpassword using same formData varibale at diff times.
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
        else if(req.session.mailvalidated){
            res.render('userlogin', {mailvalidated : true, formData : req.session.formData});
            req.session.destroy();
            return;
        }
        else if(req.session.incorrectotp){
            res.render('userlogin', {incorrectotp : true, formData : req.session.formData});
            req.session.destroy();
            return;
        }
        else if(req.session.otpvalidated){
            res.render('userlogin', {otpvalidated : true, formData : req.session.formData});
            req.session.destroy();
            return;
        }
        else if(req.session.passwordchanged){
            res.render('userlogin', {passwordchanged : true});
            req.session.destroy();
            return;
        }
        res.render('userlogin');
    },

    // forgot password - mail validation
    userforgotpasswordpost : async (req, res)=>{
        try{
            formData = req.body;
            console.log('mail validation : ', formData);
            const userdata = await userdatacollection.findOne({useremail : req.body.email});

            if(req.body.email == userdata.useremail){
                // OTP generation
                otpgen = generateOtp();
                console.log('OTP gen pwd-change : '+ otpgen);
                const mailOptions = {
                from: process.env.SMTP_MAILFROM,
                to: req.body.email,
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

                req.session.mailvalidated = true;
                req.session.formData = req.body;
                res.redirect('/login');
            }
            else{
                res.redirect('/login');
            }
        }
        catch(err){
            // invalid useremail
            console.error(err);
            req.session.unauth = true;
            res.redirect('/login');
        }
    },

    // OTP entering part
    userforgotpasswordotppost : async (req, res)=>{
        // correct OTP
        if(req.body.otp == otpgen){
            req.session.otpvalidated = true;
            req.session.formData = req.body;
            res.redirect('/login');
        }
        // resend OTP
        else if(req.body.otp == 'OTPRESEND'){
            formData = req.body;
            console.log('resend OTP : ', formData);

            // OTP generation
            otpgen = generateOtp();
            console.log('OTP gen pwd-change : '+ otpgen);
            const mailOptions = {
            from: process.env.SMTP_MAILFROM,
            to: req.body.email,
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

            req.session.mailvalidated = true;
            req.session.formData = req.body;
            res.redirect('/login');
        }
        // wrong OTP
        else{
            req.session.incorrectotp = true;
            req.session.formData = req.body;
            res.redirect('/login'); 
        }
    },

    // forgot password changing event
    userforgotpasswordchangepost : async (req, res)=>{
        formData = req.body;
        await userdatacollection.findOneAndUpdate({useremail : formData.email}, {userpassword : formData.password});
        req.session.passwordchanged = true;
        res.redirect('/login');
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
            res.render('usersignup', {otp : 'incorrect', formData : req.session.formData});
            req.session.destroy();
            return;
        }
        else if(req.session.resendotp){
            res.render('usersignup', {otp : 'resend', formData : req.session.formData});
            req.session.destroy();
            return;
        }
        res.render('usersignup');
    },

    userfetchapi : async (req, res) => {
        formData = req.body;
        console.log('Form Data : ', formData);

        // check duplicate user
        try{
            const duplicatecheck = await userdatacollection.findOne({useremail : formData.email});
            if(duplicatecheck){
                // req.session.duplicate = true;
                // console.log(req.session);
                res.redirect('/login'); //fetchAPI -> .then(res.redirected), 
                // res.render('userlogin');
            }
            else{
                // OTP generation
                otpgen = generateOtp();
                console.log('OTP gen : '+ otpgen);
                const mailOptions = {
                from: process.env.SMTP_MAILFROM,
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
        console.log(req.body)
        if(req.body.otp == otpgen){
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
        else if(req.body.otp == 'OTPRESEND'){
            req.session.resendotp = true;
            // For autofilling on next immediate redirect
            req.session.formData = formData;
            res.redirect('/signup');
        }
        else{
            req.session.incorrectotp = true;
            // For autofilling on next immediate redirect
            req.session.formData = formData;
            res.redirect('/signup');
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