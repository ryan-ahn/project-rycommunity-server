const express = require('express');
const { mainControllers } = require('../controllers');

const router = express.Router();

router.get('/detail/pop/:popId', mainControllers.readPopDetailController);
router.get('/list/pop/ongoing', mainControllers.readOngoingPopListController);
router.get('/list/pop/finished', mainControllers.readFinishedPopListController);
router.get('/list/category', mainControllers.readCategoryListController);
router.get(
  '/list/lab/recommend',
  mainControllers.readRecommendLabListController,
);
router.get(
  '/list/post/recommend',
  mainControllers.readRecommendPostListController,
);
router.get('/detail/event/:eventId', mainControllers.readEventDetailController);
router.get('/list/banner', mainControllers.readBannerListController);
router.get(
  '/detail/joinpop/:popId',
  mainControllers.readJoinPopDetailController,
);
router.post('/create/joinpop', mainControllers.createJoinPopMemberController);
router.get(
  '/check/joinpop/:popId',
  mainControllers.readCheckPopMemberController,
);
router.get(
  '/detail/joincon/:conId',
  mainControllers.readJoinConDetailController,
);
router.post('/create/joincon', mainControllers.createJoinConMemberController);
router.get(
  '/check/joincon/:conId',
  mainControllers.readCheckConMemberController,
);

module.exports = router;
