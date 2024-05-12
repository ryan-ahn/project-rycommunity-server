const mongoose = require('mongoose');
const config = require('../config');

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoURI);
    mongoose.set('autoCreate', true);
    console.log('Mongoose Connected ...');
  } catch (err) {
    console.error(err.message);
    throw Error('Do Not Connected!');
  }
};

module.exports = connectDB;
