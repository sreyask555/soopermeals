const mongoose = require('mongoose');

// MongoDB-Node Connection
mongoose.connect('mongodb://127.0.0.1:27017/soopermeal')
.then(()=>{
    console.log('MongoDB Connected for Schemas');
})
.catch((err)=>{
    console.log('MongoDB failed to connect');
    console.error(err.stack)
});

module.exports = mongoose;