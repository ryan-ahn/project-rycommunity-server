const jwt = require('jsonwebtoken');
const config = require('../config');
const userModel = require('../models/userSchema');
const managerModel = require('../models/managerSchema');
const labModel = require('../models/labSchema');
const labRecommendModel = require('../models/labRecommendSchema');
const labLikeModel = require('../models/labLikeSchema');
const labMemberModel = require('../models/labMemberSchema');
const labCategoryModel = require('../models/labCategorySchema');
const categoryModel = require('../models/categorySchema');
const postModel = require('../models/postSchema');
const postRecommendModel = require('../models/postRecommendSchema');
const postCommentModel = require('../models/postCommentSchema');
const popModel = require('../models/popSchema');
const popMemberModel = require('../models/popMemberSchema');
const conMemberModel = require('../models/conMemberSchema');
const popCategoryModel = require('../models/popCategorySchema');
const eventModel = require('../models/eventSchema');
const metaModel = require('../models/metaSchema');
const { encrypt, decrypt } = require('../modules/util/crypto');
const {
  validateDeleteTime,
  validateKoreaDate,
} = require('../modules/util/validation');
const {
  checkLabRecruitStatus,
  checkLabNewStatus,
} = require('../modules/util/checker');

const createManagerSignUpService = async (email, password, grade) => {
  // verify id
  const verify = await managerModel.findOne({
    userEmail: email,
  });
  if (verify) {
    throw Error('존재하는 계정입니다.');
  }
  // sign up
  const manager = new managerModel({
    userEmail: email,
    userGrade: grade,
    encryptKey: await encrypt(password),
    signUpType: 'manager',
    createAt: new Date(),
    updateAt: null,
    deleteAt: null,
    signinAt: null,
  });
  await manager.save();
};

const readManagerSignInService = async (email, password) => {
  // verify admin
  const manager = await managerModel.findOne({
    userEmail: email,
  });
  if (!manager) {
    throw Error('가입되지 않은 이메일입니다.');
  }
  const decryptKey = await decrypt(manager.encryptKey);
  // check password
  if (String(password) !== decryptKey) {
    throw Error('비밀번호를 다시 입력해 주세요.');
  }
  const id = manager._id;
  const access = jwt.sign(
    {
      id,
      password,
    },
    config.jwtSecretKey,
    {
      expiresIn: '1d',
      issuer: 'ryan',
    },
  );
  return { accessToken: access };
};

const deleteManagerService = async email => {
  // check manager
  const manager = await managerModel.findOne({ userEmail: email });
  if (!manager) {
    throw Error('회원 정보를 확인해주세요.');
  }
  // delete manager
  await managerModel.deleteOne({ userEmail: email });
};

const createFakeSignUpService = async (authorization, body) => {
  // verify user
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  // check manager
  const manager = await managerModel.findOne({ _id: decode.id });
  if (!manager) {
    throw Error('회원 정보를 확인해주세요.');
  }
  const resultData = {
    userDetail: null,
    token: {
      accessToken: null,
    },
  };
  const fakeLength = await userModel.find({
    signUpType: 'fake',
  });
  const id = 2793000001 + fakeLength.length;
  const nick = 'fake';
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
  // verify admin
  const user = (resultData.userDetail = new userModel({
    userId: id,
    signUpType: 'fake',
    name: body.name,
    email: body.email,
    phone: '010-1234-5678',
    birth: '19910101',
    gender: 'female',
    profileImage: body.profileImage,
    company: null,
    introduce: null,
    createAt: new Date(),
    updateAt: null,
    deleteAt: null,
    signinAt: null,
  }));
  await user.save();
  return resultData;
};

const readFakeUserListService = async authorization => {
  // verify user
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  // check manager
  const manager = await managerModel.findOne({ _id: decode.id });
  if (!manager) {
    throw Error('회원 정보를 확인해주세요.');
  }
  // find best category
  const fakeUserList = await userModel.find({
    signUpType: 'fake',
  });
  // Response
  const resultData = {
    userList: fakeUserList,
  };
  return resultData;
};

const readStayLabListService = async (
  authorization,
  offset = 0,
  limit = 100,
) => {
  // verify user
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  // check manager
  const manager = await managerModel.findOne({ _id: decode.id });
  if (!manager) {
    throw Error('회원 정보를 확인해주세요.');
  }
  // find lab
  const labs = await labModel
    .find({ status: 0 })
    .sort({ createAt: -1 })
    .skip(offset)
    .limit(limit);
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
      const recruitStatus = checkLabRecruitStatus(item.startDate, item.endDate);
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
          count: labLikeDetails.length,
          myStatus: labListMyData ? labListMyData.userLike : false,
        },
      };
    }),
  );
  // Response
  const resultData = {
    labList: labDetails,
  };
  return resultData;
};

