const express = require('express');
const { labControllers } = require('../controllers');

const router = express.Router();

router.post('/create', labControllers.createLabController);
router.get('/detail/:labId', labControllers.readLabDetailController);
router.get('/list', labControllers.readLabListController);
router.put('/update', labControllers.updateLabController);
router.post('/like', labControllers.updateLabLikeController);
router.post('/create/member/join', labControllers.createMemberJoinController);
router.post('/detail/member', labControllers.readMemberDetailController);
router.post('/list/member', labControllers.readMemberListController);
router.patch(
  '/update/member/confirm',
  labControllers.updateMemberConfirmController,
);
router.patch('/update/deadline', labControllers.updateLabEndDateController);
router.get('/detail/join/:labId', labControllers.readJoinLabDetailController);

module.exports = router;
