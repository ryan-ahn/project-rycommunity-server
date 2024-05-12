const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: [true, 'category is required'],
    },
    name: {
      type: String,
      required: [true, 'category is required'],
    },
    type: {
      type: Number,
      required: [true, 'type is required'],
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

module.exports = mongoose.model('category', categorySchema);
