const mongoose = require('mongoose');

// Message 스키마
const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

// ChatLog 스키마
const chatLogSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  persona: {
    type: String,
    required: true,
  },
  messages: [messageSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// SummaryLog 스키마
const summaryLogSchema = new mongoose.Schema({
  chatLogId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'ChatLog'
  },
  user: {
    type: String,
    require: true,
  },
  image: {
    type: Image,
    require: true,
  },
  summary: {
    type: String,
    required: true, // 요약 내용
  },
  conclusion: {
    type: String,
    required: true, // 결론
  },
  persona: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ChatLog = mongoose.model('ChatLog', chatLogSchema);
const SummaryLog = mongoose.model('SummaryLog', summaryLogSchema);
const Message = mongoose.model('Message', messageSchema);

module.exports = {
  ChatLog,
  SummaryLog,
  Message
};
