const express = require('express');
const { myControllers } = require('../controllers');

const router = express.Router();

router.get('/list/pop', myControllers.readMyPopListController);
router.get('/list/lab', myControllers.readMyLabListController);
router.delete('/delete/joincon', myControllers.deleteJoinConController);

module.exports = router;
