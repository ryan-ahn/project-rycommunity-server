const userModel = require('../models/userSchema');

const readUserDetailService = async userId => {
  // verify lab
  const user = await userModel.findOne({ userId }).catch(() => {
    throw Error('유저 정보를 확인해 주세요!');
  });
  // Response
  const resultData = {
    userDetail: user,
  };
  return resultData;
};

module.exports = {
  readUserDetailService,
};
