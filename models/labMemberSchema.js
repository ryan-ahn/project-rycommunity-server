const mongoose = require('mongoose');

const question = new mongoose.Schema({
  question: {
    type: String,
    required: false,
  },
  answer: {
    type: String,
    required: false,
  },
});

const labMemberSchema = new mongoose.Schema(
  {
    labId: {
      type: String,
      required: [true, 'labId is required'],
    },
    userId: {
      type: String,
      required: [true, 'userId is required'],
    },
    userGrade: {
      type: Number,
      required: [true, 'userGrade is required'],
    },
    intro: {
      type: String,
      required: false,
    },
    questions: { type: [question], required: false },
    know: {
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
  },
  { versionKey: false },
);

module.exports = mongoose.model('labmember', labMemberSchema);
