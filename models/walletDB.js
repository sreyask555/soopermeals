const mongoose = require('./mongoDB');

const {Schema, ObjectId} = mongoose;

const walletDataSchema = new mongoose.Schema({
    userid : {
        type : ObjectId,
        required : true
    },
    walletamount : {
        type : Number,
        required : true,
        default : 0
    }
});

const walletdatacollection = new mongoose.model('walletdata', walletDataSchema);
module.exports = walletdatacollection;