const updateLabStatusService = async (authorization, labId, labStatus) => {
  // verify user
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  // check manager
  const manager = await managerModel.findOne({ _id: decode.id });
  if (!manager) {
    throw Error('회원 정보를 확인해주세요.');
  }
  if (!labStatus) {
    throw Error('랩 상태값을 확인해 주세요.');
  }
  // find lab
  // To do : 랩이 없는 경우에도 승인 됨
  await labModel.updateOne(
    { _id: labId },
    {
      status: labStatus,
      updateAt: validateKoreaDate(new Date()),
    },
  );
};

const createPopService = async (authorization, body) => {
  // verify user
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  // check manager
  const manager = await managerModel.findOne({ _id: decode.id });
  if (!manager) {
    throw Error('회원 정보를 확인해주세요.');
  }
  // verify category
  if (!body.category) {
    throw Error('카테고리가 없습니다.');
  }
  // verify category
  const category = await categoryModel.findOne({ number: body.category });
  if (!category) {
    throw Error('카테고리가 없습니다.');
  }
  // create pop
  const pop = new popModel({
    type: body.type,
    title: body.title,
    description: body.description,
    numberOfPeople: body.numberOfPeople,
    live: body.live,
    offline: body.offline,
    status: body.status,
    thumbnail: body.thumbnail,
    presenter: body.presenter,
    place: body.place,
    startTime: body.startTime,
    endTime: body.endTime,
    date: validateDeleteTime(body.date),
    endDate: validateDeleteTime(body.endDate),
    endDateTime: body.endDateTime,
    link: body.link,
    program: body.program,
    body: body.body,
    createAt: validateKoreaDate(new Date()),
    updateAt: null,
    deleteAt: null,
  });
  await pop.save();
  // create meta
  const meta = new metaModel({
    type: body.type,
    id: pop.id,
    title: body.title,
    description: body.description,
    image: body.ogImage,
    createAt: validateKoreaDate(new Date()),
    updateAt: null,
    deleteAt: null,
  });
  await meta.save();
  // add lab category
  const popCategory = new popCategoryModel({
    popId: pop.id,
    categoryId: category._id,
    createAt: validateKoreaDate(new Date()),
    updateAt: null,
    deleteAt: null,
  });
  await popCategory.save();
  // response
  const resultData = {
    popId: pop.id,
  };
  return resultData;
};

const updatePopService = async (authorization, body) => {
  // verify user
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  // check manager
  const manager = await managerModel.findOne({ _id: decode.id });
  if (!manager) {
    throw Error('회원 정보를 확인해주세요.');
  }
  // verify labId
  const pop = await popModel.findOne({
    _id: body.popId,
  });
  if (!pop) {
    throw Error('랩 정보를 확인해 주세요.');
  }
  await popModel.updateOne(
    { _id: body.popId },
    { ...body, updateAt: validateKoreaDate(new Date()) },
  );
};

const readConListService = async authorization => {
  // verify user
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  // check manager
  const manager = await managerModel.findOne({ _id: decode.id });
  if (!manager) {
    throw Error('회원 정보를 확인해주세요.');
  }
  // verify labId
  const con = await popModel.find({
    type: 'con',
  });
  if (!con) {
    throw Error('랩 정보를 확인해 주세요.');
  }
  const validateCon = con.map(ele => {
    return {
      value: ele.id,
      label: ele.title,
    };
  });
  // response
  const resultData = {
    conValueList: validateCon,
  };
  return resultData;
};

const readPopMemberService = async (authorization, popId) => {
  // verify user
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  // check manager
  const manager = await managerModel.findOne({ _id: decode.id });
  if (!manager) {
    throw Error('회원 정보를 확인해주세요.');
  }
  // find pop member
  const popMember = await popMemberModel.find({ popId });
  const popMemberDetail = await Promise.all(
    popMember.map(async item => {
      const userDetail = await userModel.findOne({ userId: item.userId });
      return {
        name: userDetail.name,
        birth: userDetail.birth,
        phone: userDetail.phone,
        gender: userDetail.gender,
        email: userDetail.email,
        onoff: item.onoff,
        createAt: item.createAt,
        know: item.know,
        use: item.use,
        job: item.job,
        isAttendance: item.isAttendance,
      };
    }),
  );
  // response
  const resultData = {
    popMemberList: popMemberDetail,
  };
  return resultData;
};

