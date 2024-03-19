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
    productid : {
        type : ObjectId,
        required : true
    },
    productname : {
        type : String,
        required : true
    },
    productprice : {
        type : String,
        required : true
    },
    productquantity : {
        type : String,
        required : true
    },
    productimage : {
        type : [String],
        required : true
    }
});

const cartdatacollection = new mongoose.model('cartdata', CartDataSchema);

module.exports = cartdatacollection;