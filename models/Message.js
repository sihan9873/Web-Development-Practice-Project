const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  name: {
    type: String,
    required: [true, '姓名不能为空'],
    trim: true
  },
  message: {
    type: String,
    required: [true, '留言内容不能为空'],
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  reply: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// 索引
messageSchema.index({ createdAt: -1 });
messageSchema.index({ isRead: 1 });

module.exports = mongoose.model('Message', messageSchema);


