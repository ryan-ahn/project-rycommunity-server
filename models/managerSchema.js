const mongoose = require('mongoose');

const managerSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      require: true,
    },
    userGrade: {
      type: Number,
      require: true,
    },
    encryptKey: {
      type: String,
      require: true,
    },
    signUpType: {
      type: String,
      required: true,
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

module.exports = mongoose.model('manager', managerSchema);
