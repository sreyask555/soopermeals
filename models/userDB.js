const mongoose = require('mongoose');

// MongoDB-Node Connection
mongoose.connect('mongodb://127.0.0.1:27017/soopermeal')
.then(()=>{
    console.log('MongoDB Connected for User Schema');
})
.catch((err)=>{
    console.log('MongoDB failed to connect');
    console.error(err.stack);
})

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