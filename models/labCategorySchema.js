const mongoose = require('mongoose');

const labCategorySchema = new mongoose.Schema(
  {
    labId: {
      type: String,
      required: [true, 'labId is required'],
    },
    categoryId: {
      type: String,
      required: [true, 'userId is required'],
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

module.exports = mongoose.model('labcategory', labCategorySchema);
