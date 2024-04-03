const mongoose = require('./mongoDB');

const {Schema, ObjectId} = mongoose;

const wishlistDataSchema = new mongoose.Schema({
    userid : {
        type : ObjectId,
        required : true
    },
    foodid : {
        type : [ObjectId],
        required : true
    }
});

const wishlistdatacollection = new mongoose.model('wishlistdata', wishlistDataSchema);
module.exports = wishlistdatacollection;