# Profile页面后端API集成更新指南

## 更新概述

Profile页面（"我的"界面）已经成功集成后端API，现在可以：

1. **自动加载真实用户数据** - 从后端API获取当前用户信息
2. **实时更新用户资料** - 编辑后保存到后端数据库
3. **显示动态统计数据** - 基于用户实际活动的统计信息
4. **数据源切换支持** - 可在本地测试数据和远程API之间切换

## 主要功能更新

### 1. 用户资料加载
- 页面加载时自动从 `/users/me` API获取用户信息
- 支持用户姓名、专业、技能、兴趣、个人简介等字段
- 加载状态指示器和错误处理

### 2. 资料编辑保存
- 编辑资料功能集成PUT `/users/me` API
- 实时保存到后端数据库
- 表单验证和成功/失败提示

### 3. 统计数据集成
- 项目统计：从工作台概览API获取活跃和完成项目数
- 课程统计：学习中和已完成课程数量
- 推荐统计：获得推荐数量
- 积分统计：总积分显示

### 4. 用户界面增强
- 添加刷新按钮，可手动重新加载数据
- 加载状态指示（旋转动画）
- 按钮禁用状态（加载期间）

## 技术实现

### API调用
```javascript
// 获取用户信息
const { user, getCurrentUser, updateProfile } = useUserData()

// 获取统计数据
const { summary, fetchSummary } = useDashboardData()

// 加载数据
await getCurrentUser()  // 获取用户基本信息
await fetchSummary()    // 获取统计概览
```

### 数据适配
```javascript
// 用户信息适配
userProfile.value = {
  name: user.value.name || '用户',
  username: user.value.username || 'user',
  email: user.value.email || 'user@example.com',
  major: user.value.major || '专业未设置',
  skills: skills.length ? skills : ['技能待完善'],
  interests: user.value.interests || '兴趣爱好待完善',
  status: user.value.bio || '个人简介待完善 ✨'
}
```

### 保存数据
```javascript
// 更新用户资料
const updateData = {
  name: editProfile.value.name,
  major: editProfile.value.major,
  skills: editProfile.value.skillsString,
  interests: editProfile.value.interests,
  bio: editProfile.value.status
}

await updateProfile(updateData)
```

## 使用说明

### 1. 查看个人资料
- 访问 http://localhost:5173/profile
- 页面自动加载用户数据
- 如果是首次访问，会显示默认的占位符数据

### 2. 编辑个人资料
- 点击"编辑资料"按钮
- 修改相应字段（姓名、专业、技能、兴趣、个人简介）
- 点击保存按钮，数据会同步到后端

### 3. 刷新数据
- 点击"刷新"按钮重新加载最新数据
- 加载期间按钮会显示旋转动画

### 4. 查看统计信息
- 统计区域显示：
  - 参与项目数（活跃+完成）
  - 完成课程数（学习中+已完成）
  - 获得推荐数
  - 总积分

## 配置说明

### 数据源切换
在 `src/config/index.js` 中设置：
```javascript
export const config = {
  api: {
    useLocalData: false  // false=使用后端API，true=使用本地数据
  }
}
```

### API端点
- 获取用户信息：`GET /users/me`
- 更新用户信息：`PUT /users/me`
- 获取工作台概览：`GET /dashboard/summary`

## 注意事项

1. **数据格式**：确保后端返回的用户数据包含必要字段
2. **错误处理**：网络错误时会显示错误提示并回退到默认数据
3. **权限验证**：需要确保用户已登录才能访问个人信息
4. **字段映射**：skills字段后端存储为字符串，前端显示为数组

## 后续优化建议

1. **头像上传功能**：集成图片上传API
2. **更多统计指标**：添加学习时长、活跃度等指标
3. **隐私设置**：允许用户控制信息可见性
4. **成就系统**：基于实际数据动态生成成就徽章

## 测试建议

1. 测试数据加载：刷新页面确认数据正确显示
2. 测试编辑功能：修改各个字段并保存
3. 测试错误处理：断开网络后测试错误情况
4. 测试响应式：在不同设备尺寸下测试界面
