const mongoose = require('./mongoDB');

// doc-schemas
const FoodDataSchema = new mongoose.Schema({
    foodname : {
        type : String,
        requied : true
    },
    foodcategory : {
        type : String,
        required : true
    },
    foodprice : {
        type : Number,
        required : true
    },
    // foodrating : {
    //     type : Number,
    //     required : true
    // },
    foodtype : {
        type : String,
        required : true
    },
    fooddescription : {
        type : String,
        required : true
    },
    foodimage : {
        type : [String],
        required : true
    },
    isListed : {
        type : Boolean,
        default : true
    }
});

const fooddatacollection = new mongoose.model('fooddata', FoodDataSchema);

module.exports = fooddatacollection;