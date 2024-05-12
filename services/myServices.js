const jwt = require('jsonwebtoken');
const config = require('../config');
const userModel = require('../models/userSchema');
const popModel = require('../models/popSchema');
const popMemberModel = require('../models/popMemberSchema');
const conMemberModel = require('../models/conMemberSchema');
const labModel = require('../models/labSchema');
const labMemberModel = require('../models/labMemberSchema');
const { validateKoreaDate } = require('../modules/util/validation');

const readMyPopListService = async authorization => {
  // verify token
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  const user = await userModel.findOne({
    userId: decode.id,
  });
  if (!user) {
    throw Error('유저 정보를 확인해주세요.');
  }
  // find my ongoing pop
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  const date = new Date().getDate();
  const today = validateKoreaDate(new Date(year, month, date - 1));
  // find onGoing pop list
  const onGoingPops = await popMemberModel.find({
    userId: decode.id,
    deleteAt: null,
  });
  const resultOnGoingPops = [];
  await Promise.all(
    onGoingPops.map(async item => {
      const popDetail = await popModel.findOne({
        _id: item.popId,
        date: { $gte: today },
      });
      if (popDetail) {
        resultOnGoingPops.push({
          popInfo: popDetail,
          applicantInfo: { onoff: item.onoff },
        });
      }
    }),
  );
  // find finished pop list
  const finishedPops = await popMemberModel.find({
    userId: decode.id,
    deleteAt: null,
  });
  const resultFinishedPops = [];
  await Promise.all(
    finishedPops.map(async item => {
      const popDetail = await popModel.findOne({
        _id: item.popId,
        date: { $lt: today },
      });
      if (popDetail) {
        resultFinishedPops.push({
          popInfo: popDetail,
          applicantInfo: { onoff: item.onoff },
        });
      }
    }),
  );
  // find onGoing con list
  const onGoingCons = await conMemberModel.find({
    userId: decode.id,
    deleteAt: null,
  });
  const resultOnGoingCons = [];
  await Promise.all(
    onGoingCons.map(async item => {
      const conDetail = await popModel.findOne({
        _id: item.conId,
        date: { $gte: today },
      });
      if (conDetail) {
        resultOnGoingCons.push({
          conInfo: conDetail,
        });
      }
    }),
  );
  // find finished pop list
  const finishedCons = await conMemberModel.find({
    userId: decode.id,
    deleteAt: null,
  });
  const resultFinishedCons = [];
  await Promise.all(
    finishedCons.map(async item => {
      const conDetail = await popModel.findOne({
        _id: item.conId,
        date: { $lt: today },
      });
      if (conDetail) {
        resultFinishedCons.push({
          popInfo: conDetail,
        });
      }
    }),
  );
  // Response
  const resultData = {
    onGoingList: {
      count: resultOnGoingPops.length,
      popList: resultOnGoingPops.sort((a, b) => {
        return a.popInfo.date - b.popInfo.date;
      }),
    },
    onGoingConList: {
      count: resultOnGoingCons.length,
      conList: resultOnGoingCons,
    },

    finishedList: {
      count: resultFinishedPops.length,
      popList: resultFinishedPops.sort((a, b) => {
        return b.popInfo.date - a.popInfo.date;
      }),
    },
    finishedConList: {
      count: resultFinishedCons.length,
      conList: resultFinishedCons,
    },
  };
  return resultData;
};

const readMyLabListService = async authorization => {
  // verify token
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  const user = await userModel.findOne({
    userId: decode.id,
  });
  if (!user) {
    throw Error('유저 정보를 확인해주세요.');
  }
  // find my lab list
  const myLabs = await labMemberModel.find({ userId: decode.id, userGrade: 0 });
  const myLabDetails = await Promise.all(
    myLabs.map(async item => {
      const labDetail = await labModel.findOne({
        _id: item.labId,
      });
      return { labInfo: labDetail, userGrade: item.userGrade };
    }),
  );
  // find join lab list
  const joinLabs = await labMemberModel.find({
    userId: decode.id,
    userGrade: { $gte: 1 },
  });
  const joinLabDetails = await Promise.all(
    joinLabs.map(async item => {
      const labDetail = await labModel.findOne({
        _id: item.labId,
      });
      return { labInfo: labDetail, userGrade: item.userGrade };
    }),
  );
  // Response
  const resultData = {
    myLabList: {
      count: myLabDetails.length,
      labList: myLabDetails,
    },
    joinLabList: {
      count: joinLabDetails.length,
      labList: joinLabDetails,
    },
  };
  return resultData;
};

const deleteJoinConService = async (authorization, conId) => {
  // verify token
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  const user = await userModel.findOne({
    userId: decode.id,
  });
  if (!user) {
    throw Error('유저 정보를 확인해 주세요.');
  }
  // verify conId
  const con = await popModel.findOne({
    _id: conId,
  });
  if (!con) {
    throw Error('컨퍼런스 정보를 확인해 주세요.');
  }
  // cancel
  await conMemberModel.updateOne(
    {
      userId: decode.id,
    },
    { deleteAt: validateKoreaDate(new Date()) },
  );
};

module.exports = {
  readMyPopListService,
  readMyLabListService,
  deleteJoinConService,
};
