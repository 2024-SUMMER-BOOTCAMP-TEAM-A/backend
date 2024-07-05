const mongoose = require('mongoose');

const chatLogSchema = new mongoose.Schema({
  startTime: {
    type: Date,
    required: true,
    default: Date.now,
  },
  endTime: {
    type: Date,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  persona: {
    type: String,
    required: true,
  },
  messages: [{
    role: String,
    content: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ChatLog', chatLogSchema);
