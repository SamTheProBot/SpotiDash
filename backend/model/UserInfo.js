const mongoose = require('mongoose');

const UserInfo = new mongoose.Schema({
  userKey: {
    type: String,
    unique: true,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  weekly: {
    exist: {
      type: Boolean,
      default: false,
    },
    weeklyID: {
      type: String,
      default: null,
    },
    playlistID: {
      type: String,
      default: null,
    },
    whenCreate: {
      type: Date,
      default: Date.now,
    },
  },
  blend: [
    {
      blendID: {
        type: String,
        default: null,
      },
      playlistID: {
        type: String,
        default: null,
      },
      whenCreate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(`UserInfo`, UserInfo);
