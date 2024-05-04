const mongoose = require('./mongoDB');

const {Schema, ObjectId} = mongoose;

// doc-schemas
const CartDataSchema = new mongoose.Schema({
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
    foodprice : {
        type : String,
        required : true
    },
    foodquantity : {
        type : Number,
        required : true
    },
    foodimage : {
        type : [String],
        required : true
    }
});

const cartdatacollection = new mongoose.model('cartdata', CartDataSchema);

module.exports = cartdatacollection;