const readConMemberService = async (authorization, conId) => {
  // verify user
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  // check manager
  const manager = await managerModel.findOne({ _id: decode.id });
  if (!manager) {
    throw Error('회원 정보를 확인해주세요.');
  }
  // find con member
  const conMember = await conMemberModel.find({ conId });
  const conMemberDetail = await Promise.all(
    conMember.map(async item => {
      const userDetail = await userModel.findOne({ userId: item.userId });
      return {
        key: userDetail.userId,
        name: userDetail.name,
        birth: userDetail.birth,
        phone: userDetail.phone,
        gender: userDetail.gender,
        email: userDetail.email,
        question1: item.question1,
        question2: item.question2,
        question3: item.question3,
        question4: item.question4,
        question5: item.question5,
        question6: item.question6,
        question7: item.question7,
        createAt: item.createAt,
        isAttendance: item.isAttendance ? '예' : '아니오',
      };
    }),
  );
  // response
  const resultData = {
    conMemberList: conMemberDetail,
  };
  return resultData;
};

const updateConMemberAttendanceService = async (
  authorization,
  conId,
  userId,
  type,
) => {
  // verify user
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  // check manager
  const manager = await managerModel.findOne({ _id: decode.id });
  if (!manager) {
    throw Error('회원 정보를 확인해주세요.');
  }
  const checkMember = await conMemberModel.findOne({
    conId,
    userId,
  });
  if (!checkMember) {
    throw Error('신청 내역이 없습니다.');
  }
  // update con member
  if (type === 'confirm') {
    await conMemberModel.updateOne(
      { conId, userId },
      { isAttendance: true, updateAt: validateKoreaDate(new Date()) },
    );
  } else {
    await conMemberModel.updateOne(
      { conId, userId },
      { isAttendance: false, updateAt: validateKoreaDate(new Date()) },
    );
  }
};

const createCategoryService = async (authorization, number, name, type) => {
  // verify user
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  // check manager
  const manager = await managerModel.findOne({ _id: decode.id });
  if (!manager) {
    throw Error('회원 정보를 확인해주세요.');
  }
  // find best category
  const categoryNumber = await categoryModel.findOne({ number });
  if (categoryNumber) {
    throw Error('사용중인 넘버입니다.');
  }
  const categoryName = await categoryModel.findOne({ name });
  if (categoryName) {
    throw Error('사용중인 이름입니다.');
  }
  // create category
  const category = new categoryModel({
    number,
    name,
    type,
    createAt: validateKoreaDate(new Date()),
    updateAt: null,
  });
  await category.save();
};

const updateCategoryService = async (authorization, body) => {
  // verify user
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  // check manager
  const manager = await managerModel.findOne({ _id: decode.id });
  if (!manager) {
    throw Error('회원 정보를 확인해주세요.');
  }
  // verify category
  const category = await categoryModel.findOne({
    _id: body.categoryId,
  });
  if (!category) {
    throw Error('카테고리 아이디를 확인해 주세요.');
  }
  // find best category
  const categoryNumber = await categoryModel.findOne({ number: body.number });
  if (categoryNumber) {
    throw Error('사용중인 넘버입니다.');
  }
  const categoryName = await categoryModel.findOne({ name: body.name });
  if (categoryName) {
    throw Error('사용중인 이름입니다.');
  }
  // update category
  await categoryModel.updateOne(
    { _id: body.categoryId },
    { ...body, updateAt: validateKoreaDate(new Date()) },
  );
};

const updatePostService = async (authorization, body) => {
  // verify user
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  // check manager
  const manager = await managerModel.findOne({ _id: decode.id });
  if (!manager) {
    throw Error('회원 정보를 확인해주세요.');
  }
  // find post
  const post = await postModel.find({
    _id: body.postId,
    deleteAt: null,
  });
  if (!post) {
    throw Error('없는 게시글입니다.');
  }
  if (body.createAt) {
    // update lounge comment
    await postModel.updateOne(
      {
        _id: body.postId,
      },
      { createAt: new Date(body.createAt) },
    );
  }
};

