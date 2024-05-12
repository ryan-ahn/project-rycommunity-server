const express = require('express');
const { adminControllers } = require('../controllers');

const router = express.Router();

router.post('/email/signup', adminControllers.createManagerSignUpController);
router.post('/email/signin', adminControllers.readManagerSignInController);
router.delete('/delete/manager', adminControllers.deleteManagerController);
router.post('/fake/signup', adminControllers.createFakeSignUpController);
router.get('/fake/list', adminControllers.readFakeUserListController);
router.get('/list/lab/stay', adminControllers.readStayLabListController);
router.patch('/update/lab/status', adminControllers.updateLabStatusController);
router.post('/create/pop', adminControllers.createPopController);
router.patch('/update/pop', adminControllers.updatePopController);
router.get('/list/con/value', adminControllers.readConListController);
router.get('/list/pop/member/:popId', adminControllers.readPopMemberController);
router.get('/list/con/member/:conId', adminControllers.readConMemberController);
router.patch(
  '/update/con/member/attendance',
  adminControllers.updateConMemberAttendanceController,
);
router.post('/create/category', adminControllers.createCategoryController);
router.patch('/update/category', adminControllers.updateCategoryController);
router.patch('/update/post', adminControllers.updatePostController);
router.patch(
  '/update/post/comment',
  adminControllers.updatePostCommentController,
);
router.post(
  '/create/lab/recommend',
  adminControllers.createLabRecommendController,
);
router.delete(
  '/delete/lab/recommend',
  adminControllers.deleteLabRecommendController,
);
router.post(
  '/create/post/recommend',
  adminControllers.createPostRecommendController,
);
router.delete(
  '/delete/post/recommend',
  adminControllers.deletePostRecommendController,
);
router.post('/create/event', adminControllers.createEventController);
router.delete('/delete/event', adminControllers.deleteEventController);

module.exports = router;
