# 🔍 数据库查看指南

## 方法一：浏览器查看（最简单）

启动后端服务器后，在浏览器中访问以下地址：

### 查看所有用户
```
http://localhost:3000/api/debug/users
```

### 查看所有简历
```
http://localhost:3000/api/debug/resumes
```

### 查看所有留言
```
http://localhost:3000/api/debug/messages
```

### 查看统计数据
```
http://localhost:3000/api/debug/stats
```

**提示：** 可以安装浏览器扩展（如 JSON Viewer）让 JSON 显示更美观。

---

## 方法二：MongoDB Compass（图形界面，推荐）

### 安装步骤

1. **下载 MongoDB Compass**
   - 访问：https://www.mongodb.com/try/download/compass
   - 下载适合你系统的版本并安装

2. **连接数据库**

   打开 Compass，输入连接字符串：
   ```
   mongodb://localhost:27017
   ```

   或者如果使用 MongoDB Atlas：
   ```
   mongodb+srv://username:password@cluster.mongodb.net
   ```

3. **查看数据**

   - 左侧显示所有数据库
   - 点击 `xinghui_db` 数据库
   - 看到三个集合：
     - `users` - 用户数据
     - `resumes` - 简历数据
     - `messages` - 留言数据
   - 点击集合名称查看数据

### 常用操作

- **查看文档**：点击集合名称
- **搜索过滤**：使用顶部搜索框
- **添加文档**：点击 "Insert Document"
- **编辑文档**：点击文档，然后点击 "Update"

---

## 方法三：命令行（MongoDB Shell）

### 启动 MongoDB Shell

```bash
mongosh
```

### 切换到数据库

```bash
use xinghui_db
```

### 查看所有集合

```bash
show collections
```

### 查看 users 集合

```bash
# 查看所有用户
db.users.find().pretty()

# 查看特定用户（按邮箱）
db.users.findOne({ email: "admin@xinghui.com" })

# 查看用户数量
db.users.countDocuments()

# 只显示部分字段
db.users.find({}, { name: 1, email: 1, role: 1 }).pretty()
```

### 查看 resumes 集合

```bash
# 查看所有简历
db.resumes.find().pretty()

# 查看待审核的简历
db.resumes.find({ status: "pending" }).pretty()

# 查看特定职位的简历
db.resumes.find({ position: "前端工程师" }).pretty()

# 统计数量
db.resumes.countDocuments()
```

### 查看 messages 集合

```bash
# 查看所有留言
db.messages.find().pretty()

# 查看未读留言
db.messages.find({ isRead: false }).pretty()

# 按时间排序
db.messages.find().sort({ createdAt: -1 }).pretty()
```

### 其他有用的命令

```bash
# 查看数据库统计信息
db.stats()

# 删除所有数据（谨慎使用！）
db.users.deleteMany({})
db.resumes.deleteMany({})
db.messages.deleteMany({})

# 更新文档
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { name: "新名字" } }
)
```

---

## 方法四：在代码中查看

### 创建一个简单的查看脚本

创建文件 `view-db.js`：

```javascript
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Resume = require('./models/Resume');
const Message = require('./models/Message');

async function viewDatabase() {
  try {
    // 连接数据库
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/xinghui_db');
    console.log('✅ 数据库连接成功\n');

    // 查看用户
    const users = await User.find().select('-password');
    console.log('📊 用户数据：');
    console.log(`   总数: ${users.length}`);
    users.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - ${user.role}`);
    });
    console.log();

    // 查看简历
    const resumes = await Resume.find();
    console.log('📄 简历数据：');
    console.log(`   总数: ${resumes.length}`);
    resumes.forEach(resume => {
      console.log(`   - ${resume.name} - ${resume.position} - ${resume.status}`);
    });
    console.log();

    // 查看留言
    const messages = await Message.find();
    console.log('💬 留言数据：');
    console.log(`   总数: ${messages.length}`);
    messages.forEach(message => {
      console.log(`   - ${message.name}: ${message.message.substring(0, 30)}...`);
    });

    // 关闭连接
    await mongoose.connection.close();
    console.log('\n✅ 查看完成');
  } catch (error) {
    console.error('❌ 错误:', error);
    process.exit(1);
  }
}

viewDatabase();
```

运行：
```bash
node view-db.js
```

---

## 📊 数据结构说明

### users 集合结构

```javascript
{
  _id: ObjectId("..."),           // MongoDB 自动生成的唯一 ID
  email: "user@example.com",      // 邮箱（唯一）
  password: "$2a$10$...",        // 加密后的密码
  name: "张三",                   // 姓名
  phone: "13800138000",          // 电话（可选）
  role: "user",                   // 角色：user 或 admin
  isActive: true,                 // 是否激活
  createdAt: ISODate("..."),      // 创建时间
  updatedAt: ISODate("...")      // 更新时间
}
```

### resumes 集合结构

```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),        // 关联的用户 ID
  name: "李四",
  email: "lisi@example.com",
  phone: "13900139000",
  position: "前端工程师",         // 职位
  resumeLink: "https://...",      // 简历链接
  intro: "我有3年工作经验...",   // 自我介绍
  status: "pending",              // 状态：pending/reviewing/accepted/rejected
  notes: "",                      // 备注（管理员添加）
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

### messages 集合结构

```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),       // 关联的用户 ID（可选）
  name: "王五",
  email: "wangwu@example.com",   // 可选
  message: "留言内容...",
  isRead: false,                 // 是否已读
  reply: "",                     // 回复内容（管理员添加）
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

---

## 💡 实用技巧

### 1. 格式化 JSON 输出

在浏览器中安装 JSON Viewer 扩展，让 JSON 显示更美观。

### 2. 使用 Postman 测试 API

下载 Postman：https://www.postman.com/

可以：
- 测试所有 API 接口
- 查看请求和响应
- 保存常用的请求

### 3. 使用 VS Code 扩展

安装 "MongoDB for VS Code" 扩展，可以直接在 VS Code 中查看数据库。

---

## ⚠️ 注意事项

1. **生产环境**：调试接口默认只在开发环境启用
2. **密码字段**：查看用户时自动排除密码字段
3. **数据安全**：不要在生产环境暴露这些调试接口
4. **备份数据**：删除数据前记得备份

---

## 🎯 快速参考

| 操作 | 浏览器 | MongoDB Compass | 命令行 |
|------|--------|-----------------|--------|
| 查看用户 | `/api/debug/users` | 点击 `users` 集合 | `db.users.find().pretty()` |
| 查看简历 | `/api/debug/resumes` | 点击 `resumes` 集合 | `db.resumes.find().pretty()` |
| 查看留言 | `/api/debug/messages` | 点击 `messages` 集合 | `db.messages.find().pretty()` |
| 统计数据 | `/api/debug/stats` | 查看集合统计 | `db.stats()` |

选择最适合你的方法！推荐新手使用 MongoDB Compass，界面友好，操作简单。


