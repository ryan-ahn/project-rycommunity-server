const mongoose = require('mongoose');

const metaSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      require: true,
    },
    id: {
      type: String,
      require: false,
    },
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: true,
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

module.exports = mongoose.model('meta', metaSchema);
