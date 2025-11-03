# "Failed to fetch" 错误排查指南

## 🔍 问题原因

"Failed to fetch" 错误通常表示前端无法连接到后端 API 服务器。

## ✅ 解决步骤

### 1. 检查后端服务器是否启动

**Windows PowerShell:**
```powershell
# 进入项目目录
cd e:\anji\cursor

# 检查是否已安装依赖
npm install

# 启动后端服务器
npm start
```

**预期输出：**
```
✅ MongoDB 连接成功
✅ 默认管理员账号已创建
🚀 服务器运行在 http://localhost:3000
```

### 2. 检查 MongoDB 是否运行

**本地 MongoDB:**
```powershell
# Windows - 检查 MongoDB 服务
Get-Service MongoDB

# 如果未运行，启动服务
net start MongoDB
```

**或使用 MongoDB Atlas（云数据库）:**
- 确保 `.env` 文件中的 `MONGODB_URI` 配置正确
- 检查 Atlas 网络访问权限是否允许你的 IP

### 3. 检查端口是否被占用

```powershell
# 检查 3000 端口是否被占用
netstat -ano | findstr :3000

# 如果被占用，可以：
# 1. 关闭占用端口的程序
# 2. 或修改 .env 文件中的 PORT 值
```

### 4. 检查环境变量配置

确保项目根目录有 `.env` 文件（复制自 `env.example`）：

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/xinghui_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
CORS_ORIGIN=*
ADMIN_EMAIL=admin@xinghui.com
ADMIN_PASSWORD=admin123456
```

### 5. 检查浏览器控制台

1. 打开浏览器开发者工具（F12）
2. 切换到 "Network"（网络）标签页
3. 尝试注册，查看失败请求的详细信息
4. 查看 "Console"（控制台）标签页的错误信息

### 6. 测试 API 连接

在浏览器中直接访问：
```
http://localhost:3000/api/health
```

应该返回：
```json
{
  "status": "ok",
  "message": "服务器运行正常"
}
```

## 🛠️ 常见问题

### 问题 1: MongoDB 连接失败

**错误信息：**
```
❌ MongoDB 连接失败
```

**解决方案：**
- 确保 MongoDB 服务已启动
- 检查 MongoDB URI 配置是否正确
- 如果使用 MongoDB Atlas，检查网络访问权限

### 问题 2: 端口被占用

**错误信息：**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**解决方案：**
```powershell
# 查找占用端口的进程
netstat -ano | findstr :3000

# 结束进程（替换 PID 为实际进程 ID）
taskkill /PID <PID> /F

# 或修改端口号
# 在 .env 文件中设置 PORT=3001
```

### 问题 3: CORS 错误

**错误信息：**
```
Access to fetch at 'http://localhost:3000/api/...' from origin '...' has been blocked by CORS policy
```

**解决方案：**
- 已更新 `server.js`，默认允许所有来源（开发环境）
- 生产环境应在 `.env` 中设置 `CORS_ORIGIN`

### 问题 4: 模块未找到

**错误信息：**
```
Cannot find module 'express'
```

**解决方案：**
```powershell
# 重新安装依赖
npm install
```

## 📋 完整启动检查清单

- [ ] Node.js 已安装（`node --version`）
- [ ] MongoDB 已安装并运行（或使用 MongoDB Atlas）
- [ ] 项目依赖已安装（`npm install`）
- [ ] `.env` 文件已创建并配置正确
- [ ] 后端服务器已启动（`npm start`）
- [ ] 浏览器可以访问 `http://localhost:3000/api/health`
- [ ] 前端页面使用正确的 API 地址（`http://localhost:3000/api`）

## 🚀 快速启动命令

```powershell
# 1. 安装依赖（首次运行）
npm install

# 2. 启动后端服务器
npm start

# 3. 在另一个终端窗口启动前端（使用 VS Code Live Server 或其他静态服务器）
# 或直接在浏览器打开 index.html
```

## 💡 提示

- 后端服务器必须保持运行状态
- 如果修改了 `.env` 文件，需要重启后端服务器
- 检查浏览器控制台的详细错误信息
- 确保防火墙没有阻止端口 3000

## 📞 需要帮助？

如果以上步骤都无法解决问题，请检查：
1. Node.js 版本（推荐 v14+）
2. MongoDB 版本（推荐 v4.4+）
3. 浏览器控制台的完整错误信息
4. 后端服务器的完整日志输出

