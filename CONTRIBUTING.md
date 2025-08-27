# 贡献指南 (Contributing Guide)

感谢您有兴趣为 Vue 项目做出贡献！我们欢迎所有形式的贡献，包括但不限于代码、文档、测试、问题报告和功能建议。

Thank you for your interest in contributing to the Vue project! We welcome all forms of contributions, including but not limited to code, documentation, tests, issue reports, and feature suggestions.

## 目录 (Table of Contents)

- [行为准则](#行为准则-code-of-conduct)
- [开始之前](#开始之前-before-you-start)
- [开发环境设置](#开发环境设置-development-environment-setup)
- [贡献类型](#贡献类型-types-of-contributions)
- [代码贡献流程](#代码贡献流程-code-contribution-process)
- [代码规范](#代码规范-coding-standards)
- [提交信息规范](#提交信息规范-commit-message-conventions)
- [问题报告](#问题报告-issue-reporting)
- [功能请求](#功能请求-feature-requests)
- [文档贡献](#文档贡献-documentation-contributions)
- [测试](#测试-testing)
- [代码审查](#代码审查-code-review)
- [发布流程](#发布流程-release-process)

## 行为准则 (Code of Conduct)

在参与此项目之前，请阅读并遵守我们的 [行为准则](CODE_OF_CONDUCT.md)。

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) before participating in this project.

## 开始之前 (Before You Start)

1. **搜索现有问题** - 在创建新问题之前，请搜索现有的 issues 和 pull requests
2. **阅读文档** - 确保您已经阅读了项目文档和 README
3. **了解许可证** - 请阅读并理解项目的 [许可证](LICENSE)
4. **设置开发环境** - 按照下面的指南设置开发环境

Before you start:

1. **Search existing issues** - Before creating new issues, please search existing issues and pull requests
2. **Read documentation** - Make sure you have read the project documentation and README
3. **Understand the license** - Please read and understand the project [license](LICENSE)
4. **Set up development environment** - Follow the guide below to set up your development environment

## 开发环境设置 (Development Environment Setup)

### 系统要求 (System Requirements)

- **Node.js**: >= 16.0.0
- **npm**: >= 8.0.0 或 **yarn**: >= 1.22.0
- **Git**: >= 2.20.0

### 安装步骤 (Installation Steps)

1. **Fork 仓库**
   ```bash
   # 在 GitHub 上 fork 项目到您的账户
   ```

2. **克隆仓库**
   ```bash
   git clone https://github.com/YOUR_USERNAME/vue.git
   cd vue
   ```

3. **添加上游仓库**
   ```bash
   git remote add upstream https://github.com/1fantasy1/vue.git
   ```

4. **安装依赖**
   ```bash
   npm install
   # 或者
   yarn install
   ```

5. **启动开发服务器**
   ```bash
   npm run dev
   # 或者
   yarn dev
   ```

6. **运行测试**
   ```bash
   npm test
   # 或者
   yarn test
   ```

## 贡献类型 (Types of Contributions)

我们欢迎以下类型的贡献：

### 🐛 Bug 修复 (Bug Fixes)
- 修复现有功能中的错误
- 提高系统稳定性
- 解决性能问题

### ✨ 新功能 (New Features)
- 添加新的功能特性
- 改进现有功能
- 增强用户体验

### 📚 文档改进 (Documentation Improvements)
- 修正文档错误
- 添加缺失的文档
- 改进文档结构和可读性
- 翻译文档

### 🧪 测试 (Testing)
- 增加测试覆盖率
- 改进测试质量
- 添加边界情况测试

### 🎨 界面优化 (UI/UX Improvements)
- 改进用户界面
- 优化用户体验
- 响应式设计改进

### ⚡ 性能优化 (Performance Optimizations)
- 提高应用性能
- 减少内存使用
- 优化加载速度

We welcome the following types of contributions:

### 🐛 Bug Fixes
- Fix errors in existing functionality
- Improve system stability
- Resolve performance issues

### ✨ New Features
- Add new feature capabilities
- Improve existing features
- Enhance user experience

### 📚 Documentation Improvements
- Correct documentation errors
- Add missing documentation
- Improve documentation structure and readability
- Translate documentation

### 🧪 Testing
- Increase test coverage
- Improve test quality
- Add edge case testing

### 🎨 UI/UX Improvements
- Improve user interface
- Optimize user experience
- Responsive design improvements

### ⚡ Performance Optimizations
- Improve application performance
- Reduce memory usage
- Optimize loading speed

## 代码贡献流程 (Code Contribution Process)

### 1. 创建分支 (Create Branch)
```bash
# 确保您在最新的 main 分支上
git checkout main
git pull upstream main

# 创建新的功能分支
git checkout -b feature/your-feature-name
# 或者 bug 修复分支
git checkout -b fix/your-bug-fix-name
```

### 2. 进行更改 (Make Changes)
- 编写清晰、可维护的代码
- 遵循项目的代码规范
- 添加必要的测试
- 更新相关文档

### 3. 提交更改 (Commit Changes)
```bash
# 添加更改的文件
git add .

# 提交更改（遵循提交信息规范）
git commit -m "feat: add new feature description"
```

### 4. 推送分支 (Push Branch)
```bash
git push origin feature/your-feature-name
```

### 5. 创建 Pull Request (Create Pull Request)
- 在 GitHub 上创建 pull request
- 填写详细的描述
- 链接相关的 issues
- 等待代码审查

## 代码规范 (Coding Standards)

### JavaScript/TypeScript 规范

1. **代码风格**
   - 使用 2 个空格缩进
   - 使用单引号字符串
   - 行末不加分号（除非必要）
   - 最大行长度：100 字符

2. **命名规范**
   - 变量和函数：camelCase（驼峰命名）
   - 常量：UPPER_SNAKE_CASE
   - 组件名：PascalCase
   - 文件名：kebab-case

3. **函数规范**
   - 保持函数简洁，单一职责
   - 使用描述性的函数名
   - 添加适当的注释和文档

### Vue 组件规范

1. **组件结构**
   ```vue
   <template>
     <!-- 模板内容 -->
   </template>

   <script setup>
   // 脚本内容
   </script>

   <style scoped>
   /* 样式内容 */
   </style>
   ```

2. **Props 定义**
   - 使用 TypeScript 类型定义
   - 提供默认值和验证
   - 添加详细的注释

3. **事件命名**
   - 使用 kebab-case
   - 以动词开头（如：update:value）

### CSS 规范

1. **选择器命名**
   - 使用 BEM 方法论
   - 避免过深的嵌套（最多 3 层）

2. **样式组织**
   - 按功能模块组织样式
   - 使用 CSS 变量定义主题色彩
   - 保持响应式设计

## 提交信息规范 (Commit Message Conventions)

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

### 格式 (Format)
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### 类型 (Types)
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式化（不影响功能）
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动
- `perf`: 性能优化
- `ci`: CI/CD 相关
- `build`: 构建系统或外部依赖变动

### 示例 (Examples)
```bash
feat: add user authentication system
fix: resolve memory leak in data processing
docs: update installation guide
style: format code according to style guide
refactor: extract common utility functions
test: add unit tests for user service
chore: update dependencies to latest versions
perf: optimize image loading performance
```

## 问题报告 (Issue Reporting)

### Bug 报告模板

当报告 bug 时，请包含以下信息：

**Bug 描述** (Bug Description)
简洁清晰地描述问题。

**复现步骤** (Steps to Reproduce)
1. 访问 '...'
2. 点击 '...'
3. 滚动到 '...'
4. 查看错误

**预期行为** (Expected Behavior)
简洁清晰地描述您期望发生的情况。

**实际行为** (Actual Behavior)
简洁清晰地描述实际发生的情况。

**截图** (Screenshots)
如果适用，添加截图以帮助解释您的问题。

**环境信息** (Environment)
- 操作系统：[例如 Windows 10, macOS Big Sur]
- 浏览器：[例如 Chrome 95, Firefox 94]
- Node.js 版本：[例如 16.13.0]
- 项目版本：[例如 1.0.0]

**附加上下文** (Additional Context)
在此处添加关于问题的任何其他上下文。

## 功能请求 (Feature Requests)

### 功能请求模板

**功能描述** (Feature Description)
简洁清晰地描述您想要的功能。

**问题描述** (Problem Description)
这个功能要解决什么问题？

**解决方案** (Proposed Solution)
简洁清晰地描述您想要实现的解决方案。

**替代方案** (Alternative Solutions)
简洁清晰地描述您考虑过的任何替代解决方案或功能。

**用例** (Use Cases)
描述此功能的具体使用场景。

**附加上下文** (Additional Context)
在此处添加关于功能请求的任何其他上下文或截图。

## 文档贡献 (Documentation Contributions)

### 文档类型
- **API 文档** - 函数、类、接口的详细说明
- **用户指南** - 面向最终用户的使用说明
- **开发者文档** - 面向开发者的技术文档
- **教程** - step-by-step 的学习指南

### 文档标准
1. **清晰简洁** - 使用简单明了的语言
2. **结构化** - 使用合适的标题和列表
3. **示例丰富** - 提供代码示例和用例
4. **及时更新** - 保持与代码同步

## 测试 (Testing)

### 测试类型
1. **单元测试** - 测试单个函数或组件
2. **集成测试** - 测试模块间的交互
3. **端到端测试** - 测试完整的用户流程

### 测试要求
- 新功能必须包含测试
- Bug 修复应添加回归测试
- 测试覆盖率应保持在 80% 以上

### 运行测试
```bash
# 运行所有测试
npm test

# 运行特定测试文件
npm test -- --testNamePattern="your-test-pattern"

# 运行测试并生成覆盖率报告
npm run test:coverage

# 监视模式运行测试
npm run test:watch
```

## 代码审查 (Code Review)

### 审查标准
1. **代码质量** - 是否遵循项目规范
2. **功能正确性** - 是否实现了预期功能
3. **测试充分性** - 是否包含足够的测试
4. **性能影响** - 是否对性能有负面影响
5. **向后兼容性** - 是否破坏现有 API

### 审查流程
1. **自动检查** - CI/CD 流水线自动运行测试
2. **人工审查** - 至少一名维护者审查代码
3. **反馈处理** - 根据反馈修改代码
4. **最终批准** - 审查通过后合并代码

## 发布流程 (Release Process)

### 版本管理
我们使用 [Semantic Versioning](https://semver.org/) (语义化版本):

- **主版本号** (MAJOR): 不兼容的 API 更改
- **次版本号** (MINOR): 向后兼容的功能添加
- **修订号** (PATCH): 向后兼容的问题修复

### 发布周期
- **修复版本** (Patch): 根据需要发布
- **次要版本** (Minor): 每月发布一次
- **主要版本** (Major): 根据重大更改决定

## 获得帮助 (Getting Help)

如果您在贡献过程中遇到问题，可以通过以下方式获得帮助：

1. **GitHub Issues** - 提交问题或查看现有讨论
2. **邮件联系** - 发送邮件至 mail@675222.xyz
3. **代码审查** - 在 Pull Request 中请求帮助
4. **文档** - 查看项目文档和 README

If you encounter issues during the contribution process, you can get help through:

1. **GitHub Issues** - Submit questions or view existing discussions
2. **Email Contact** - Send email to mail@675222.xyz
3. **Code Review** - Request help in Pull Requests
4. **Documentation** - Check project documentation and README

## 认可贡献者 (Recognizing Contributors)

我们重视每一个贡献，所有贡献者都会被记录在：

- **README** 文件的贡献者部分
- **发布说明** 中的感谢名单
- **GitHub** 的贡献者图表

We value every contribution, and all contributors will be recognized in:

- **README** contributors section
- **Release notes** acknowledgments
- **GitHub** contributors graph

## 许可证 (License)

通过向此项目贡献代码，您同意您的贡献将按照项目的许可证进行授权。请参阅 [LICENSE](LICENSE) 文件了解详细信息。

By contributing to this project, you agree that your contributions will be licensed under the project's license. See the [LICENSE](LICENSE) file for details.

---

再次感谢您的贡献！您的参与使这个项目变得更好。

Thank you again for your contribution! Your participation makes this project better.
