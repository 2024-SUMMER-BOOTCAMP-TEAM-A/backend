const mongoose = require('mongoose');

const summaryLogSchema = new mongoose.Schema({
  chatLogId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  summary: {
    type: String,
    required: true, // 요약 내용
  },
  conclusion: {
    type: String,
    required: true, // 결론
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

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

const ChatLog = mongoose.model('ChatLog', chatLogSchema);
const SummaryLog = mongoose.model('SummaryLog', summaryLogSchema);

module.exports = {
  ChatLog,
  SummaryLog,
};
