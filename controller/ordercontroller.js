const userdatacollection = require('../models/userDB');
const fooddatacollection = require('../models/foodDB');
const addressdatacollection = require('../models/addressDB');
const cartdatacollection = require('../models/cartDB');
const orderdatacollection = require('../models/orderDB');

const mongoose = require('mongoose')
const {Schema, ObjectId} = mongoose;

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');

// SSR - server side rendering ?
const ejsRender = async (template, DBdata)=>{
    const filePath = path.join(__dirname, '../views/userview', `${template}.ejs`);
    const html = fs.readFileSync(filePath, 'utf-8');
    return ejs.compile(html)(DBdata);
}

const controls = {
    orderget : async (req, res)=>{
        try{
            const userdata = await userdatacollection.findById(req.session.userID);
            const orderdata = await orderdatacollection.find({userid : req.session.userID});
            // const distinctorderdates = await orderdatacollection.find({userid : req.session.userID}).distinct('orderdate'); //sort and distinct doesnt work simultaneously. So needs aggregation pipe.
            const distinctorderdates = await orderdatacollection.aggregate([{$match : {userid : new mongoose.Types.ObjectId(`${req.session.userID}`)}}, {$group : {_id : '$orderdate'}}, {$sort : {_id : -1}}, {$project : {_id : 0, orderdate : '$_id'}}]);
            res.render('userorder', {userdata, orderdata, distinctorderdates});
        }
        catch(err){
            console.error(err);
            res.redirect('/login');
        }
    },

    orderdetailsget : async (req, res)=>{
        const userdata = await userdatacollection.findById(req.session.userID);
        const orderdata = await orderdatacollection.find({orderdate : req.params.id});
        const addressdata = await addressdatacollection.findById(orderdata[0].orderaddress);
        res.render('userorderdetails', {userdata, orderdata, addressdata});
    },

    cancelorderget : async (req, res)=>{
        // wallet should work ifonlyif user is cancelling order
        await orderdatacollection.findByIdAndUpdate(req.params.id, {orderstatus : 'Cancelled'});
        res.redirect('/order');
    },

    invoiceget : async (req, res)=>{
        try{
            const orderdata = await orderdatacollection.find({orderdate : req.params.id});
            const addressdata = await addressdatacollection.findById(orderdata[0].orderaddress);
            // res.render('userinvoice', {orderdata, addressdata});

            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            // to create pdf from web-renders
            // localhost://order/invoice/12344556
            // await page.goto(`${req.protocol}://${req.get('host')}`+'/order/invoice'+`/${req.params.id}`, {
            //     waitUntil : 'networkidle2'
            // });

            // rendering ejs template with DB data
            const content = await ejsRender('userinvoice', {orderdata, addressdata})
            await page.setContent(content);

            // generating pdf data
            const pdfGen = await page.pdf({
                path : `${path.join(__dirname, '../assets/invoice', `OrderID_${req.params.id}.pdf`)}`,
                format : 'A4',
                printBackground : true
            })

            console.log('PDF GENERATED');
            await browser.close();

            // pdf-stored path
            const pdfURL = path.join(__dirname, '../assets/invoice', `OrderID_${req.params.id}.pdf`);

            // View PDF - slow, idk
            // res.set({
            //     'Content-Type' : 'application/pdf',
            //     'Content-Length' : pdfGen.length
            // })
            // res.sendFile(pdfURL);

            // Download PDF - fast(maybe same system)
            res.download(pdfURL, (err)=>{
                if(err){
                    console.error(err);
                }
            })
        }
        catch(err){
            console.error(err);
        }
    },
}

module.exports = controls;