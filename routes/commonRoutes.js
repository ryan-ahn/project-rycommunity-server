const express = require('express');
const { commonControllers } = require('../controllers');

const router = express.Router();

router.get('/database', commonControllers.forDatabaseController);
router.get('/detail/meta/:id', commonControllers.readMetaDataController);
router.post('/crawling/link', commonControllers.readCrawlingController);
router.post('/create/qr', commonControllers.createQrDataController);
router.post('/detail/qr', commonControllers.readQrDataController);
router.post('/detail/user/qr', commonControllers.readUserQrDateController);

module.exports = router;
