const userdatacollection = require('../models/userDB');
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
let otpgen;
let formData;
const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

const controls = {
    landing : (req, res)=>{
        res.render('landing');
    },

    userloginget : (req, res)=>{
        if(req.session.duplicateuser){
            res.render('userlogin', {duplicate : true});
            req.session.destroy();
            return;
        }
        else if(req.session.unauth){
            res.render('userlogin', {unauth : true});
            req.session.destroy();
            return;
        }
        else if(req.session.signed){
            res.render('userlogin', {signed : true});
            req.session.destroy();
            return;
        }
        res.render('userlogin');
    },

    userloginpost : async (req, res)=>{
        const {email, password} = req.body;
        try{
            const userauthcheck = await userdatacollection.findOne({useremail : email});
            if(email==userauthcheck.useremail && password==userauthcheck.userpassword){
                req.session.isUserLoggedIn = true;
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
        res.render('usersignup');
    },

    usersignuppost : async (req, res)=>{
        formData = req.body;
        console.log('Form Data : ', formData)

        // check duplicate user
        try{
            const duplicatecheck = await userdatacollection.findOne({useremail : formData.email});
            if(duplicatecheck){
                req.session.duplicateuser = true;
                res.redirect('/login');
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
                    console.log(error + ' OTP error');
                    res.render('usersignup', { message: 'Failed to send the OTP' });
                }
                else {
                    console.log("OTP sent: " + info.response);
                    res.render('userotp', { message: 'OTP sent successfully, check your mail' });
                }
                });
            }
        }
        catch{
                // OTP generation   
                console.log('Some error happende at catch block.. Please look into catch block side - DEVELOPER PART')
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
            res.render('userotp',{message : 'Incorrect OTP'})
        }
    },
  
    userhome : (req, res)=>{
        res.render('userhome');
    },
}

module.exports = controls;