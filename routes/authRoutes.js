const express = require('express');
const { authControllers } = require('../controllers');

const router = express.Router();

router.get('/kakao/init', authControllers.kakaoInitController);
router.get('/kakao/callback/:id', authControllers.kakaoCallbackController);
router.get('/token/access', authControllers.authTokenAccessController);
router.get('/token/verify', authControllers.authTokenVerifyController);
router.patch('/update/user', authControllers.authUpdateUserController);

module.exports = router;
