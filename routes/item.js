// routes/item.js
const express = require('express');
const router = express.Router();
const ItemController = require('../controllers/item');

router.get('/list', ItemController.getItemList);

module.exports = router;

