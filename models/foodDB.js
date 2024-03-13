const mongoose = require('mongoose');

// MongoDB-Node Connection
mongoose.connect('mongodb://127.0.0.1:27017/soopermeal')
.then(()=>{
    console.log('MongoDB Connected for Food Schema');
})
.catch((err)=>{
    console.log('MongoDB failed to connect');
    console.error(err.stack)
})

// doc-schemas
const FoodDataSchema = new mongoose.Schema({
    foodname : {
        type : String,
        requied : true
    },
    foodimage : {
        type : [String],
        required : true
    },
    foodprice : {
        type : Number,
        required : true
    },
    foodnotes : {
        type : String,
        required : true
    },
    foodcategory : {
        type : String,
        required : true
    },
    foodrating : {
        type : Number,
        required : true
    },
    isListed : {
        type : Boolean,
        default : true
    }
});

const fooddatacollection = new mongoose.model('fooddata', FoodDataSchema);

module.exports = fooddatacollection;