const updatePostCommentService = async (authorization, body) => {
  // verify user
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  // check manager
  const manager = await managerModel.findOne({ _id: decode.id });
  if (!manager) {
    throw Error('회원 정보를 확인해주세요.');
  }
  // find post comment
  const postComment = await postCommentModel.find({
    commentId: body.commentId,
    deleteAt: null,
  });
  if (!postComment) {
    throw Error('없는 코멘트입니다.');
  }
  if (body.createAt) {
    // update lounge comment
    await postCommentModel.updateOne(
      {
        _id: body.commentId,
      },
      { createAt: new Date(body.createAt) },
    );
  }
};

const createLabRecommendService = async (authorization, labId) => {
  // verify user
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  // check manager
  const manager = await managerModel.findOne({ _id: decode.id });
  if (!manager) {
    throw Error('회원 정보를 확인해주세요.');
  }
  // find lab
  const lab = await labModel.findOne({ _id: labId });
  if (!lab) {
    throw Error('랩 정보를 확인해 주세요.');
  }
  const labRecommend = await labRecommendModel.findOne({ labId });
  if (labRecommend) {
    throw Error('이미 추천된 랩이에요');
  }
  // create lab recommend
  const labRecommendSave = new labRecommendModel({
    labId,
    createAt: validateKoreaDate(new Date()),
    updateAt: null,
  });
  await labRecommendSave.save();
};

const deleteLabRecommendService = async (authorization, labId) => {
  // verify user
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  // check manager
  const manager = await managerModel.findOne({ _id: decode.id });
  if (!manager) {
    throw Error('회원 정보를 확인해주세요.');
  }
  // find lab recommend
  const labRecommend = await labRecommendModel.findOne({ labId });
  if (!labRecommend) {
    throw Error('랩 정보를 확인해 주세요.');
  }
  // delete lab recommend
  await labRecommendModel.deleteOne({
    labId,
  });
};

const createPostRecommendService = async (authorization, postId) => {
  // verify user
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  // check manager
  const manager = await managerModel.findOne({ _id: decode.id });
  if (!manager) {
    throw Error('회원 정보를 확인해주세요.');
  }
  // find post
  const post = await postModel.findOne({ _id: postId });
  if (!post) {
    throw Error('게시글 정보를 확인해 주세요.');
  }
  const postRecommend = await postRecommendModel.findOne({ postId });
  if (postRecommend) {
    throw Error('이미 추천된 게시글이에요');
  }
  // create lab recommend
  const postRecommendSave = new postRecommendModel({
    postId,
    createAt: validateKoreaDate(new Date()),
    updateAt: null,
  });
  await postRecommendSave.save();
};

const deletePostRecommendService = async (authorization, postId) => {
  // verify user
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  // check manager
  const manager = await managerModel.findOne({ _id: decode.id });
  if (!manager) {
    throw Error('회원 정보를 확인해주세요.');
  }
  // find post recommend
  const postRecommend = await postRecommendModel.findOne({ postId });
  if (!postRecommend) {
    throw Error('게시글 정보를 확인해 주세요.');
  }
  // delete post recommend
  await postRecommendModel.deleteOne({
    postId,
  });
};

const createEventService = async (authorization, thumbnail, templateList) => {
  // verify user
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  // check manager
  const manager = await managerModel.findOne({ _id: decode.id });
  if (!manager) {
    throw Error('회원 정보를 확인해주세요.');
  }
  if (!templateList) {
    throw Error('템플릿 정보를 확인해 주세요.');
  }
  // create event
  const eventSave = new eventModel({
    thumbnail,
    template: templateList,
    createAt: validateKoreaDate(new Date()),
    updateAt: null,
  });
  await eventSave.save();
};

const deleteEventService = async (authorization, eventId) => {
  // verify user
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  // check manager
  const manager = await managerModel.findOne({ _id: decode.id });
  if (!manager) {
    throw Error('회원 정보를 확인해주세요.');
  }
  // find event
  const event = await eventModel.findOne({ _id: eventId });
  if (!event) {
    throw Error('이벤트 정보를 확인해 주세요.');
  }
  // delete event
  await eventModel.deleteOne({
    _id: eventId,
  });
};

module.exports = {
  createManagerSignUpService,
  readManagerSignInService,
  deleteManagerService,
  createFakeSignUpService,
  readFakeUserListService,
  readStayLabListService,
  updateLabStatusService,
  createPopService,
  updatePopService,
  readConListService,
  readPopMemberService,
  readConMemberService,
  updateConMemberAttendanceService,
  createCategoryService,
  updateCategoryService,
  updatePostService,
  updatePostCommentService,
  createLabRecommendService,
  deleteLabRecommendService,
  createPostRecommendService,
  deletePostRecommendService,
  createEventService,
  deleteEventService,
};
