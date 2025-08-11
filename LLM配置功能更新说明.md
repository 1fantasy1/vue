# LLM配置功能实现说明

## 功能概述
在"我的"界面的设置中，成功实现了OpenAI兼容的LLM模型配置功能。

## 主要功能

### 1. 配置界面
- **位置**: 我的 → 系统设置 → 默认模型
- **支持的API类型**:
  - OpenAI兼容 (默认)
  - Azure OpenAI
  - Anthropic Claude
  - Google Gemini

### 2. 配置项
根据后端API要求，支持以下配置项：
- `llm_api_type`: API类型 (默认: "openai")
- `llm_api_key`: API密钥
- `llm_api_base_url`: 基础URL (默认: "https://api.openai.com/v1")
- `llm_model_id`: 模型ID (默认: "gpt-3.5-turbo")
- `temperature`: 温度参数 (0-1)

### 3. 功能按钮
- **保存配置**: 将配置保存到后端服务器
- **测试连接**: 测试LLM服务连接状态
- **刷新配置**: 从服务器重新加载配置

## 实现细节

### 前端修改
1. **Profile.vue** - 主要修改文件
   - 更新了设置数据结构，添加LLM配置字段
   - 重新设计了默认模型配置界面
   - 添加了保存、测试、刷新功能
   - 实现了自动加载配置功能

2. **API调用**
   - 使用 `remoteApiService.users.updateLLMConfig()` 保存配置
   - 使用 `remoteApiService.users.getMe()` 加载配置

### 后端API支持
- **PUT** `/users/me/llm-config` - 更新LLM配置
- **GET** `/users/me` - 获取用户信息（包含LLM配置）

### API数据格式
保存配置时的数据格式：
```javascript
{
  "llm_api_type": "openai",
  "llm_api_key": "sk-xxx...",
  "llm_api_base_url": "https://api.openai.com/v1",
  "llm_model_id": "gpt-3.5-turbo"
}
```

获取配置时的返回字段：
```javascript
{
  "llm_api_type": "string",
  "llm_api_base_url": "string", 
  "llm_model_id": "string",
  "llm_api_key_encrypted": "string"  // 返回时API密钥是加密的
}
```

## 用户体验
1. **直观界面**: 清晰的配置表单，支持不同API类型选择
2. **实时反馈**: 保存、加载、测试操作都有相应的消息提示
3. **自动加载**: 打开设置页面时自动加载已保存的配置
4. **响应式设计**: 在移动端和桌面端都有良好的显示效果
5. **安全性**: API密钥加密显示，保护用户隐私

## 使用流程
1. 进入"我的"页面
2. 点击"系统设置"展开设置面板
3. 点击"默认模型"进入LLM配置页面
4. 选择API类型并填写相应配置
5. 点击"保存配置"保存到服务器
6. 可选择"测试连接"验证配置有效性

## 安全特性
- API密钥输入框使用password类型，保护输入过程
- 从服务器返回的API密钥是加密的，保护存储安全
- 界面会提示用户当前显示的是加密密钥
- 重新输入密钥可以更新配置

## 注意事项
- 刷新配置时，API密钥显示为加密格式
- 需要重新输入API密钥才能更新
- 配置会自动保存到本地localStorage作为备份
- 所有操作都有适当的错误处理和用户提示
