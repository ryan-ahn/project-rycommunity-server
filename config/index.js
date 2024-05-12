const dotenv = require('dotenv');

dotenv.config();

const env = process.env.ENV;
const port = process.env.PORT;
const apiHost = process.env.API_HOST;
const originHost = process.env.ORIGIN_HOST;
const adminHost = process.env.ADMIN_HOST;
const mongoURI = process.env.MONGODB_URL;
const kakaoScriptKey = process.env.KAKAO_SCRIPT_KEY;
const kakaoRestKey = process.env.KAKAO_REST_KEY;
const gptSecretKey = process.env.GPT_SECRET_KEY;
const jwtSecretKey = process.env.JWT_SECRET_KEY;
const awsAccessKey = process.env.AWS_ACCESS_KEY;
const awsSecretKey = process.env.AWS_SECRET_KEY;
const cryptoKey = process.env.CRYPTO_SECRET_KEY;

module.exports = {
  env,
  port,
  apiHost,
  mongoURI,
  originHost,
  adminHost,
  kakaoScriptKey,
  kakaoRestKey,
  gptSecretKey,
  jwtSecretKey,
  awsAccessKey,
  awsSecretKey,
  cryptoKey,
  adminPassword,
};
