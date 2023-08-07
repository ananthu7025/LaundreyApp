// routes/user.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');



router.post('/signup', UserController.signup);
router.post('/login', UserController.login);
router.post('/get-user-details', UserController.getUserDetailsByToken);





module.exports = router;


