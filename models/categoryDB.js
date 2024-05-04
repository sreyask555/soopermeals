const mongoose = require('./mongoDB');

// doc-schemas
const CategoryDataSchema = new mongoose.Schema({
    category : {
        type : String,
        required : true
    }
});

const categorydatacollection = new mongoose.model('categorydata', CategoryDataSchema);

module.exports = categorydatacollection;