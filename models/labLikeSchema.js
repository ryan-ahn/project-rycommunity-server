const mongoose = require('mongoose');

const labLikeSchema = new mongoose.Schema(
  {
    labId: {
      type: String,
      required: [true, 'labId is required'],
    },
    userId: {
      type: String,
      required: [true, 'userId is required'],
    },
    userLike: {
      type: Boolean,
      required: [true, 'userLike is required'],
    },
    createAt: {
      type: Date,
      required: true,
    },
    updateAt: {
      type: Date,
      required: false,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('lablike', labLikeSchema);
