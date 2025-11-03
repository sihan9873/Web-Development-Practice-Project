const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Resume = require('../models/Resume');
const Message = require('../models/Message');

// 调试接口：查看所有用户（仅开发环境）
router.get('/debug/users', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // 排除密码字段
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '查询失败',
      error: error.message
    });
  }
});

// 调试接口：查看所有简历
router.get('/debug/resumes', async (req, res) => {
  try {
    const resumes = await Resume.find().populate('userId', 'name email');
    res.json({
      success: true,
      count: resumes.length,
      data: resumes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '查询失败',
      error: error.message
    });
  }
});

// 调试接口：查看所有留言
router.get('/debug/messages', async (req, res) => {
  try {
    const messages = await Message.find().populate('userId', 'name email');
    res.json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '查询失败',
      error: error.message
    });
  }
});

// 调试接口：数据库统计
router.get('/debug/stats', async (req, res) => {
  try {
    const [userCount, resumeCount, messageCount] = await Promise.all([
      User.countDocuments(),
      Resume.countDocuments(),
      Message.countDocuments()
    ]);

    res.json({
      success: true,
      stats: {
        users: userCount,
        resumes: resumeCount,
        messages: messageCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '查询失败',
      error: error.message
    });
  }
});

module.exports = router;


