const axios = require('axios');
const jwt = require('jsonwebtoken');
const config = require('../config');
const userModel = require('../models/userSchema');
const { validatePhone } = require('../modules/util/validation');

const kakaoInitService = async () => {
  // Step0. Kakao Init
  const initUrl = 'https://kauth.kakao.com/oauth/authorize';
  const kakaoInitConfig = {
    client_id: config.kakaoRestKey,
    redirect_uri: `${config.originHost}/login`,
    response_type: 'code',
  };
  const params = new URLSearchParams(kakaoInitConfig).toString();
  // Response
  const redirectUrl = `${initUrl}?${params}`;
  return redirectUrl;
};

const kakaoCallbackService = async code => {
  // Step1. Kakao Callback
  const baseUrl = 'https://kauth.kakao.com/oauth/token';
  const kakaoCallbackConfig = {
    client_id: config.kakaoScriptKey,
    client_secret: '',
    grant_type: 'authorization_code',
    redirect_uri: `${config.originHost}/login`,
    code,
  };
  const params = new URLSearchParams(kakaoCallbackConfig).toString();
  const callbackUrl = `${baseUrl}?${params}`;
  const callbackResponse = await axios.get(callbackUrl, {
    headers: {
      'Content-type': 'application/json',
    },
  });
  // Step2. Kakao Token
  const userUrl = 'https://kapi.kakao.com/v2/user/me';
  const callbackToken = callbackResponse.data.access_token;
  const userResponse = await axios.get(userUrl, {
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${callbackToken}`,
    },
  });
  // Step3. Search User Data
  const userDetail = await userModel.findOne({
    userId: userResponse.data.id,
  });
  const resultData = {
    userDetail: null,
    token: {
      accessToken: null,
    },
  };
  // Step4. JWT Token
  const { id } = userResponse.data;
  const nick = userResponse.data.properties.nickname;
  resultData.token.accessToken = jwt.sign(
    {
      id,
      nick,
    },
    config.jwtSecretKey,
    {
      expiresIn: '1y',
      issuer: 'ryan',
    },
  );
  // Step5. Sign Up or Sign In
  if (userDetail) {
    resultData.userDetail = userDetail;
  } else {
    // connect lab collection
    const user = (resultData.userDetail = new userModel({
      userId: userResponse.data.id,
      signUpType: 'Kakao',
      name: userResponse.data.kakao_account.name,
      email: userResponse.data.kakao_account.email,
      phone: validatePhone(userResponse.data.kakao_account.phone_number),
      birth:
        userResponse.data.kakao_account.birthyear +
        userResponse.data.kakao_account.birthday,
      gender: userResponse.data.kakao_account.gender,
      profileImage: userResponse.data.properties.profile_image,
      company: null,
      introduce: null,
      createAt: new Date(),
      updateAt: null,
      deleteAt: null,
      signinAt: null,
    }));
    await user.save();
    // web hooks
    if (config.env === 'production') {
      await axios.post(
        'https://hooks.slack.com/services/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',
        {
          text: `${userResponse.data.id}님이 가입했습니다.`,
        },
      );
    }
  }
  // todo : delete user 에러처리 해야함
  return resultData;
};

const authTokenAccessService = async authorization => {
  // verify token
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  // find user
  const userDetail = await userModel.findOne({
    userId: decode.id,
  });
  if (!userDetail) {
    throw Error('사용이 불가능한 유저입니다.');
  }
  // update user
  await userModel.updateOne(
    {
      userId: decode.id,
    },
    { signinAt: new Date() },
  );
  const resultData = {
    userDetail: {
      userId: userDetail.userId,
      name: userDetail.name,
      email: userDetail.email,
      introduce: userDetail.introduce,
      profileImage: userDetail.profileImage,
      company: userDetail.company,
    },
  };
  // todo : delete user 에러처리 해야함
  return resultData;
};

const authTokenVerifyService = authorization => {
  // verify token
  jwt.verify(authorization, config.jwtSecretKey);
};

const authUpdateUserService = async (authorization, data) => {
  // verify token
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  // verify data keys
  const userKeys = [
    'name',
    'email',
    'phone',
    'birth',
    'profileImage',
    'company',
    'introduce',
  ];
  const dataKeys = Object.keys(data);
  const verifyData = data => {
    return data.every(item => userKeys.includes(item));
  };
  if (!verifyData(dataKeys)) {
    throw Error('유저 데이터를 확인해 주세요.');
  }
  // update user
  await userModel.updateOne(
    {
      userId: decode.id,
    },
    { ...data, updateAt: new Date() },
  );
};

module.exports = {
  kakaoInitService,
  kakaoCallbackService,
  authTokenAccessService,
  authTokenVerifyService,
  authUpdateUserService,
};
