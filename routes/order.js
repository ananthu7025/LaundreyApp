

// routes/order.js
const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/order');


router.post('/create', OrderController.createOrder);
router.get('/all', OrderController.getAllOrders);
router.post('/create-requested-order', OrderController.createRequestedOrder);

module.exports = router;

