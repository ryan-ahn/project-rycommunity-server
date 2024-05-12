const mongoose = require('mongoose');

const conMemberSchema = new mongoose.Schema(
  {
    conId: {
      type: String,
      required: [true, 'labId is required'],
    },
    userId: {
      type: String,
      required: [true, 'userId is required'],
    },
    question1: {
      type: String,
      required: [true, 'question is required'],
    },
    question2: {
      type: String,
      required: false,
    },
    question3: {
      type: Array,
      required: [true, 'question is required'],
    },
    question4: {
      type: Array,
      required: [true, 'question is required'],
    },
    question5: {
      type: Array,
      required: [true, 'question is required'],
    },
    question6: {
      type: String,
      required: [true, 'question is required'],
    },
    question7: {
      type: String,
      required: [true, 'question is required'],
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
    isAttendance: {
      type: Boolean,
      required: [true, 'isAttendance is required'],
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('conmember', conMemberSchema);
