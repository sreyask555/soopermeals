const mongoose = require('./mongoDB');

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