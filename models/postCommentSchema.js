const mongoose = require('mongoose');

const postCommentSchema = new mongoose.Schema(
  {
    postType: {
      type: String,
      required: [true, 'postType is required'],
    },
    postId: {
      type: String,
      required: [true, 'postId is required'],
    },
    userId: {
      type: String,
      required: [true, 'userId is required'],
    },
    comment: {
      type: String,
      required: [true, 'comment is required'],
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

module.exports = mongoose.model('postcomment', postCommentSchema);
