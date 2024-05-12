const axios = require('axios');
const jwt = require('jsonwebtoken');
const config = require('../config');
const userModel = require('../models/userSchema');
const labModel = require('../models/labSchema');
const labLikeModel = require('../models/labLikeSchema');
const labMemberModel = require('../models/labMemberSchema');
const labCategoryModel = require('../models/labCategorySchema');
const categoryModel = require('../models/categorySchema');
const { createRandomNumber } = require('../modules/util/creator');
const {
  validateDeleteTime,
  validateKoreaDate,
} = require('../modules/util/validation');
const {
  checkLabRecruitStatus,
  checkLabNewStatus,
} = require('../modules/util/checker');

const createLabService = async (authorization, body) => {
  // verify token
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  const user = await userModel.findOne({
    userId: decode.id,
  });
  if (!user) {
    throw Error('유저 정보를 확인해주세요.');
  }
  // verify category
  const category = await categoryModel.findOne({ number: body.category });
  if (!category) {
    throw Error('카테고리가 없습니다.');
  }
  // create lab
  const lab = new labModel({
    name: body.name,
    summary: body.summary,
    thumbnail: body.thumbnail
      ? body.thumbnail
      : `https://platform-client-release.s3.ap-northeast-2.amazonaws.com/background/Rectangle+${createRandomNumber(
          1008,
          1067,
        )}.jpg`,
    introduce: body.introduce,
    objective: body.objective,
    startDate: validateDeleteTime(body.startDate),
    endDate: validateDeleteTime(body.endDate),
    members: body.members,
    question: body.question,
    price: body.price,
    period: body.period,
    week: body.week,
    startTime: body.startTime,
    endTime: body.endTime,
    firstMeet: validateDeleteTime(body.firstMeet),
    place: body.place,
    private: body.private,
    recruit: true,
    status: 0,
    notice: null,
    reference: null,
    createAt: validateKoreaDate(new Date()),
    updateAt: null,
    deleteAt: null,
  });
  await lab.save();
  // add lab master
  const labMember = new labMemberModel({
    labId: lab.id,
    userId: decode.id,
    userGrade: 0,
    intro: null,
    know: null,
    questions: null,
    createAt: validateKoreaDate(new Date()),
    updateAt: null,
    deleteAt: null,
    signinAt: null,
  });
  await labMember.save();
  // add lab category
  if (category) {
    const labCategory = new labCategoryModel({
      labId: lab.id,
      categoryId: category._id,
      categoryType: 1,
      createAt: validateKoreaDate(new Date()),
      updateAt: null,
      deleteAt: null,
    });
    await labCategory.save();
  }
  // web hooks
  if (config.env === 'production') {
    await axios.post(
      'https://hooks.slack.com/services/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',
      {
        text: `${decode.id}님이 "${body.name}" 랩 개설 요청 했습니다.`,
      },
    );
  }
  // Response
  const resultData = {
    labId: lab.id,
  };
  return resultData;
};

