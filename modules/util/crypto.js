const CryptoJS = require('crypto-js');
const config = require('../../config');

const encrypt = payload => {
  try {
    const secretKey = config.cryptoKey;
    if (!secretKey) {
      console.log('No Secret Key.');
      return null;
    }
    const encrypted = CryptoJS.AES.encrypt(payload, secretKey).toString();
    return encrypted;
  } catch (e) {
    console.log('Encryption error occur : ', e);
    return null;
  }
};

const decrypt = encrypted => {
  try {
    const secretKey = config.cryptoKey;
    if (!secretKey) {
      console.log('No Secret Key.');
      return null;
    }
    const decryptedBytes = CryptoJS.AES.decrypt(encrypted, secretKey);
    const decrypted = decryptedBytes.toString(CryptoJS.enc.Utf8);
    return decrypted;
  } catch (e) {
    console.log('Decryption error occur : ', e);
    return null;
  }
};

module.exports = { encrypt, decrypt };
