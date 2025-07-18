const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config({ path: './.env' });
const seedDatabase = require('./utils/seeder');

const app = express();

// Connect Database
// connectDB().then(() => {
//   // Seed database after connection is established
//   if (process.env.NODE_ENV !== 'production') {
//     seedDatabase();
//   }
// });

connectDB();



// Init Middleware
app.use(express.json({ extended: false }));
app.use(cors());

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/products', require('./routes/api/products'));
app.use('/api/reviews', require('./routes/api/reviews'));
app.use('/api/cart', require('./routes/api/cart'));
app.use('/api/admin', require('./routes/api/admin'));
app.use('/api/orders', require('./routes/api/orders'));
app.use('/api/banners', require('./routes/api/banners'));
app.use('/api/newsletter', require('./routes/api/newsletter'));
app.use('/api/payment', require('./routes/api/payment'));
app.use('/api/support', require('./routes/api/support'));
app.use('/api/categories', require('./routes/api/categories'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
