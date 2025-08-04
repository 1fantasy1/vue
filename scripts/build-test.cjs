#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 颜色输出
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  step: (msg) => console.log(`${colors.cyan}🚀 ${msg}${colors.reset}`)
};

const isWindows = process.platform === 'win32';

// 执行命令的包装函数
function runCommand(command, description) {
  try {
    log.step(description);
    execSync(command, { stdio: 'inherit' });
    log.success(`${description} - 完成`);
    return true;
  } catch (error) {
    log.error(`${description} - 失败`);
    log.error(`错误: ${error.message}`);
    return false;
  }
}

// 检查文件是否存在
function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    log.success(`${description}: ${filePath}`);
    return true;
  } else {
    log.warning(`${description}: 文件不存在 - ${filePath}`);
    return false;
  }
}

// 主构建流程
async function main() {
  console.log(`
${colors.magenta}
🎯 鸿庆书云 - 跨平台构建测试
============================
${colors.reset}
`);

  const steps = [
    {
      name: '安装依赖',
      command: 'npm install',
      required: true
    },
    {
      name: '构建 Web 应用',
      command: 'npm run build',
      required: true
    },
    {
      name: '构建桌面应用',
      command: isWindows ? 'npm run build:win' : 'npm run build:linux',
      required: false
    },
    {
      name: '同步移动端项目',
      command: 'npm run cap:android',
      required: false
    }
  ];

  let success = true;
  const results = [];

  // 执行构建步骤
  for (const step of steps) {
    const result = runCommand(step.command, step.name);
    results.push({ ...step, success: result });
    
    if (!result && step.required) {
      success = false;
      break;
    }
  }

  console.log('\n📊 构建结果汇总:');
  console.log('================\n');

  // 显示步骤结果
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    const required = result.required ? '(必须)' : '(可选)';
    console.log(`${status} ${result.name} ${required}`);
  });

  console.log('\n📂 生成的文件:');
  console.log('==============\n');

  // 检查生成的文件
  const expectedFiles = [
    { path: 'dist/index.html', desc: 'Web 应用' },
    { path: 'dist-electron/', desc: '桌面应用安装包', isDir: true },
    { path: 'android/app/', desc: 'Android 项目', isDir: true }
  ];

  expectedFiles.forEach(file => {
    if (file.isDir) {
      if (fs.existsSync(file.path) && fs.lstatSync(file.path).isDirectory()) {
        const files = fs.readdirSync(file.path).filter(f => 
          f.endsWith('.exe') || f.endsWith('.AppImage') || f.endsWith('.deb') || f.endsWith('.dmg')
        );
        if (files.length > 0) {
          log.success(`${file.desc}: ${path.join(file.path, files[0])}`);
        } else {
          log.warning(`${file.desc}: 目录存在但无安装包文件`);
        }
      } else {
        log.warning(`${file.desc}: 目录不存在`);
      }
    } else {
      checkFile(file.path, file.desc);
    }
  });

  if (success) {
    console.log(`
${colors.green}
🎉 构建测试完成！
===============

📋 下一步操作:
1. 测试应用功能
2. 提交更改: git add . && git commit -m "构建版本 v1.0.0"
3. 创建标签: git tag v1.0.0
4. 推送发布: git push origin main && git push origin v1.0.0

🚀 自动化构建将通过 GitHub Actions 完成所有平台的安装包！
${colors.reset}
`);
  } else {
    console.log(`
${colors.red}
💥 构建测试失败！
===============

请检查上述错误信息并解决问题后重试。
${colors.reset}
`);
    process.exit(1);
  }
}

// 处理未捕获的异常
process.on('uncaughtException', (error) => {
  log.error(`未捕获的异常: ${error.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  log.error(`未处理的 Promise 拒绝: ${reason}`);
  process.exit(1);
});

// 运行主程序
main().catch(error => {
  log.error(`程序执行失败: ${error.message}`);
  process.exit(1);
});
