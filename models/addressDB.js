const mongoose = require('./mongoDB');

const {Schema, ObjectId} = mongoose;

// doc-schemas
const AddressDataSchema = new mongoose.Schema({
    userid : {
        type : ObjectId,
        required : true
    },
    firstname : {
        type : String,
        required : true
    },
    lastname : {
        type : String,
        required : true
    },
    housename : {
        type : String,
        required : true
    },
    city : {
        type : String,
        required : true
    },
    pincode : {
        type : String,
        required : true
    },
    mobile : {
        type : String,
        required : true
    },
});

const addressdatacollection = new mongoose.model('addressdata', AddressDataSchema);

module.exports = addressdatacollection;