const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, '姓名不能为空'],
    trim: true
  },
  email: {
    type: String,
    required: [true, '邮箱不能为空'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, '电话不能为空'],
    trim: true
  },
  position: {
    type: String,
    required: [true, '职位不能为空'],
    trim: true
  },
  resumeLink: {
    type: String,
    required: [true, '简历链接不能为空'],
    trim: true
  },
  intro: {
    type: String,
    required: [true, '自我介绍不能为空'],
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'accepted', 'rejected'],
    default: 'pending'
  },
  notes: {
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
resumeSchema.index({ userId: 1, createdAt: -1 });
resumeSchema.index({ position: 1 });
resumeSchema.index({ status: 1 });

module.exports = mongoose.model('Resume', resumeSchema);


