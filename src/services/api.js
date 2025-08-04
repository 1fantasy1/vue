// 前端本地数据服务 - 不再使用后端 API
// 所有数据都存储在本地 localStorage 中

// 本地存储工具函数
const localStorageAPI = {
  get(key) {
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('读取本地数据失败:', error)
      return null
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error('保存本地数据失败:', error)
      return false
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('删除本地数据失败:', error)
      return false
    }
  }
}

// 模拟 API 响应格式
const createResponse = (data, success = true, message = '') => {
  return Promise.resolve({
    data: {
      success,
      data,
      message
    }
  })
}

// 生成唯一ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 初始化默认数据
const initializeDefaultData = () => {
  // 初始化用户数据
  if (!localStorageAPI.get('users')) {
    const defaultUsers = [
      {
        id: '1',
        username: 'demo_user',
        email: 'demo@example.com',
        role: 'student',
        profile: {
          nickname: '演示用户',
          avatar: '',
          bio: '这是一个演示用户账户',
          skills: ['Vue.js', 'JavaScript', 'CSS'],
          university: '演示大学',
          major: '计算机科学'
        }
      }
    ]
    localStorageAPI.set('users', defaultUsers)
  }

  // 初始化课程数据
  if (!localStorageAPI.get('courses')) {
    const defaultCourses = [
      {
        id: '1',
        title: 'Vue.js 前端开发',
        description: '学习现代前端框架 Vue.js',
        instructor: 'demo_user',
        students: [],
        status: 'active'
      }
    ]
    localStorageAPI.set('courses', defaultCourses)
  }

  // 初始化笔记数据
  if (!localStorageAPI.get('notes')) {
    localStorageAPI.set('notes', [])
  }

  // 初始化项目数据
  if (!localStorageAPI.get('projects')) {
    localStorageAPI.set('projects', [])
  }
}

// API服务类
export class ApiService {
  // 初始化数据
  static initialize() {
    initializeDefaultData()
  }

  // 用户相关API
  static async getUser(userId) {
    const users = localStorageAPI.get('users') || []
    const user = users.find(u => u.id === userId)
    return createResponse(user)
  }

  static async updateUser(userId, userData) {
    const users = localStorageAPI.get('users') || []
    const index = users.findIndex(u => u.id === userId)
    if (index !== -1) {
      users[index] = { ...users[index], ...userData }
      localStorageAPI.set('users', users)
      return createResponse(users[index])
    }
    return createResponse(null, false, '用户不存在')
  }

  // 课程相关API
  static async getCourse(courseId) {
    const courses = localStorageAPI.get('courses') || []
    const course = courses.find(c => c.id === courseId)
    return createResponse(course)
  }

  static async getCourses() {
    const courses = localStorageAPI.get('courses') || []
    return createResponse(courses)
  }

  static async createCourse(courseData) {
    const courses = localStorageAPI.get('courses') || []
    const newCourse = {
      id: generateId(),
      ...courseData,
      createdAt: new Date().toISOString()
    }
    courses.push(newCourse)
    localStorageAPI.set('courses', courses)
    return createResponse(newCourse)
  }

  // 笔记相关API
  static async getNotes(userId) {
    const notes = localStorageAPI.get('notes') || []
    const userNotes = notes.filter(n => n.userId === userId)
    return createResponse(userNotes)
  }

  static async createNote(noteData) {
    const notes = localStorageAPI.get('notes') || []
    const newNote = {
      id: generateId(),
      ...noteData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    notes.push(newNote)
    localStorageAPI.set('notes', notes)
    return createResponse(newNote)
  }

  static async updateNote(noteId, noteData) {
    const notes = localStorageAPI.get('notes') || []
    const index = notes.findIndex(n => n.id === noteId)
    if (index !== -1) {
      notes[index] = { 
        ...notes[index], 
        ...noteData, 
        updatedAt: new Date().toISOString() 
      }
      localStorageAPI.set('notes', notes)
      return createResponse(notes[index])
    }
    return createResponse(null, false, '笔记不存在')
  }

  static async deleteNote(noteId) {
    const notes = localStorageAPI.get('notes') || []
    const filteredNotes = notes.filter(n => n.id !== noteId)
    localStorageAPI.set('notes', filteredNotes)
    return createResponse(true, true, '删除成功')
  }

  // 项目相关API
  static async getProjects() {
    const projects = localStorageAPI.get('projects') || []
    return createResponse(projects)
  }

  static async createProject(projectData) {
    const projects = localStorageAPI.get('projects') || []
    const newProject = {
      id: generateId(),
      ...projectData,
      createdAt: new Date().toISOString()
    }
    projects.push(newProject)
    localStorageAPI.set('projects', projects)
    return createResponse(newProject)
  }

  // 搜索API
  static async search(query) {
    const courses = localStorageAPI.get('courses') || []
    const notes = localStorageAPI.get('notes') || []
    const projects = localStorageAPI.get('projects') || []
    
    const results = {
      courses: courses.filter(c => 
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.description.toLowerCase().includes(query.toLowerCase())
      ),
      notes: notes.filter(n => 
        n.title.toLowerCase().includes(query.toLowerCase()) ||
        n.content.toLowerCase().includes(query.toLowerCase())
      ),
      projects: projects.filter(p => 
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      )
    }
    
    return createResponse(results)
  }
}

// 在应用启动时初始化数据
ApiService.initialize()

// 导出本地存储API工具
export { localStorageAPI }
