const mongoose = require('mongoose');

// MongoDB-Node Connection
mongoose.connect(`mongodb://${process.env.MONGO_SERVER}`)
.then(()=>{
    console.log('MongoDB Connected for Schemas');
})
.catch((err)=>{
    console.log('MongoDB failed to connect');
    console.error(err.stack)
});

module.exports = mongoose;