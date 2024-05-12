const mongoose = require('mongoose');

const labSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name is required'],
    },
    summary: {
      type: String,
      required: [true, 'summary is required'],
    },
    thumbnail: {
      type: String,
      required: [true, 'thumbnail is required'],
    },
    introduce: {
      type: String,
      required: [true, 'introduce is required'],
    },
    objective: {
      type: Array,
      required: false,
    },
    startDate: {
      type: Date,
      required: [true, 'startDate is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'year is required'],
    },
    members: {
      type: Number,
      required: [true, 'members is required'],
    },
    question: {
      type: Array,
      required: false,
    },
    price: {
      type: Number,
      required: [true, 'price is required'],
    },
    period: {
      type: String,
      required: [true, 'period is required'],
    },
    week: {
      type: String,
      required: [true, 'week is required'],
    },
    startTime: {
      type: String,
      required: [true, 'startTime is required'],
    },
    endTime: {
      type: String,
      required: [true, 'endTime is required'],
    },
    firstMeet: {
      type: Date,
      required: [true, 'firstMeet is required'],
    },
    place: {
      type: String,
      required: [true, 'place is required'],
    },
    private: {
      type: Boolean,
      required: [true, 'private is required'],
    },
    recruit: {
      type: Boolean,
      required: [true, 'recruit is required'],
    },
    status: {
      type: Number,
      required: [true, 'status is required'],
    },
    notice: {
      type: String,
      required: false,
    },
    reference: {
      type: String,
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

module.exports = mongoose.model('lab', labSchema);