const readLabDetailService = async (authorization, labId) => {
  // verify user
  let decode = {
    id: 0,
  };
  let labMemberMyStatus = 9;
  if (authorization) {
    decode = jwt.verify(authorization, config.jwtSecretKey);
    const isMember = await labMemberModel.findOne({
      labId,
      userId: decode.id,
    });
    if (isMember) {
      labMemberMyStatus = isMember.userGrade;
    }
  }
  // verify lab
  const lab = await labModel.findOne({ _id: labId });
  if (!lab) {
    throw Error('랩 정보를 확인해 주세요.');
  }
  // find lab member
  const labMembers = await labMemberModel.find({ labId });
  // find lab master
  const labMaster = await labMemberModel
    .findOne({
      labId,
      userGrade: 0,
    })
    .then(res => {
      return userModel.findOne({ userId: res.userId });
    });
  const labMemberDetails = await Promise.all(
    labMembers.map(async item => {
      const userDetail = await userModel.findOne({ userId: item.userId });
      return {
        _id: item.id,
        userGrade: item.userGrade,
        userDetail: {
          userId: userDetail.userId,
          name: userDetail.name,
          email: userDetail.email,
          introduce: userDetail.introduce,
          profileImage: userDetail.profileImage,
          company: userDetail.company,
        },
      };
    }),
  );
  // find labCategory
  const labCategory = await labCategoryModel.find({ labId });
  const labCategoryDetails = await Promise.all(
    labCategory.map(async item => {
      const categoryDetail = await categoryModel.findOne({
        _id: item.categoryId,
      });
      return categoryDetail;
    }),
  );
  // find labLike
  const labLikes = await labLikeModel.find({ labId, userLike: true });
  const labLikeDetails = await Promise.all(
    labLikes.map(async item => {
      const userDetail = await userModel.findOne({ userId: item.userId });
      return {
        _id: item.id,
        userDetail: {
          userId: userDetail.userId,
          name: userDetail.name,
          email: userDetail.email,
          introduce: userDetail.introduce,
          profileImage: userDetail.profileImage,
          company: userDetail.company,
        },
      };
    }),
  );
  // find labList my Status
  const labListMyData = await labLikeModel.findOne({
    userId: decode.id,
    labId,
    userLike: true,
  });
  // find lab Status
  const recruitStatus = checkLabRecruitStatus(lab.startDate, lab.recruit);
  const newStatus = checkLabNewStatus(lab.createAt);
  // Response
  const resultData = {
    labDetail: {
      labInfo: lab,
      labCategory: {
        count: labCategoryDetails.length,
        categoryList: labCategoryDetails,
      },
      periodStatus: { recruitStatus, newStatus },
      masterInfo: {
        _id: labMaster._id,
        userId: labMaster.userId,
        name: labMaster.name,
        email: labMaster.email,
        introduce: labMaster.introduce,
        profileImage: labMaster.profileImage,
        company: labMaster.company,
      },
      labMembers: {
        count: labMemberDetails.length,
        myStatus: labMemberMyStatus,
        userList: labMemberDetails,
      },
      labLikes: {
        count: labLikeDetails.length,
        myStatus: labListMyData ? labListMyData.userLike : false,
        userList: labLikeDetails.length ? labLikeDetails : null,
      },
    },
  };
  return resultData;
};

const readLabListService = async (
  authorization,
  offset = 0,
  limit = 100,
  tab,
) => {
  // verify user
  let decode = {
    id: 0,
  };
  if (authorization) {
    decode = jwt.verify(authorization, config.jwtSecretKey);
  }
  // find lab
  let labs = [];
  let count = 0;
  const today = validateKoreaDate(new Date());
  if (tab === 'all') {
    labs = await labModel
      .find({ status: { $gt: 1 } })
      .sort({ createAt: -1 })
      .skip(offset)
      .limit(limit);
    count = await labModel.find({ status: { $gt: 1 } }).count();
  }
  if (tab === 'papershop') {
    labs = await labModel
      .find({ status: 9 })
      .sort({ createAt: -1 })
      .skip(offset)
      .limit(limit);
    count = await labModel.find({ status: 9 }).count();
  }
  if (tab === 'recruit') {
    labs = await labModel
      .find({
        status: { $gt: 1 },
        startDate: { $lt: today },
        recruit: true,
      })
      .sort({ createAt: -1 })
      .skip(offset)
      .limit(limit);
    count = await labModel
      .find({
        status: { $gt: 1 },
        startDate: { $lt: today },
        recruit: true,
      })
      .count();
  }
  if (tab === 'active') {
    labs = await labModel
      .find({ status: { $gt: 1 } })
      .sort({ createAt: -1 })
      .skip(offset)
      .limit(limit);
    count = await labModel.find({ status: { $gt: 1 } }).count();
  }
  // find labDetail
  const labDetails = await Promise.all(
    labs.map(async item => {
      // find lab master
      const labMaster = await labMemberModel
        .findOne({
          labId: item.id,
          userGrade: 0,
        })
        .then(res => {
          return userModel.findOne({ userId: res.userId });
        });
      // find lab like
      const labLikes = await labLikeModel.find({
        labId: item.id,
        userLike: true,
      });
      // find labList my Status
      const labListMyData = await labLikeModel.findOne({
        userId: decode.id,
        labId: item.id,
        userLike: true,
      });
      // find labCategory
      const labCategory = await labCategoryModel.find({ labId: item.id });
      const labCategoryDetails = await Promise.all(
        labCategory.map(async item => {
          const categoryDetail = await categoryModel.findOne({
            _id: item.categoryId,
          });
          return categoryDetail;
        }),
      );
      // find lab Status
      const recruitStatus = checkLabRecruitStatus(item.startDate, item.recruit);
      const newStatus = checkLabNewStatus(item.createAt);
      return {
        labInfo: item,
        labCategory: {
          count: labCategoryDetails.length,
          categoryList: labCategoryDetails,
        },
        periodStatus: {
          recruitStatus,
          newStatus,
        },
        masterInfo: {
          _id: labMaster._id,
          userId: labMaster._id,
          name: labMaster.name,
          email: labMaster.email,
          introduce: labMaster.introduce,
          profileImage: labMaster.profileImage,
          company: labMaster.company,
        },
        labLikes: {
          count: labLikes.length,
          myStatus: labListMyData ? labListMyData.userLike : false,
        },
      };
    }),
  );
  // Response
  const resultData = {
    count,
    labList: labDetails,
  };
  return resultData;
};

