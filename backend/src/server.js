const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config({ path: './.env' });
const seedProducts = require('./utils/seeder');

const app = express();

// Connect Database
connectDB().then(() => {
  // Seed database after connection is established
  if (process.env.NODE_ENV !== 'production') {
    seedProducts();
  }
});


// Init Middleware
app.use(express.json({ extended: false }));
app.use(cors());

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/products', require('./routes/api/products'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
