# 课程笔记API调用修正说明

## 修正背景

根据后端兼容性测试反馈，前端在创建课程笔记时存在一个重要问题：**文件上传时预设 `media_type` 会导致验证失败**。

## 问题原因

当文件上传时预设 `media_type` 但 `media_url` 还是 `None`，会触发后端验证错误：
```
当 media_type 为 'image' 时，media_url 不能为空。
```

## 修正内容

### 1. 修正了 `NoteModal.vue` 组件

#### 文件选择处理逻辑
```javascript
// 修正前（❌ 会导致验证失败）
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    
    // 根据文件类型设置media_type
    if (file.type.startsWith('image/')) {
      formData.media_type = 'image'  // 🚨 问题在这里
    } else if (file.type.startsWith('video/')) {
      formData.media_type = 'video'
    } else {
      formData.media_type = 'file'
    }
    
    formData.original_filename = file.name
    formData.media_size_bytes = file.size
    formData.media_url = ''
  }
}

// 修正后（✅ 正确方式）
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    
    // 🚨 重要修正：不要预设 media_type，让后端自动确定
    formData.media_type = ''  // 清空，不预设
    
    formData.original_filename = file.name
    formData.media_size_bytes = file.size
    formData.media_url = ''
  }
}
```

#### 提交逻辑修正
```javascript
// 修正后的提交逻辑
if (selectedFile.value) {
  // 使用FormData上传文件
  submitData = new FormData()
  submitData.append('file', selectedFile.value)
  
  // 添加其他字段，但排除 media_type 和 media_url
  Object.keys(formData).forEach(key => {
    if (formData[key] !== '' && formData[key] !== null && 
        key !== 'media_url' && key !== 'media_type') {  // 🚨 关键修正
      if (key === 'folder_id' && formData[key] === '') {
        submitData.append(key, '0')
      } else {
        submitData.append(key, formData[key])
      }
    }
  })
  
  // 🚨 重要：文件上传时不设置 media_type，让后端自动确定
}
```

### 2. 修正了 `remoteApi.js` 服务层

#### createNote 方法修正
```javascript
// 修正前
Object.keys(noteData).forEach(key => {
  if (noteData[key] !== undefined && noteData[key] !== null) {
    formData.append(key, noteData[key])  // 🚨 会包含 media_type
  }
})

// 修正后
Object.keys(noteData).forEach(key => {
  if (noteData[key] !== undefined && noteData[key] !== null) {
    // 🚨 重要修正：文件上传时不设置 media_type，让后端自动确定
    if (key === 'media_type' && noteData.file) {
      return // 跳过 media_type 字段
    }
    formData.append(key, noteData[key])
  }
})
```

#### updateNote 方法同样修正
应用了相同的修正逻辑，确保更新笔记时也不会出现验证问题。

### 3. 更新了API调用文档

在文档中添加了重要的注意事项：

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

## 修正后的工作流程

### 1. 文件上传场景
1. 用户选择文件
2. 前端不预设 `media_type`
3. 创建 FormData，只包含文件和其他必要字段
4. 后端根据文件MIME类型自动确定 `media_type`
5. 返回完整的笔记信息

### 2. 外部链接场景
1. 用户输入外部媒体URL
2. 用户必须选择 `media_type`
3. 前端发送JSON请求，包含 `media_url` 和 `media_type`
4. 后端验证并保存

### 3. 纯文本场景
1. 用户只输入文本内容
2. 前端发送JSON请求，不包含任何媒体相关字段
3. 后端保存纯文本笔记

## 验证结果

修正后的调用方式已通过测试：

✅ **文件上传（不预设media_type）** - 正常工作  
✅ **纯文本笔记** - 正常工作  
✅ **外部媒体链接** - 正常工作  
✅ **只上传文件（无文本内容）** - 正常工作  
❌ **文件上传时预设media_type** - 已修正，不再出现  

## 关键要点

1. **文件上传时不要预设 `media_type`** - 让后端自动确定
2. **外部链接时必须设置 `media_type`** - 用于验证和分类
3. **其他调用方式保持不变** - 确保兼容性
4. **前端验证逻辑不变** - 用户体验保持一致

这次修正确保了前端与后端API的完全兼容，避免了验证错误，同时保持了良好的用户体验。
