const mongoose = require('./mongoDB');

const {Schema, ObjectId} = mongoose;

// doc-schemas
const OrderDataSchema = new mongoose.Schema({
    userid : {
        type : ObjectId,
        required : true
    },
    username : {
        type : String,
        required : true
    },
    foodid : {
        type : ObjectId,
        required : true
    },
    foodname : {
        type : String,
        required : true
    },
    foodquantity : {
        type : String,
        required : true
    },
    foodprice : {
        type : String,
        required : true
    },
    orderstatus : {
        type : String,
        default : 'Pending',
        required : true
    },
    orderdate : {
        type : Date,
        required : true
    },
    orderaddress : {
        type : ObjectId,
        required : true
    },
    orderpaymentmode : {
        type : String,
        required : true
    },
});

const orderdatacollection = new mongoose.model('orderdata', OrderDataSchema);

module.exports = orderdatacollection;