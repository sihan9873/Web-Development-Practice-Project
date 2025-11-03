# 🔧 MongoDB 连接失败解决方案

## 错误信息

```
MongooseServerSelectionError: connect ECONNREFUSED ::1:27017
```

这个错误表示：**MongoDB 服务没有运行**。

---

## ✅ 解决方案

### 方案一：启动本地 MongoDB（如果已安装）

#### Windows 系统

**方法 1：使用服务管理器**
1. 按 `Win + R`，输入 `services.msc`，回车
2. 找到 `MongoDB` 服务
3. 右键 → 启动

**方法 2：使用命令行**
```powershell
# 以管理员身份运行 PowerShell，然后执行：
net start MongoDB
```

**方法 3：手动启动**
```powershell
# 找到 MongoDB 安装目录（通常在）
# C:\Program Files\MongoDB\Server\7.0\bin\

# 运行 mongod.exe
mongod --dbpath "C:\data\db"
```

#### Mac 系统
```bash
# 使用 Homebrew
brew services start mongodb-community

# 或手动启动
mongod --config /usr/local/etc/mongod.conf
```

#### Linux 系统
```bash
# 使用 systemd
sudo systemctl start mongod

# 或
sudo service mongod start
```

---

### 方案二：使用 MongoDB Atlas（云数据库，推荐新手）

**优点：**
- ✅ 无需本地安装 MongoDB
- ✅ 免费套餐可用
- ✅ 自动备份
- ✅ 无需维护

**步骤：**

1. **注册账号**
   - 访问：https://www.mongodb.com/cloud/atlas/register
   - 使用邮箱注册（免费）

2. **创建集群**
   - 登录后点击 "Build a Database"
   - 选择免费套餐（M0）
   - 选择云服务商和地区（选择离你最近的）
   - 点击 "Create"

3. **配置网络访问**
   - 在 "Network Access" 中
   - 点击 "Add IP Address"
   - 选择 "Allow Access from Anywhere"（开发环境）
   - 或添加你的 IP 地址（生产环境）

4. **获取连接字符串**
   - 点击 "Database" → "Connect"
   - 选择 "Connect your application"
   - 复制连接字符串，类似：
     ```
     mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/xinghui_db
     ```

5. **配置项目**
   - 在项目根目录创建 `.env` 文件（如果没有）
   - 添加：
     ```env
     MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/xinghui_db
     ```
   - 将 `username`、`password`、`cluster0.xxxxx` 替换为你的实际值

---

### 方案三：检查 MongoDB 是否已安装

**Windows:**
```powershell
# 检查是否安装
mongod --version

# 如果未安装，下载安装：
# https://www.mongodb.com/try/download/community
```

**Mac:**
```bash
# 检查是否安装
mongod --version

# 如果未安装，使用 Homebrew：
brew tap mongodb/brew
brew install mongodb-community
```

**Linux:**
```bash
# 检查是否安装
mongod --version

# 如果未安装，根据你的发行版安装
# Ubuntu/Debian:
sudo apt-get install mongodb

# CentOS/RHEL:
sudo yum install mongodb
```

---

## 🔍 验证连接

### 方法 1：使用命令行测试

```bash
# 启动 MongoDB Shell
mongosh

# 如果成功，会看到：
# Current Mongosh Log ID: ...
# Connecting to: mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000
```

### 方法 2：测试服务器连接

1. 启动后端服务器：`npm start`
2. 在浏览器访问：`http://localhost:3000/api/health`
3. 如果看到 `{"status":"ok","message":"服务器运行正常"}`，说明服务器运行正常
4. 查看控制台，应该看到 `✅ MongoDB 连接成功`

---

## 📝 完整配置示例

创建 `.env` 文件（项目根目录）：

```env
# 本地 MongoDB
MONGODB_URI=mongodb://localhost:27017/xinghui_db

# 或 MongoDB Atlas（云数据库）
# MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/xinghui_db

PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
CORS_ORIGIN=*
ADMIN_EMAIL=admin@xinghui.com
ADMIN_PASSWORD=admin123456
```

---

## ⚠️ 常见问题

### 问题 1: 端口被占用

**错误：** `Port 27017 is already in use`

**解决：**
```powershell
# 查找占用端口的进程
netstat -ano | findstr :27017

# 结束进程（替换 PID）
taskkill /PID <PID> /F
```

### 问题 2: 权限不足

**错误：** `Access denied`

**解决：**
- Windows: 以管理员身份运行 PowerShell
- Mac/Linux: 使用 `sudo`

### 问题 3: 数据目录不存在

**错误：** `Data directory /data/db not found`

**解决：**
```powershell
# Windows: 创建数据目录
mkdir C:\data\db

# 启动时指定路径
mongod --dbpath "C:\data\db"
```

---

## 🚀 快速开始（推荐）

**最简单的方法：使用 MongoDB Atlas**

1. 注册账号：https://www.mongodb.com/cloud/atlas/register
2. 创建免费集群
3. 获取连接字符串
4. 配置到 `.env` 文件
5. 重启服务器：`npm start`

**无需本地安装 MongoDB！**

---

## 💡 提示

- 开发环境推荐使用 MongoDB Atlas（免费、简单）
- 生产环境可以选择本地 MongoDB 或 MongoDB Atlas
- 如果只是学习，MongoDB Atlas 完全够用

---

## 📞 需要帮助？

如果以上方法都无法解决：

1. 检查 MongoDB 是否已安装
2. 检查 MongoDB 服务是否启动
3. 检查防火墙设置
4. 查看 MongoDB 日志文件
5. 尝试使用 MongoDB Atlas（最简单）


