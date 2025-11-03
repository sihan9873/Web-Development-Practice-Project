const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('./auth');
const Message = require('../models/Message');
const { body, validationResult } = require('express-validator');

// 提交留言
router.post('/', [
  body('name').notEmpty().withMessage('姓名不能为空'),
  body('message').notEmpty().withMessage('留言内容不能为空')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入验证失败',
        errors: errors.array()
      });
    }

    const { name, message, email } = req.body;
    const userId = req.headers.authorization ? req.user?._id : null;

    const newMessage = await Message.create({
      userId: userId || null,
      name,
      message,
      email: email || ''
    });

    res.status(201).json({
      success: true,
      message: '留言提交成功',
      data: { message: newMessage }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '提交失败',
      error: error.message
    });
  }
});

// 获取留言列表
router.get('/', authenticate, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = {};

    // 普通用户只能查看自己的留言
    if (req.user.role !== 'admin') {
      query.userId = req.user._id;
    }

    const [messages, total] = await Promise.all([
      Message.find(query)
        .populate('userId', 'name email')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Message.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        messages,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取留言列表失败',
      error: error.message
    });
  }
});

// 更新留言状态（仅管理员）
router.patch('/:id', authenticate, requireAdmin, [
  body('isRead').optional().isBoolean(),
  body('reply').optional().trim()
], async (req, res) => {
  try {
    const { isRead, reply } = req.body;
    const updateData = {};
    if (isRead !== undefined) updateData.isRead = isRead;
    if (reply !== undefined) updateData.reply = reply;

    const message = await Message.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'name email');

    if (!message) {
      return res.status(404).json({
        success: false,
        message: '留言不存在'
      });
    }

    res.json({
      success: true,
      message: '更新成功',
      data: { message }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新失败',
      error: error.message
    });
  }
});

// 删除留言
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: '留言不存在'
      });
    }

    // 普通用户只能删除自己的留言
    if (req.user.role !== 'admin' && (!message.userId || message.userId.toString() !== req.user._id.toString())) {
      return res.status(403).json({
        success: false,
        message: '无权删除'
      });
    }

    await Message.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: '删除成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '删除失败',
      error: error.message
    });
  }
});

module.exports = router;


