const express = require('express');
const { pilotControllers } = require('../controllers');

const router = express.Router();

router.post(
  '/chat/completions',
  pilotControllers.sendChatCompletionsController,
);

module.exports = router;
