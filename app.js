const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Connect to MongoDB database
mongoose.connect('mongodb://127.0.0.1:27017/laundrey_app_test?directConnection=true', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Import and use your routes
const userRoutes = require('./routes/user');
const orderRoutes = require('./routes/order');
const notificationRoutes = require('./routes/notification');
const itemRoutes = require('./routes/item');
const userDetailsRoutes = require('./routes/user'); // Adjust the path accordingly
const adminRoutes = require('./routes/admin');
const deliveryBoyRoutes = require('./routes/deliveryBoy');


// Use the route files
app.use('/api/admin', adminRoutes);
app.use('/api', userDetailsRoutes);
app.use('/api/item', itemRoutes); 
app.use('/api/user', userRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api', deliveryBoyRoutes);


// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
