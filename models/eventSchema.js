const mongoose = require('mongoose');

const event = new mongoose.Schema({
  image: {
    type: String,
    required: [true, 'image is required'],
  },
  link: {
    type: String,
    required: false,
  },
});

const eventSchema = new mongoose.Schema(
  {
    thumbnail: {
      type: String,
      required: [true, 'thumbnail is required'],
    },
    template: {
      type: [event],
      required: [true, 'banners is required'],
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

module.exports = mongoose.model('event', eventSchema);
