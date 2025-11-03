const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('./auth');
const Resume = require('../models/Resume');
const { body, validationResult } = require('express-validator');

// 提交简历
router.post('/', authenticate, [
  body('name').notEmpty().withMessage('姓名不能为空'),
  body('email').isEmail().withMessage('邮箱格式不正确'),
  body('phone').notEmpty().withMessage('电话不能为空'),
  body('position').notEmpty().withMessage('职位不能为空'),
  body('resumeLink').notEmpty().withMessage('简历链接不能为空'),
  body('intro').notEmpty().withMessage('自我介绍不能为空')
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

    const resume = await Resume.create({
      userId: req.user._id,
      ...req.body
    });

    const populatedResume = await Resume.findById(resume._id).populate('userId', 'name email');

    res.status(201).json({
      success: true,
      message: '简历提交成功',
      data: { resume: populatedResume }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '提交失败',
      error: error.message
    });
  }
});

// 获取简历列表
router.get('/', authenticate, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const position = req.query.position || '';
    const status = req.query.status || '';

    const query = {};

    // 普通用户只能查看自己的简历
    if (req.user.role !== 'admin') {
      query.userId = req.user._id;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } }
      ];
    }

    if (position) {
      query.position = position;
    }

    if (status) {
      query.status = status;
    }

    const [resumes, total] = await Promise.all([
      Resume.find(query)
        .populate('userId', 'name email')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Resume.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        resumes,
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
      message: '获取简历列表失败',
      error: error.message
    });
  }
});

// 获取单个简历
router.get('/:id', authenticate, async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id).populate('userId', 'name email');

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: '简历不存在'
      });
    }

    // 普通用户只能查看自己的简历
    if (req.user.role !== 'admin' && resume.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: '无权访问'
      });
    }

    res.json({
      success: true,
      data: { resume }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取简历失败',
      error: error.message
    });
  }
});

// 更新简历状态（仅管理员）
router.patch('/:id/status', authenticate, requireAdmin, [
  body('status').isIn(['pending', 'reviewing', 'accepted', 'rejected']).withMessage('状态值无效'),
  body('notes').optional().trim()
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

    const { status, notes } = req.body;
    const updateData = { status };
    if (notes !== undefined) updateData.notes = notes;

    const resume = await Resume.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'name email');

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: '简历不存在'
      });
    }

    res.json({
      success: true,
      message: '状态更新成功',
      data: { resume }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新失败',
      error: error.message
    });
  }
});

// 删除简历
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: '简历不存在'
      });
    }

    // 普通用户只能删除自己的简历
    if (req.user.role !== 'admin' && resume.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: '无权删除'
      });
    }

    await Resume.findByIdAndDelete(req.params.id);

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

// 获取统计数据（仅管理员）
router.get('/stats/summary', authenticate, requireAdmin, async (req, res) => {
  try {
    const total = await Resume.countDocuments();
    const pending = await Resume.countDocuments({ status: 'pending' });
    const reviewing = await Resume.countDocuments({ status: 'reviewing' });
    const accepted = await Resume.countDocuments({ status: 'accepted' });
    const rejected = await Resume.countDocuments({ status: 'rejected' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await Resume.countDocuments({ createdAt: { $gte: today } });

    const positions = await Resume.aggregate([
      { $group: { _id: '$position', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        total,
        statusCounts: {
          pending,
          reviewing,
          accepted,
          rejected
        },
        todayCount,
        positions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取统计失败',
      error: error.message
    });
  }
});

module.exports = router;


