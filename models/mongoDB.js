const mongoose = require('mongoose');

// Read values from .env
const dotenv = require('dotenv');
dotenv.config();

// Mongo uri fetch from .env
let MONGO_URI;
if (process.env.NODE_ENV === 'development'){
    MONGO_URI = process.env.MONGO_DEV_URI;
}
else if(process.env.NODE_ENV === 'production'){
    MONGO_URI = process.env.MONGO_PROD_URI;
}

// MongoDB-Node Connection
mongoose.connect(MONGO_URI)
.then(()=>{
    console.log('MongoDB Connected for Schemas');
})
.catch((err)=>{
    console.log('MongoDB failed to connect');
    console.error(err.stack)
});

module.exports = mongoose; 