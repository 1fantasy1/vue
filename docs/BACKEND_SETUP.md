# 后端API服务器
这是一个简单的Node.js + Express + MongoDB后端服务器示例

## 快速开始

1. 创建后端项目文件夹：
```bash
mkdir vue-backend
cd vue-backend
```

2. 初始化项目：
```bash
npm init -y
```

3. 安装依赖：
```bash
npm install express mongoose cors helmet morgan bcryptjs jsonwebtoken dotenv
npm install -D nodemon
```

4. 创建基本文件结构：
```
backend/
├── package.json
├── .env
├── server.js
├── config/
│   └── database.js
├── models/
│   ├── User.js
│   ├── Course.js
│   ├── Note.js
│   └── Project.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── courses.js
│   ├── notes.js
│   └── projects.js
├── middleware/
│   └── auth.js
└── controllers/
    ├── authController.js
    ├── userController.js
    ├── courseController.js
    ├── noteController.js
    └── projectController.js
```

## 环境变量配置 (.env)
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/vue-app
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

## 主服务器文件 (server.js)
```javascript
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
require('dotenv').config()

const app = express()

// 中间件
app.use(helmet())
app.use(cors())
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 数据库连接
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// 路由
app.use('/api/auth', require('./routes/auth'))
app.use('/api/users', require('./routes/users'))
app.use('/api/courses', require('./routes/courses'))
app.use('/api/notes', require('./routes/notes'))
app.use('/api/projects', require('./routes/projects'))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`)
})
```

## 数据库模型示例

### 用户模型 (models/User.js)
```javascript
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profile: {
    firstName: String,
    lastName: String,
    avatar: String,
    bio: String
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student'
  }
}, {
  timestamps: true
})

// 密码加密
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

module.exports = mongoose.model('User', userSchema)
```

### 课程模型 (models/Course.js)
```javascript
const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  materials: [{
    title: String,
    type: {
      type: String,
      enum: ['video', 'document', 'link']
    },
    url: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Course', courseSchema)
```

## API路由示例

### 认证路由 (routes/auth.js)
```javascript
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const router = express.Router()

// 注册
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body
    
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    })
    
    if (existingUser) {
      return res.status(400).json({ 
        message: '用户名或邮箱已存在' 
      })
    }

    const user = new User({ username, email, password })
    await user.save()

    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      message: '注册成功',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    })
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message })
  }
})

// 登录
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    
    const user = await User.findOne({ 
      $or: [{ email: username }, { username }] 
    })
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: '用户名或密码错误' })
    }

    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      message: '登录成功',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    })
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message })
  }
})

module.exports = router
```

## 启动脚本 (package.json)
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

## 使用方法

1. 确保MongoDB已安装并运行
2. 配置.env文件
3. 运行 `npm run dev` 启动开发服务器
4. API将在 http://localhost:3000 可用
