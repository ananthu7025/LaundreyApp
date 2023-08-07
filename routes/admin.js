// routes/admin.js
const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin');

router.post('/add-delivery-boy', AdminController.addDeliveryBoy);

module.exports = router;
