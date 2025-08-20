# 前端创建课程笔记API调用文档

## 概述

本文档详细说明前端如何向后端发送创建课程笔记的请求，包括请求格式、参数说明和具体示例。

## API端点

```
POST /notes/
```

## 请求头

```http
Content-Type: multipart/form-data
Authorization: Bearer {access_token}
```

## 请求体格式

### 1. 包含文件上传的请求（FormData格式）

当用户上传文件时，使用 `multipart/form-data` 格式：

```javascript
const formData = new FormData()

// 必填字段（至少填写一个）
formData.append('title', '课程笔记标题')
formData.append('content', '这是笔记的文本内容...')
formData.append('file', fileObject) // File对象

// 可选字段
formData.append('note_type', 'general') // 笔记类型
formData.append('course_id', '123') // 课程ID
formData.append('chapter', '第一章 - Vue基础') // 章节信息
formData.append('tags', 'Vue3,前端,JavaScript') // 标签，逗号分隔
formData.append('folder_id', '0') // 文件夹ID，0表示不放入文件夹
formData.append('original_filename', 'example.jpg') // 原始文件名
formData.append('media_size_bytes', '1024000') // 文件大小（字节）

// 🚨 重要：文件上传时不要设置 media_type，让后端自动确定
// formData.append('media_type', 'image') // ❌ 不要这样做
```

### 2. 仅文本内容的请求（JSON格式）

当没有文件上传时，使用普通JSON格式：

```javascript
const noteData = {
  title: "课程笔记标题",
  content: "这是笔记的文本内容...",
  note_type: "general",
  course_id: 123,
  chapter: "第一章 - Vue基础",
  tags: "Vue3,前端,JavaScript",
  folder_id: 0,
  media_url: "https://example.com/image.jpg", // 外部媒体链接
  media_type: "image",
  original_filename: "example.jpg",
  media_size_bytes: 1024000
}
```

### 3. 使用外部媒体链接的请求

```javascript
const noteData = {
  title: "在线资源笔记",
  content: "这是关于在线视频的笔记",
  note_type: "summary",
  course_id: 123,
  chapter: "第二章 - 组件开发",
  tags: "组件,实战",
  media_url: "https://example.com/video.mp4",
  media_type: "video",
  original_filename: "course_video.mp4"
}
```

## 参数详细说明

### 必填参数（至少一个）
- `title` (string): 笔记标题
- `content` (string): 笔记文本内容
- `file` (File): 上传的文件对象

### 可选参数

#### 基础信息
- `note_type` (string): 笔记类型
  - `general`: 普通笔记（默认）
  - `summary`: 总结笔记
  - `reflection`: 反思笔记
  - `question`: 疑问笔记
  - `idea`: 想法笔记

#### 分类信息（互斥）
- `course_id` (integer): 关联的课程ID
- `folder_id` (integer): 关联的文件夹ID
  - 传入 `0` 表示不放入任何文件夹
  - 不能与 `course_id` 同时使用

#### 课程相关
- `chapter` (string): 课程章节信息
  - 例如："第一章 - AI概述"
  - 使用时必须同时提供 `course_id`

#### 标签和媒体
- `tags` (string): 笔记标签，多个标签用逗号分隔
- `media_url` (string): 外部媒体文件URL
- `media_type` (string): 媒体类型
  - `image`: 图片
  - `video`: 视频
  - `file`: 文件
- `original_filename` (string): 原始文件名
- `media_size_bytes` (integer): 媒体文件大小（字节）

## 前端实现示例

### 1. NoteModal组件中的提交逻辑

```javascript
const handleSubmit = async () => {
  if (!isValid.value || loading.value) return

  loading.value = true
  try {
    let submitData
    
    if (selectedFile.value) {
      // 文件上传情况
      submitData = new FormData()
      submitData.append('file', selectedFile.value)
      
      // 添加其他字段
      Object.keys(formData).forEach(key => {
        if (formData[key] !== '' && formData[key] !== null && key !== 'media_url') {
          if (key === 'folder_id' && formData[key] === '') {
            submitData.append(key, '0')
          } else {
            submitData.append(key, formData[key])
          }
        }
      })
    } else {
      // 纯文本或外部链接情况
      submitData = { ...formData }
      
      // 处理folder_id
      if (submitData.folder_id === '') {
        submitData.folder_id = 0
      }
      
      // 清理空字段
      Object.keys(submitData).forEach(key => {
        if (submitData[key] === '' || submitData[key] === null) {
          delete submitData[key]
        }
      })
    }

    const response = await apiService.createNote(submitData)
    // 处理响应...
  } catch (error) {
    // 错误处理...
  }
}
```

### 2. API服务层实现

```javascript
// remoteApi.js 中的实现
async createNote(noteData) {
  if (noteData.file || noteData instanceof FormData) {
    // 文件上传请求
    let formData = noteData instanceof FormData ? noteData : new FormData()
    
    if (!(noteData instanceof FormData)) {
      Object.keys(noteData).forEach(key => {
        if (noteData[key] !== undefined && noteData[key] !== null) {
          formData.append(key, noteData[key])
        }
      })
    }
    
    const config = {
      method: 'POST',
      url: `${this.endpoint}/`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    
    const response = await httpClient(config)
    return response.data
  } else {
    // JSON请求
    return await this.request('POST', '/', noteData)
  }
}
```

