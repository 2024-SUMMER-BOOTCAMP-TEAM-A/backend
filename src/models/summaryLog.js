const mongoose = require('mongoose');

const summaryLogSchema = new mongoose.Schema({
  chatLogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatLog',
    required: true,
  },
  summary: {
    type: String,
    required: true, //요약 내용
  },
  conclusion: {
    type: String,
    required: true, //결론
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('SummaryLog', summaryLogSchema);