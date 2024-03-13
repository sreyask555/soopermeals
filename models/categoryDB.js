const mongoose = require('mongoose');

// MongoDB-Node Connection
mongoose.connect('mongodb://127.0.0.1:27017/soopermeal')
.then(()=>{
    console.log('MongoDB Connected for Category Schema');
})
.catch((err)=>{
    console.log('MongoDB failed to connect');
    console.error(err.stack)
})

// doc-schemas
const CategoryDataSchema = new mongoose.Schema({
    category : {
        type : String,
        required : true
    }
});

const categorydatacollection = new mongoose.model('categorydata', CategoryDataSchema);

module.exports = categorydatacollection;