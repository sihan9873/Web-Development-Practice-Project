# 多用户后台管理系统部署指南

## 📋 项目概述

这是一个完整的企业官网系统，包含：
- ✅ 前端静态网站（HTML/CSS/JavaScript）
- ✅ 后端 API 服务器（Node.js + Express）
- ✅ 数据库（MongoDB）
- ✅ 用户认证系统（JWT）
- ✅ 多用户账号管理
- ✅ 管理员后台

## 🚀 快速开始

### 前置要求

1. **Node.js** (v14 或更高版本)
   - 下载地址：https://nodejs.org/
   - 验证：`node --version`

2. **MongoDB** (v4.4 或更高版本)
   - 方式一：本地安装 MongoDB
     - Windows: https://www.mongodb.com/try/download/community
     - Mac: `brew install mongodb-community`
     - Linux: `sudo apt-get install mongodb`
   - 方式二：使用 MongoDB Atlas（云数据库，推荐）
     - 注册：https://www.mongodb.com/cloud/atlas
     - 免费套餐可用

3. **Git**（可选，用于版本控制）

### 安装步骤

#### 1. 安装后端依赖

```bash
# 进入项目目录
cd e:\anji\cursor

# 安装 Node.js 依赖包
npm install
```

#### 2. 配置环境变量

创建 `.env` 文件（复制 `.env.example`）：

```bash
# Windows PowerShell
Copy-Item .env.example .env

# 或手动创建 .env 文件
```

编辑 `.env` 文件，填入实际配置：

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/xinghui_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5500
ADMIN_EMAIL=admin@xinghui.com
ADMIN_PASSWORD=admin123456
```

**重要配置说明：**
- `MONGODB_URI`: 
  - 本地 MongoDB: `mongodb://localhost:27017/xinghui_db`
  - MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/xinghui_db`
- `JWT_SECRET`: 用于加密 token，生产环境请使用复杂随机字符串
- `CORS_ORIGIN`: 前端地址，如果用 VS Code Live Server 通常是 `http://localhost:5500`

#### 3. 启动 MongoDB（如果使用本地数据库）

```bash
# Windows
# 通常 MongoDB 会自动启动服务
# 或手动启动：
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
# 或
mongod
```

#### 4. 启动后端服务器

```bash
# 开发模式（自动重启）
npm run dev

# 或生产模式
npm start
```

看到以下输出表示启动成功：
```
✅ MongoDB 连接成功
✅ 默认管理员账号已创建
   邮箱: admin@xinghui.com
   密码: admin123456
🚀 服务器运行在 http://localhost:3000
```

#### 5. 启动前端（使用本地服务器）

**方式一：使用 VS Code Live Server**
1. 在 VS Code 中安装 "Live Server" 扩展
2. 右键 `index.html` -> "Open with Live Server"

**方式二：使用 Python**
```bash
# Python 3
python -m http.server 8000

# 然后访问 http://localhost:8000
```

**方式三：使用 Node.js http-server**
```bash
npx http-server -p 5500
```

## 📁 项目结构

```
.
├── server.js              # 后端服务器入口
├── package.json           # Node.js 依赖配置
├── .env                   # 环境变量（需要创建）
├── .env.example          # 环境变量模板
├── models/               # 数据库模型
│   ├── User.js          # 用户模型
│   ├── Resume.js        # 简历模型
│   └── Message.js       # 留言模型
├── routes/               # API 路由
│   ├── auth.js          # 认证路由（登录/注册）
│   ├── users.js         # 用户管理路由
│   ├── resumes.js       # 简历管理路由
│   └── messages.js      # 留言管理路由
├── index.html            # 首页
├── login.html            # 登录页面
├── register.html         # 注册页面
├── admin.html            # 管理后台
├── assets/
│   ├── css/
│   │   └── styles.css   # 样式文件
│   └── js/
│       ├── api.js       # API 客户端
│       ├── main.js       # 前端主要逻辑
│       └── admin.js      # 管理后台逻辑
└── README.md            # 说明文档
```

## 🔐 默认账号

系统首次启动会自动创建管理员账号：

- **邮箱**: `admin@xinghui.com`
- **密码**: `admin123456`

⚠️ **重要**: 生产环境部署前请务必修改默认密码！

## 📡 API 接口说明

### 认证接口

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户信息

### 简历接口

- `POST /api/resumes` - 提交简历（需登录）
- `GET /api/resumes` - 获取简历列表
- `GET /api/resumes/:id` - 获取单个简历
- `PATCH /api/resumes/:id/status` - 更新简历状态（管理员）
- `DELETE /api/resumes/:id` - 删除简历
- `GET /api/resumes/stats/summary` - 获取统计数据（管理员）

### 留言接口

- `POST /api/messages` - 提交留言
- `GET /api/messages` - 获取留言列表（需登录）
- `PATCH /api/messages/:id` - 更新留言（管理员）
- `DELETE /api/messages/:id` - 删除留言

### 用户管理接口（仅管理员）

- `GET /api/users` - 获取用户列表
- `GET /api/users/:id` - 获取用户信息
- `PUT /api/users/:id` - 更新用户信息
- `DELETE /api/users/:id` - 删除用户

## 🔧 开发模式

### 后端开发

```bash
# 使用 nodemon 自动重启
npm run dev
```

### 前端开发

修改 `assets/js/api.js` 中的 `API_BASE_URL`：

```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

## 🌐 生产环境部署

### 1. 服务器部署

#### 使用 PM2（推荐）

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start server.js --name xinghui-api

# 查看状态
pm2 status

# 查看日志
pm2 logs xinghui-api

# 设置开机自启
pm2 startup
pm2 save
```

#### 使用 Docker

创建 `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

### 2. 前端部署

前端可以部署到任何静态文件托管服务：
- Vercel
- Netlify
- GitHub Pages
- 自己的 Web 服务器（Nginx/Apache）

**重要**: 部署前修改 `assets/js/api.js` 中的 API 地址：

```javascript
const API_BASE_URL = 'https://your-api-domain.com/api';
```

### 3. Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /var/www/xinghui-frontend;
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔒 安全建议

1. **修改默认密码**: 首次部署后立即修改管理员密码
2. **使用 HTTPS**: 生产环境必须使用 HTTPS
3. **强密码策略**: 设置复杂的 JWT_SECRET
4. **数据库安全**: 使用 MongoDB Atlas 时启用 IP 白名单
5. **CORS 配置**: 限制允许的前端域名
6. **环境变量**: 不要在代码中硬编码敏感信息

## 🐛 常见问题

### MongoDB 连接失败

- 检查 MongoDB 服务是否启动
- 验证 `MONGODB_URI` 配置是否正确
- MongoDB Atlas 用户需要检查网络访问权限

### CORS 错误

- 检查 `.env` 中的 `CORS_ORIGIN` 是否匹配前端地址
- 确保前端使用正确的 API 地址

### 端口被占用

- 修改 `.env` 中的 `PORT` 值
- 或停止占用端口的进程

### 无法登录

- 检查后端服务是否正常运行
- 查看浏览器控制台网络请求
- 检查后端日志输出

## 📞 技术支持

如遇到问题，请检查：
1. Node.js 和 MongoDB 版本是否符合要求
2. 所有依赖是否已正确安装
3. 环境变量配置是否正确
4. 后端服务日志输出

## 📝 更新日志

### v1.0.0
- ✅ 用户注册/登录系统
- ✅ JWT 认证
- ✅ 简历投递与管理
- ✅ 留言系统
- ✅ 管理员后台
- ✅ 多用户账号管理


