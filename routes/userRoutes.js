const express = require('express');
const { userControllers } = require('../controllers');

const router = express.Router();

router.get('/detail/:userId', userControllers.readUserDetailController);

module.exports = router;
