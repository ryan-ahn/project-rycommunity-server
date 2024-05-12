const mongoose = require('mongoose');

const presenter = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
  },
  career: {
    type: String,
    required: [true, 'career is required'],
  },
  intro: {
    type: String,
    required: false,
  },
});

const body = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'body title is required'],
  },
  body: {
    type: String,
    required: [true, 'body is required'],
  },
});

const popSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'type is required'],
    },
    title: {
      type: String,
      required: [true, 'title is required'],
    },
    description: {
      type: String,
      required: [true, 'description is required'],
    },
    numberOfPeople: {
      type: Number,
      required: [true, 'numberOfPeople is required'],
    },
    offline: {
      type: Boolean,
      required: [true, 'offline is required'],
    },
    live: {
      type: Boolean,
      required: [true, 'live is required'],
    },
    status: {
      type: Number,
      required: [true, 'status is required'],
    },
    thumbnail: {
      type: String,
      required: [true, 'thumbnail is required'],
    },
    presenter: [presenter],
    place: {
      type: String,
      required: [true, 'place is required'],
    },
    startTime: {
      type: String,
      required: [true, 'startTime is required'],
    },
    endTime: {
      type: String,
      required: [true, 'endTime is required'],
    },
    date: {
      type: Date,
      required: [true, 'date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'endDate is required'],
    },
    endDateTime: {
      type: String,
      required: false,
    },
    link: {
      type: String,
      required: [true, 'link is required'],
    },
    program: {
      type: Array,
      required: [true, 'program is required'],
    },
    body: [body],
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

module.exports = mongoose.model('pop', popSchema);
