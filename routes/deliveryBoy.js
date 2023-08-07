// routes/deliveryBoy.js
const express = require('express');
const router = express.Router();
const DeliveryBoyController = require('../controllers/deliveryBoy');

router.put('/respond/:orderRequestId', DeliveryBoyController.deliveryBoyRespond);

module.exports = router;
