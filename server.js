const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

const app = express();

// 中间件
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // 允许所有来源（开发环境）
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 数据库连接（改进：允许服务器在 MongoDB 未连接时也能启动）
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/xinghui_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB 连接成功');
  // 初始化默认管理员
  initializeAdmin();
})
.catch((err) => {
  console.error('❌ MongoDB 连接失败:', err.message);
  console.log('');
  console.log('⚠️  提示：');
  console.log('   1. 如果使用本地 MongoDB，请确保 MongoDB 服务已启动');
  console.log('      Windows: net start MongoDB');
  console.log('      或从服务管理器启动 MongoDB 服务');
  console.log('');
  console.log('   2. 如果使用 MongoDB Atlas，请检查 .env 文件中的 MONGODB_URI');
  console.log('');
  console.log('   3. 服务器将继续运行，但数据库相关功能将不可用');
  console.log('   如需使用完整功能，请先解决 MongoDB 连接问题');
  console.log('');
  // 不退出进程，允许服务器继续运行（但会提示错误）
});

// 导入路由
const { router: authRoutes } = require('./routes/auth');
const userRoutes = require('./routes/users');
const resumeRoutes = require('./routes/resumes');
const messageRoutes = require('./routes/messages');
const debugRoutes = require('./routes/debug');

// 使用路由
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/messages', messageRoutes);

// 调试路由（仅开发环境）
if (process.env.NODE_ENV !== 'production') {
  app.use('/api/debug', debugRoutes);
  console.log('🔍 调试接口已启用');
  console.log('   查看用户: http://localhost:3000/api/debug/users');
  console.log('   查看简历: http://localhost:3000/api/debug/resumes');
  console.log('   查看留言: http://localhost:3000/api/debug/messages');
  console.log('   统计数据: http://localhost:3000/api/debug/stats');
}

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '服务器运行正常' });
});

// 初始化默认管理员
async function initializeAdmin() {
  const User = require('./models/User');
  const bcrypt = require('bcryptjs');
  
  try {
    // 获取管理员邮箱和密码
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@xinghui.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456';
    
    // 验证邮箱格式
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(adminEmail)) {
      console.error('❌ 管理员邮箱格式不正确:', adminEmail);
      console.log('   请在 .env 文件中设置正确的 ADMIN_EMAIL（例如: admin@xinghui.com）');
      return;
    }
    
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      // 注意：不需要手动加密，User 模型的 pre-save 钩子会自动加密
      await User.create({
        email: adminEmail,
        password: adminPassword,  // 传入明文密码，模型会自动加密
        name: '系统管理员',
        role: 'admin',
        isActive: true
      });
      console.log('✅ 默认管理员账号已创建');
      console.log(`   邮箱: ${adminEmail}`);
      console.log(`   密码: ${adminPassword}`);
    } else {
      console.log('ℹ️  管理员账号已存在，跳过创建');
    }
  } catch (error) {
    console.error('❌ 初始化管理员失败:', error.message);
    if (error.errors && error.errors.email) {
      console.error('   邮箱验证错误:', error.errors.email.message);
      console.log('   提示：请检查 .env 文件中的 ADMIN_EMAIL 格式是否正确');
    }
  }
}

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
  console.log(`📝 API 文档: http://localhost:${PORT}/api/health`);
});

