const mongoose = require('./mongoDB');

// doc-schemas
const UserDataSchema = new mongoose.Schema({
    username : {
        type : String,
        requied : true
    },
    usernumber : {
        type : String,
        required : true
    },
    useremail : {
        type : String,
        required : true
    },
    userpassword : {
        type : String,
        required : true
    },
    isBlocked : {
        type : Boolean,
        default : false
    }
});

const userdatacollection = new mongoose.model('userdata', UserDataSchema);

module.exports = userdatacollection;