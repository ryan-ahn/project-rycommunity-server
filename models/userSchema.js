const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      require: true,
    },
    signUpType: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: false,
    },
    birth: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      require: true,
    },
    profileImage: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: false,
    },
    introduce: {
      type: String,
      required: false,
    },
    createAt: {
      type: Date,
      required: true,
    },
    updateAt: {
      type: Date,
      required: false,
    },
    deleteAt: {
      type: Date,
      required: false,
    },
    signinAt: {
      type: Date,
      require: false,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('user', userSchema);
