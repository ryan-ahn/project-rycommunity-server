const jwt = require('jsonwebtoken');
const config = require('../config');
const userModel = require('../models/userSchema');
const labModel = require('../models/labSchema');
const labRecommendModel = require('../models/labRecommendSchema');
const popModel = require('../models/popSchema');
const popMemberModel = require('../models/popMemberSchema');
const popCategoryModel = require('../models/popCategorySchema');
const conMemberModel = require('../models/conMemberSchema');
const categoryModel = require('../models/categorySchema');
const postModel = require('../models/postSchema');
const postLikeModel = require('../models/postLikeSchema');
const postCommentModel = require('../models/postCommentSchema');
const postRecommendModel = require('../models/postRecommendSchema');
const eventModel = require('../models/eventSchema');
const {
  validateSecretPhone,
  validateKoreaDate,
} = require('../modules/util/validation');
const { createTomorrow } = require('../modules/util/creator');

const readPopDetailService = async (authorization, popId) => {
  // verify user
  if (authorization) {
    jwt.verify(authorization, config.jwtSecretKey);
  }
  // verify lab
  const pop = await popModel.findOne({ _id: popId });
  if (!pop) {
    throw Error('세미나 정보를 확인해 주세요.');
  }
  // find pop category
  const popCategory = await popCategoryModel.find({
    popId,
  });
  const popCategoryDetails = await Promise.all(
    popCategory.map(async item => {
      const categoryDetail = await categoryModel.findOne({
        _id: item.categoryId,
      });
      return categoryDetail;
    }),
  );

  // Response
  const resultData = {
    popDetail: {
      popInfo: pop,
      popCategory: {
        count: popCategoryDetails.length,
        categoryList: popCategoryDetails,
      },
    },
  };
  return resultData;
};

const readOngoingPopListService = async authorization => {
  // verify user
  if (authorization) {
    jwt.verify(authorization, config.jwtSecretKey);
  }
  // find pop
  const today = createTomorrow();
  const count = await popModel.find({ date: { $gte: today }, type: 'pop' });
  const pop = await popModel
    .find({ date: { $gte: today }, type: 'pop' })
    .sort({ date: 1 });
  // find popDetail
  const popDetail = await Promise.all(
    pop.map(async item => {
      // find pop category
      const popCategory = await popCategoryModel.find({
        popId: item.id,
      });
      const popCategoryDetails = await Promise.all(
        popCategory.map(async item => {
          const categoryDetail = await categoryModel.findOne({
            _id: item.categoryId,
          });
          return categoryDetail;
        }),
      );
      return {
        popInfo: item,
        popCategory: {
          count: popCategoryDetails.length,
          categoryList: popCategoryDetails,
        },
      };
    }),
  );
  // Response
  const resultData = {
    count: count.length,
    popList: popDetail,
  };
  return resultData;
};

const readFinishedPopListService = async (
  authorization,
  offset = 0,
  limit = 100,
) => {
  // verify user
  if (authorization) {
    jwt.verify(authorization, config.jwtSecretKey);
  }
  // find pop
  const today = createTomorrow();
  const count = await popModel.find({ date: { $lt: today }, type: 'pop' });
  const pop = await popModel
    .find({ date: { $lt: today }, type: 'pop' })
    .sort({ date: -1 })
    .skip(offset)
    .limit(limit);
  // find popDetail
  const popDetail = await Promise.all(
    pop.map(async item => {
      // find pop category
      const popCategory = await popCategoryModel.find({
        popId: item.id,
      });
      const popCategoryDetails = await Promise.all(
        popCategory.map(async item => {
          const categoryDetail = await categoryModel.findOne({
            _id: item.categoryId,
          });
          return categoryDetail;
        }),
      );
      return {
        popInfo: item,
        popCategory: {
          count: popCategoryDetails.length,
          categoryList: popCategoryDetails,
        },
      };
    }),
  );
  // Response
  const resultData = {
    count: count.length,
    popList: popDetail,
  };
  return resultData;
};

const readCategoryListService = async () => {
  // find best category
  const category = await categoryModel.find({});
  // Response
  const resultData = {
    categoryList: category,
  };
  return resultData;
};

const readRecommendLabListService = async () => {
  // find lab
  const labRecommend = await labRecommendModel.find({});
  const labRecommendDetail = await Promise.all(
    labRecommend.map(async item => {
      const labDetail = await labModel.findOne({
        _id: item.labId,
      });
      return labDetail;
    }),
  );
  // Response
  const resultData = {
    labRecommendList: labRecommendDetail,
  };
  return resultData;
};

const readRecommendPostListService = async () => {
  // find post
  const postRecommend = await postRecommendModel.find({});
  const postRecommendDetail = await Promise.all(
    postRecommend.map(async item => {
      const postDetail = await postModel.findOne({
        _id: item.postId,
      });
      // find user
      const userDetail = await userModel.findOne({ userId: postDetail.userId });
      // find post like
      const postLike = await postLikeModel.find({
        postId: item.postId,
        userLike: true,
      });
      // find post comment
      const postComment = await postCommentModel.find({
        postId: item.postId,
        deleteAt: null,
      });
      return {
        postDetail,
        authorDetail: {
          userId: userDetail.userId,
          name: userDetail.name,
          email: userDetail.email,
          introduce: userDetail.introduce,
          profileImage: userDetail.profileImage,
          company: userDetail.company,
        },
        postLikes: {
          count: postLike.length,
        },
        postComments: {
          count: postComment.length,
        },
      };
    }),
  );
  // Response
  const resultData = {
    postRecommendList: postRecommendDetail,
  };
  return resultData;
};

