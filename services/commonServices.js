const jwt = require('jsonwebtoken');
const QRCode = require('qrcode');
const cheerio = require('cheerio');
const axios = require('axios');
const iconv = require('iconv-lite');
const config = require('../config');
const userModel = require('../models/userSchema');
const labModel = require('../models/labSchema');
const popMemberModel = require('../models/popMemberSchema');
const metaModel = require('../models/metaSchema');

iconv.skipDecodeWarning = true;

const forDatabaseService = async () => {
  await labModel.updateMany({}, { $set: { recruit: true } });
};

const readMetaDataService = async id => {
  const type = id.split('+')[0];
  const contentId = id.split('+')[1];
  if (type === 'pop' && contentId) {
    const meta = await metaModel.findOne({ type: 'pop', id: contentId });
    return meta;
  }
};

const readCrawlingService = async url => {
  const response = await axios.get(`${url}`, { responseType: 'arraybuffer' });
  const content = iconv.decode(response.data, 'UTF-8');
  const $ = cheerio.load(content);
  const title = $('title').text();
  const description = $('meta[name="description"]').attr('content');
  const image = $('meta[property="og:image"]').attr('content');
  // Response
  const resultData = {
    urlData: {
      title: title || null,
      description: description || null,
      image: image || null,
    },
  };
  return resultData;
};

const createQrDataService = async id => {
  const qr = await QRCode.toDataURL(`${id}`);
  return {
    qrImage: qr,
  };
};

const readQrDataService = async (authorization, popId) => {
  // verify token
  const decode = jwt.verify(authorization, config.jwtSecretKey);
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
  });
  if (!popMember) {
    throw Error('세미나 유저 정보를 확인해 주세요.');
  }
  // find pop off member
  const popOffMember = await popMemberModel.findOne({
    popId,
    userId: decode.id,
    onoff: '오프라인 참여',
  });
  if (!popOffMember) {
    throw Error('세미나 유저 정보를 확인해 주세요.');
  }
  await popMemberModel.updateOne(
    {
      popId,
      userId: decode.id,
    },
    { isAttendance: true },
  );
};

const readUserQrDateService = async id => {
  const popId = id.split('+')[0];
  const userId = id.split('+')[1];
  let result = false;
  let message = '';
  // verify token
  const user = await userModel.findOne({ userId });
  if (!user) {
    result = false;
    message = '유저 정보를 확인해주세요.';
  }
  // find pop member
  const popMember = await popMemberModel.findOne({
    popId,
    userId,
  });
  if (!popMember) {
    result = false;
    message = '신청 대상에 없습니다.';
  }
  if (popMember) {
    if (popMember.onoff === '온라인 참여') {
      result = false;
      message = '온라인 신청자입니다.';
    }
    if (popMember.onoff === '오프라인 참여') {
      result = true;
      message = '반갑습니다!';
    }
  }
  await popMemberModel.updateOne(
    {
      popId,
      userId,
    },
    { isAttendance: true },
  );
  // response
  return {
    result,
    message,
    userName: `${user ? user.name : 'OOO'}님`,
  };
};

module.exports = {
  forDatabaseService,
  readMetaDataService,
  readCrawlingService,
  createQrDataService,
  readQrDataService,
  readUserQrDateService,
};
