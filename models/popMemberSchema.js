const mongoose = require('mongoose');

const popMemberSchema = new mongoose.Schema(
  {
    popId: {
      type: String,
      required: [true, 'labId is required'],
    },
    userId: {
      type: String,
      required: [true, 'userId is required'],
    },
    onoff: {
      type: String,
      required: [true, 'onoff is required'],
    },
    know: {
      type: Array,
      required: [true, 'know is required'],
    },
    use: {
      type: Array,
      required: [true, 'use is required'],
    },
    job: {
      type: String,
      required: [true, 'job is required'],
    },
    isAttendance: {
      type: Boolean,
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

module.exports = mongoose.model('popmember', popMemberSchema);