const readEventDetailService = async eventId => {
  // find best category
  const event = await eventModel.findOne({ _id: eventId });
  // update or create lab like
  if (!event) {
    throw Error('이벤트 정보를 확인해 주세요.');
  }
  // Response
  const resultData = {
    eventDetail: event,
  };
  return resultData;
};

const readBannerListService = async () => {
  // find best category
  const event = await eventModel.find({});
  // update or create lab like
  if (!event) {
    throw Error('이벤트가 없어요.');
  }
  // Response
  const resultData = {
    bannerList: event,
  };
  return resultData;
};

const readJoinPopDetailService = async (authorization, popId) => {
  // verify token
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  // find user
  const userDetail = await userModel.findOne({
    userId: decode.id,
  });
  // find Pop
  const popDetail = await popModel.findOne({
    _id: popId,
  });
  // find pop member
  const popMember = await popMemberModel.find({
    popId,
    onoff: '오프라인 참여',
    deleteAt: null,
  });
  // response
  const resultData = {
    joinPopDetail: {
      userDetail: {
        userId: userDetail.userId,
        name: userDetail.name,
        phone: validateSecretPhone(userDetail.phone),
        email: userDetail.email,
        profileImage: userDetail.profileImage,
      },
      popDetail: {
        offline: popDetail.offline,
        live: popDetail.live,
      },
      popStatus: {
        subscribe: popMember.length < popDetail.numberOfPeople,
      },
    },
  };
  return resultData;
};

const createJoinPopMemberService = async (
  authorization,
  popId,
  onoff,
  know,
  use,
  job,
) => {
  // verify token
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  // find user
  const user = await userModel.findOne({
    userId: decode.id,
  });
  if (!user) {
    throw Error('유저 정보를 확인해주세요.');
  }
  // find Pop
  const pop = await popModel.findOne({
    _id: popId,
    type: 'pop',
  });
  if (!pop) {
    throw Error('세미나 정보를 확인해주세요.');
  }
  const popMember = new popMemberModel({
    popId,
    userId: decode.id,
    onoff,
    know,
    use,
    job,
    isAttendance: false,
    createAt: validateKoreaDate(new Date()),
    updateAt: null,
    deleteAt: null,
  });
  await popMember.save();
};

const readCheckPopMemberService = async (authorization, popId) => {
  // verify token
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  // find user
  const user = await userModel.findOne({
    userId: decode.id,
  });
  if (!user) {
    throw Error('유저 정보를 확인해주세요.');
  }
  // find pop member
  const popMember = await popMemberModel.findOne({
    popId,
    userId: decode.id,
    deleteAt: null,
  });
  // Response
  const resultData = {
    apply: !!popMember,
  };
  return resultData;
};

const readJoinConDetailService = async (authorization, conId) => {
  // verify token
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  // find user
  const userDetail = await userModel.findOne({
    userId: decode.id,
  });
  // find con
  const conDetail = await popModel.findOne({
    _id: conId,
    type: 'con',
  });
  if (!conDetail) {
    throw Error('컨퍼런스 정보를 확인해 주세요.');
  }
  // response
  const resultData = {
    joinConDetail: {
      userDetail: {
        userId: userDetail.userId,
        name: userDetail.name,
        phone: validateSecretPhone(userDetail.phone),
        email: userDetail.email,
        profileImage: userDetail.profileImage,
      },
    },
  };
  return resultData;
};

const createJoinConMemberService = async (
  authorization,
  conId,
  question1,
  question2,
  question3,
  question4,
  question5,
  question6,
  question7,
  question8,
  question9,
) => {
  // verify param
  const variableNames = [question3, question4, question5];
  // for 루프를 사용하여 변수에 접근합니다
  for (let i = 0; i < 3; i++) {
    const variableName = variableNames[i];
    // eslint-disable-next-line no-eval
    const variableValue = eval(variableName);
    if (typeof variableName !== 'object') {
      throw Error('입력값의 형태를 확인해 주세요.');
    }
    variableValue.map(ele => {
      if (typeof ele !== 'string') {
        throw Error('답변 형태를 확인해 주세요.');
      }
    });
  }
  // verify token
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  // find user
  const user = await userModel.findOne({
    userId: decode.id,
  });
  if (!user) {
    throw Error('유저 정보를 확인해주세요.');
  }
  // find Pop
  const pop = await popModel.findOne({
    _id: conId,
    type: 'con',
  });
  if (!pop) {
    throw Error('컨퍼런스 정보를 확인해주세요.');
  }
  const popMember = new conMemberModel({
    conId,
    userId: decode.id,
    question1,
    question2,
    question3,
    question4,
    question5,
    question6,
    question7,
    question8,
    question9,
    isAttendance: false,
    createAt: validateKoreaDate(new Date()),
    updateAt: null,
    deleteAt: null,
  });
  await popMember.save();
};

const readCheckConMemberService = async (authorization, conId) => {
  // verify token
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  // find user
  const user = await userModel.findOne({
    userId: decode.id,
  });
  if (!user) {
    throw Error('유저 정보를 확인해주세요.');
  }
  // find pop member
  const conMember = await conMemberModel.findOne({
    conId,
    userId: decode.id,
    deleteAt: null,
  });
  // Response
  const resultData = {
    apply: !!conMember,
  };
  return resultData;
};

module.exports = {
  readPopDetailService,
  readOngoingPopListService,
  readFinishedPopListService,
  readCategoryListService,
  readRecommendLabListService,
  readRecommendPostListService,
  readEventDetailService,
  readBannerListService,
  readJoinPopDetailService,
  createJoinPopMemberService,
  readCheckPopMemberService,
  readJoinConDetailService,
  createJoinConMemberService,
  readCheckConMemberService,
};
