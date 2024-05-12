const express = require('express');
const upload = require('../loaders/multer');
const { loungeControllers } = require('../controllers');

const router = express.Router();

router.post(
  '/create/post',
  upload.uploadItem.array('images', 5),
  loungeControllers.createLoungePostController,
);
router.get(
  '/detail/post/:postId',
  loungeControllers.readLoungePostDetailController,
);
router.get('/list/post', loungeControllers.readLoungePostListController);
router.put(
  '/update/post',
  upload.uploadItem.array('images', 5),
  loungeControllers.updateLoungePostController,
);
router.post('/like/post', loungeControllers.updateLoungePostLikeController);
router.post('/delete/post', loungeControllers.deleteLoungePostController);
router.post(
  '/create/post/comment',
  loungeControllers.createLoungePostCommentController,
);
router.patch(
  '/update/post/comment',
  loungeControllers.updateLoungePostCommentController,
);
router.post(
  '/delete/post/comment',
  loungeControllers.deleteLoungePostCommentController,
);

module.exports = router;
