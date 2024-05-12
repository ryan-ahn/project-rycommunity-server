const mongoose = require('mongoose');

const postLikeSchema = new mongoose.Schema(
  {
    postId: {
      type: String,
      required: [true, 'postId is required'],
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

module.exports = mongoose.model('postlike', postLikeSchema);