## 实际请求示例

### 示例1：创建带图片的课程笔记

```http
POST /notes/
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="title"

Vue 3组合式API学习笔记
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="content"

今天学习了Vue 3的组合式API，主要包括：
1. setup函数的使用
2. ref和reactive的区别
3. 生命周期钩子的变化

代码示例：
```javascript
import { ref, reactive, onMounted } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const state = reactive({
      name: 'Vue 3'
    })
    
    onMounted(() => {
      console.log('组件挂载完成')
    })
    
    return { count, state }
  }
}
```

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="note_type"

summary
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="course_id"

123
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="chapter"

第三章 - 组合式API详解
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="tags"

Vue3,组合式API,JavaScript,前端
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="media_type"

image
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="original_filename"

vue3-api-diagram.png
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="media_size_bytes"

245760
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="file"; filename="vue3-api-diagram.png"
Content-Type: image/png

[二进制图片数据]
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

### 示例2：创建纯文本个人笔记

```http
POST /notes/
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "title": "今日学习心得",
  "content": "今天学习效率很高，掌握了组合式API的核心概念。明天继续学习路由相关内容。",
  "note_type": "reflection",
  "folder_id": 0,
  "tags": "学习心得,反思"
}
```

### 示例3：创建包含外部视频链接的笔记

```http
POST /notes/
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "title": "Vue 3官方教程视频笔记",
  "content": "这个视频详细介绍了Vue 3的新特性，重点讲解了Composition API的使用方法。",
  "note_type": "general",
  "course_id": 123,
  "chapter": "第一章 - Vue 3介绍",
  "tags": "视频笔记,官方教程",
  "media_url": "https://www.youtube.com/watch?v=example",
  "media_type": "video",
  "original_filename": "vue3-tutorial.mp4"
}
```

## 响应格式

### 成功响应 (200 OK)

```json
{
  "id": 456,
  "owner_id": 123,
  "title": "Vue 3组合式API学习笔记",
  "content": "今天学习了Vue 3的组合式API...",
  "note_type": "summary",
  "course_id": 123,
  "tags": "Vue3,组合式API,JavaScript,前端",
  "chapter": "第三章 - 组合式API详解",
  "media_url": "https://oss.example.com/files/abc123.png",
  "media_type": "image",
  "original_filename": "vue3-api-diagram.png",
  "media_size_bytes": 245760,
  "folder_id": null,
  "combined_text": "Vue 3组合式API学习笔记 今天学习了Vue 3的组合式API...",
  "created_at": "2025-08-20T14:30:00Z",
  "updated_at": "2025-08-20T14:30:00Z",
  "folder_name": null,
  "course_title": "Vue.js 3.0 完整开发教程"
}
```

### 错误响应示例

#### 400 Bad Request - 参数错误
```json
{
  "detail": "同时提供了course_id和folder_id，只能选择其中一个"
}
```

#### 400 Bad Request - 验证错误
```json
{
  "detail": [
    {
      "loc": ["title"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

#### 404 Not Found - 课程不存在
```json
{
  "detail": "Course not found"
}
```

## 注意事项

### 1. 数据验证规则
- 标题、内容、文件至少提供一个
- `course_id` 和 `folder_id` 不能同时提供
- 提供 `chapter` 时必须同时提供 `course_id`
- `media_url` 和 `file` 不能同时提供
- 提供媒体内容时必须指定 `media_type`

### 2. 🚨 重要：media_type 设置规则
- **文件上传时**：不要设置 `media_type`，让后端根据文件类型自动确定
- **外部链接时**：必须设置 `media_type` 来指定媒体类型
- **原因**：预设 `media_type` 但没有 `media_url` 会触发验证错误

```javascript
// ❌ 错误的方式 - 文件上传时设置 media_type
formData.append('file', fileObject)
formData.append('media_type', 'image') // 这会导致验证失败

// ✅ 正确的方式 - 文件上传时不设置 media_type
formData.append('file', fileObject)
// 不设置 media_type，让后端自动确定

// ✅ 正确的方式 - 外部链接时设置 media_type
const noteData = {
  media_url: "https://example.com/image.jpg",
  media_type: "image" // 这里必须设置
}
```

### 3. 文件上传限制
- 支持的文件类型：图片、视频、文档等
- 文件大小限制（根据后端配置）
- 文件会上传到OSS并返回URL

### 4. 特殊值处理
- `folder_id` 设为 `0` 表示不放入任何文件夹
- 空字符串会被过滤掉，不发送给后端
- `tags` 使用逗号分隔多个标签

### 5. 错误处理
- 前端需要处理网络错误、验证错误、服务器错误
- 文件上传失败时需要给用户明确提示
- 大文件上传时需要显示进度

这份文档详细说明了前端如何向后端发送创建课程笔记的请求，包括各种场景下的具体格式和参数。
