const express = require('express');
const session = require('express-session');
const nocache = require('nocache');
const { v4: uuidv4 } = require('uuid');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');

const adminrouter = require('./routes/admin');
const userrouter = require('./routes/user');
const profilerouter = require('./routes/profile');
const cartrouter = require('./routes/cart');
const orderrouter = require('./routes/order');
const walletrouter = require('./routes/wallet');
const checkoutrouter = require('./routes/checkout');

const app = express();

// Views for renders
app.set('view engine', 'ejs');
app.set('views', ['views/userview', 'views/adminview']);

// Application Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('assets'));
app.use(nocache());
app.use(session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true
}));
app.use(morgan('tiny'));
app.use(cors());
dotenv.config();

// Custom middlewares for router instances
app.use('/', userrouter);
app.use('/admin', adminrouter);
app.use('/profile', profilerouter);
app.use('/cart', cartrouter);
app.use('/order', orderrouter);
app.use('/wallet', walletrouter);
app.use('/checkout', checkoutrouter);

// Load PORT
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
