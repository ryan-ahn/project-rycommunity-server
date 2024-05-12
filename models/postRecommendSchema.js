const mongoose = require('mongoose');

const postRecommendSchema = new mongoose.Schema(
  {
    postId: {
      type: String,
      required: [true, 'postId is required'],
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

module.exports = mongoose.model('postrecommend', postRecommendSchema);
