# API 整合完成指南

## 🎉 API 整合状态

您的Vue项目已成功整合了后端API服务！现在可以在本地数据和远程API之间自由切换。

## 📋 整合内容

### 新增文件

1. **`src/services/httpClient.js`** - HTTP客户端配置
2. **`src/services/remoteApi.js`** - 完整的远程API服务类
3. **`src/config/index.js`** - 应用配置文件
4. **`src/composables/useApiData.js`** - 统一的API数据管理Composable
5. **`src/components/APITestTool.vue`** - API测试工具组件

### 更新文件

1. **`src/services/api.js`** - 支持本地/远程数据切换
2. **`src/views/Home.vue`** - 使用真实API数据
3. **`src/views/APITest.vue`** - 整合API测试工具

## 🚀 使用方法

### 1. 数据源切换

在 `src/config/index.js` 中修改配置：

```javascript
export const config = {
  api: {
    // 设置为 false 使用远程API，设置为 true 使用本地数据
    useLocalData: false, // 当前设置为使用远程API
    baseURL: 'http://localhost:8001',
    timeout: 30000
  }
}
```

### 2. API测试

访问 `http://localhost:5173/api-test` 进行API连接测试。

### 3. 可用的API功能

#### 认证相关
- `登录` - `POST /auth/login`
- `注册` - `POST /auth/register`
- `用户信息` - `GET /users/me`

#### 学生和项目
- `学生列表` - `GET /students/`
- `项目列表` - `GET /projects/`
- `项目推荐` - `GET /recommend/projects/{student_id}`
- `学生匹配` - `GET /projects/{project_id}/match-students`

#### 知识管理
- `笔记管理` - `GET/POST/PUT/DELETE /notes/`
- `知识库` - `GET/POST/PUT/DELETE /knowledge-bases/`
- `文档上传` - `POST /knowledge-bases/{kb_id}/documents/`

#### AI功能
- `智能问答` - `POST /ai/qa`
- `语义搜索` - `POST /search/semantic`
- `网络搜索` - `POST /ai/web-search`

#### 其他功能
- `工作台概览` - `GET /dashboard/summary`
- `聊天室` - `GET/POST /chatrooms/`
- `论坛` - `GET/POST /forum/topics/`
- `随手记录` - `GET/POST /daily-records/`

## 🛠️ 开发指南

### 使用新的Composable

```vue
<script>
import { useStudentsData, useProjectsData, useNotesData } from '@/composables/useApiData.js'

export default {
  setup() {
    const { students, fetchStudents, loading, error } = useStudentsData()
    const { projects, fetchProjects } = useProjectsData()
    const { notes, createNote } = useNotesData()

    onMounted(async () => {
      await fetchStudents()
      await fetchProjects()
    })

    return {
      students,
      projects,
      notes,
      loading,
      error,
      createNote
    }
  }
}
</script>
```

### 直接使用API服务

```javascript
import { ApiService } from '@/services/api.js'
import remoteApiService from '@/services/remoteApi.js'

// 使用统一的ApiService（会根据配置自动选择数据源）
const response = await ApiService.getStudents()

// 或直接使用远程API服务
const students = await remoteApiService.students.getAllStudents()
```

## 🔧 配置说明

### 环境配置

- **开发环境**: 默认连接到 `http://localhost:8001`
- **本地数据**: 当API服务不可用时自动使用本地数据
- **错误处理**: 内置重试机制和错误提示

### 功能开关

在配置文件中可以控制各种功能：

```javascript
features: {
  aiChat: true,           // AI聊天功能
  knowledgeBase: true,    // 知识库功能
  projectRecommendation: true, // 项目推荐
  studentMatching: true,  // 学生匹配
  forum: true,           // 论坛功能
  chatRooms: true,       // 聊天室
  mobileDebug: true      // 移动端调试
}
```

## ⚡ 性能优化

1. **请求缓存**: HTTP客户端支持响应缓存
2. **错误重试**: 自动重试失败的请求
3. **加载状态**: 所有Composable都提供loading状态
4. **错误处理**: 统一的错误处理和用户提示

## 🐛 故障排除

### 常见问题

1. **API连接失败**
   - 检查后端服务是否在 `localhost:8001` 运行
   - 查看浏览器控制台的网络错误
   - 使用API测试工具检查连接状态

2. **CORS错误**
   - 确保后端配置了正确的CORS设置
   - 检查请求头配置

3. **认证问题**
   - 检查localStorage中的access_token
   - 确认用户登录状态

### 调试工具

1. **API测试页面**: `/api-test`
2. **浏览器控制台**: 查看API请求日志
3. **网络面板**: 检查HTTP请求和响应

## 📝 后续开发

1. **添加新的API端点**: 在 `remoteApi.js` 中添加对应的方法
2. **创建新的Composable**: 参考 `useApiData.js` 的模式
3. **扩展配置选项**: 在 `config/index.js` 中添加新配置

## 🎯 测试建议

1. 先使用API测试工具验证连接
2. 检查首页数据是否正确加载
3. 测试数据源切换功能
4. 验证错误处理机制

---

现在您的Vue应用已经完全整合了后端API，可以访问 http://localhost:5173 查看效果！
