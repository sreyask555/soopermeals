const mongoose = require('mongoose');

// MongoDB-Node Connection
mongoose.connect('mongodb://127.0.0.1:27017/soopermeal')
.then(()=>{
    console.log('MongoDB Connected for Admin Schema');
})
.catch((err)=>{
    console.log('MongoDB failed to connect');
    console.error(err.stack)
})

// doc-schemas
const AdminDataSchema = new mongoose.Schema({
    adminemail : {
        type : String,
        required : true
    },
    adminpassword : {
        type : String,
        required : true
    }
});

const admindatacollection = new mongoose.model('admindata', AdminDataSchema);

module.exports = admindatacollection;