const updateLabService = async (authorization, body) => {
  // verify token
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  const user = await userModel.findOne({
    userId: decode.id,
  });
  if (!user) {
    throw Error('유저 정보를 확인해주세요.');
  }
  // verify labId
  const lab = await labModel.findOne({
    _id: body.labId,
  });
  if (!lab) {
    throw Error('랩 정보를 확인해 주세요.');
  }
  // Todo. 랩 디테일 키 체크
  // verify master
  const verifiedMaster = await labMemberModel.findOne({
    userId: decode.id,
    labId: body.labId,
    userGrade: 0,
  });
  if (!verifiedMaster) {
    throw Error('권한을 확인해 주세요.');
  }
  await labModel.updateOne(
    { _id: body.labId },
    { ...body, updateAt: validateKoreaDate(new Date()) },
  );
};

const updateLabLikeService = async (authorization, labId) => {
  // verify token
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  const user = await userModel.findOne({
    userId: decode.id,
  });
  if (!user) {
    throw Error('유저 정보를 확인해주세요.');
  }
  // verify labId
  const lab = await labModel.findOne({
    _id: labId,
  });
  if (!lab) {
    throw Error('랩 정보를 확인해 주세요.');
  }
  // find lab like
  const labLike = await labLikeModel.findOne({
    labId,
    userId: decode.id,
  });
  // update or create lab like
  if (labLike) {
    await labLikeModel.updateOne(
      { labId, userId: decode.id },
      { userLike: !labLike.userLike, updateAt: validateKoreaDate(new Date()) },
    );
  } else {
    const labLike = new labLikeModel({
      labId,
      userId: decode.id,
      userLike: true,
      createAt: validateKoreaDate(new Date()),
      updateAt: validateKoreaDate(new Date()),
    });
    await labLike.save();
  }
};

const createMemberJoinService = async (
  authorization,
  labId,
  intro,
  questions,
  know,
) => {
  // verify token
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  const user = await userModel.findOne({
    userId: decode.id,
  });
  if (!user) {
    throw Error('유저 정보를 확인해주세요.');
  }
  // verify labId
  const lab = await labModel.findOne({ _id: labId });
  if (!lab) {
    throw Error('랩 정보를 확인해 주세요.');
  }
  // find member
  const verifiedMabMember = await labMemberModel.findOne({
    userId: decode.id,
    labId,
  });
  if (verifiedMabMember) {
    throw Error('이미 참여한 랩입니다.');
  }
  await labMemberModel.updateMany({}, { intro: null });
  // add lab master
  const labMember = new labMemberModel({
    labId,
    userId: decode.id,
    userGrade: 1,
    questions,
    intro: intro || null,
    know: know || null,
    createAt: validateKoreaDate(new Date()),
    updateAt: null,
    deleteAt: null,
    signinAt: null,
  });
  await labMember.save();
};

const readMemberDetailService = async (authorization, labId, userId) => {
  // verify token
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  const user = await userModel.findOne({
    userId: decode.id,
  });
  if (!user) {
    throw Error('유저 정보를 확인해주세요.');
  }
  // verify master
  await labMemberModel
    .findOne({
      userId: decode.id,
      labId,
      userGrade: 0,
    })
    .then(res => {
      if (!res) {
        throw Error('랩짱 확인');
      }
    })
    .catch(e => {
      console.log(e);
      throw Error('권한을 확인해 주세요.');
    });
  // find member
  const labMember = await labMemberModel.findOne({
    labId,
    userId,
  });
  const memberDetail = await userModel.findOne({ userId });
  // Response
  const resultData = {
    memberDetail: {
      userGrade: labMember.userGrade,
      questions: labMember.questions,
      userDetail: {
        userId: memberDetail.userId,
        name: memberDetail.name,
        email: memberDetail.email,
        phone: memberDetail.phone,
        introduce: memberDetail.introduce,
        profileImage: memberDetail.profileImage,
        company: memberDetail.company,
      },
    },
  };
  return resultData;
};

