const mongoose = require('mongoose');

const labRecommendSchema = new mongoose.Schema(
  {
    labId: {
      type: String,
      required: [true, 'labId is required'],
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

module.exports = mongoose.model('labrecommend', labRecommendSchema);
