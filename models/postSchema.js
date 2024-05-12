const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  link: {
    type: String,
    required: false,
  },
  title: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
});

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'userId is required'],
    },
    body: {
      type: String,
      required: false,
    },
    postType: {
      type: String,
      required: [true, 'body is required'],
    },
    link: {
      type: linkSchema,
      required: false,
    },
    images: {
      type: Array,
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

module.exports = mongoose.model('post', postSchema);