const readMemberListService = async (authorization, labId) => {
  // verify token
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  const user = await userModel.findOne({
    userId: decode.id,
  });
  if (!user) {
    throw Error('유저 정보를 확인해주세요.');
  }
  // verify master
  await labMemberModel
    .findOne({
      userId: decode.id,
      labId,
      userGrade: 0,
    })
    .then(res => {
      if (!res) {
        throw Error('랩짱 확인');
      }
    })
    .catch(e => {
      console.log(e);
      throw Error('권한을 확인해 주세요.');
    });
  // find member
  const labMember = await labMemberModel.find({
    labId,
    userGrade: { $gt: 0 },
  });
  const labMemberDetails = await Promise.all(
    labMember.map(async item => {
      const userDetail = await userModel.findOne({ userId: item.userId });
      return {
        userGrade: item.userGrade,
        questions: item.questions,
        userDetail: {
          userId: userDetail.userId,
          name: userDetail.name,
          email: userDetail.email,
          introduce: userDetail.introduce,
          profileImage: userDetail.profileImage,
          company: userDetail.company,
        },
      };
    }),
  );
  // Response
  const resultData = {
    labMembers: labMemberDetails,
  };
  return resultData;
};

const updateMemberConfirmService = async (
  authorization,
  labId,
  userId,
  userGrade,
) => {
  // verify token
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  const user = await userModel.findOne({
    userId: decode.id,
  });
  if (!user) {
    throw Error('유저 정보를 확인해주세요.');
  }
  // verify master
  await labMemberModel
    .findOne({
      userId: decode.id,
      labId,
      userGrade: 0,
    })
    .catch(() => {
      throw Error('권한을 확인해 주세요.');
    });
  // verify member
  await labMemberModel
    .findOne({
      labId,
      userId,
    })
    .then(res => {
      if (!res) {
        throw Error('유저 정보를 확인해 주세요.');
      }
      if (res.userGrade === 0) {
        throw Error('랩짱 자신의 정보는 수정할 수 없습니다.');
      }
    });
  await labMemberModel.updateOne(
    {
      labId,
      userId,
    },
    {
      userGrade,
      updateAt: validateKoreaDate(new Date()),
    },
  );
};

const updateLabEndDateService = async (authorization, labId) => {
  // verify token
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  const user = await userModel.findOne({
    userId: decode.id,
  });
  if (!user) {
    throw Error('유저 정보를 확인해 주세요.');
  }
  // verify labId
  const lab = await labModel.findOne({
    _id: labId,
  });
  if (!lab) {
    throw Error('랩 정보를 확인해 주세요.');
  }
  // Todo. 랩 디테일 키 체크
  // verify master
  const verifiedMaster = await labMemberModel.findOne({
    userId: decode.id,
    labId,
    userGrade: 0,
  });
  if (!verifiedMaster) {
    throw Error('권한을 확인해 주세요.');
  }
  await labModel.updateOne(
    { _id: labId },
    {
      recruit: false,
      updateAt: validateKoreaDate(new Date()),
    },
  );
};

const readJoinLabDetailService = async (authorization, labId) => {
  // verify token
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  const user = await userModel.findOne({
    userId: decode.id,
  });
  if (!user) {
    throw Error('유저 정보를 확인해 주세요.');
  }
  // To do : 오늘 날짜랑 모집일 비교
  const lab = await labModel.findOne({
    _id: labId,
  });
  if (!lab) {
    throw Error('랩 정보를 확인해 주세요.');
  }
  // Response
  const resultData = {
    joinLabDetail: {
      labDetail: {
        question: lab.question,
      },
      userDetail: {
        userId: user.userId,
        profileImage: user.profileImage,
        name: user.name,
        phone: user.phone,
        email: user.email,
      },
    },
  };
  return resultData;
};

module.exports = {
  createLabService,
  readLabDetailService,
  readLabListService,
  updateLabService,
  updateLabLikeService,
  createMemberJoinService,
  readMemberDetailService,
  readMemberListService,
  updateMemberConfirmService,
  updateLabEndDateService,
  readJoinLabDetailService,
};
