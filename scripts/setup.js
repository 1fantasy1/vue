#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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

function runCommand(command, description, options = {}) {
  try {
    log.step(description);
    const result = execSync(command, { 
      stdio: options.silent ? 'pipe' : 'inherit',
      encoding: 'utf8'
    });
    log.success(`${description} - 完成`);
    return result;
  } catch (error) {
    log.error(`${description} - 失败`);
    if (!options.optional) {
      log.error(`错误: ${error.message}`);
      process.exit(1);
    }
    return null;
  }
}

function checkNodeVersion() {
  try {
    const version = process.version;
    const majorVersion = parseInt(version.slice(1).split('.')[0]);
    
    if (majorVersion < 18) {
      log.error(`Node.js 版本过低 (当前: ${version})，请升级到 18.x 或更高版本`);
      log.info('下载地址: https://nodejs.org/');
      process.exit(1);
    }
    
    log.success(`Node.js 版本检查通过 (${version})`);
    return true;
  } catch (error) {
    log.error('无法检查 Node.js 版本');
    return false;
  }
}

function checkGit() {
  try {
    const gitVersion = execSync('git --version', { encoding: 'utf8', stdio: 'pipe' });
    log.success(`Git 已安装 (${gitVersion.trim()})`);
    return true;
  } catch (error) {
    log.warning('Git 未安装，部分功能可能受限');
    return false;
  }
}

function checkPackageJson() {
  if (!fs.existsSync('package.json')) {
    log.error('未找到 package.json 文件，请确保在正确的项目目录中运行此脚本');
    process.exit(1);
  }
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  log.success(`项目: ${packageJson.name} v${packageJson.version}`);
  return packageJson;
}

async function main() {
  console.log(`
${colors.magenta}
🎯 鸿庆书云 - 快速入门向导
==========================
欢迎使用鸿庆书云跨平台协作平台！
${colors.reset}
`);

  // 1. 环境检查
  log.step('步骤 1: 环境检查');
  checkNodeVersion();
  checkGit();
  checkPackageJson();
  
  console.log('\n');

  // 2. 安装依赖
  log.step('步骤 2: 安装项目依赖');
  runCommand('npm install', '安装依赖包');
  
  console.log('\n');

  // 3. 检查可用命令
  log.step('步骤 3: 验证项目配置');
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const scripts = packageJson.scripts || {};
  
  const essentialScripts = [
    { key: 'dev', desc: 'Web 开发服务器' },
    { key: 'build', desc: 'Web 应用构建' },
    { key: 'electron:dev', desc: 'Electron 开发模式' },
    { key: 'build:test', desc: '构建测试' }
  ];

  essentialScripts.forEach(script => {
    if (scripts[script.key]) {
      log.success(`${script.desc}: npm run ${script.key}`);
    } else {
      log.warning(`缺少脚本: ${script.key}`);
    }
  });
  
  console.log('\n');

  // 4. 提供下一步指引
  console.log(`${colors.green}🎉 环境配置完成！${colors.reset}\n`);
  
  console.log('📋 你现在可以开始开发了:\n');
  
  console.log(`${colors.cyan}🌐 Web 开发模式:${colors.reset}`);
  console.log('   npm run dev');
  console.log('   然后访问: http://localhost:5173\n');
  
  console.log(`${colors.cyan}🖥️ 桌面应用开发:${colors.reset}`);
  console.log('   npm run electron:dev\n');
  
  console.log(`${colors.cyan}🏗️ 构建应用:${colors.reset}`);
  console.log('   npm run build:test          # 一键构建测试');
  console.log('   node scripts/build.js web   # 构建 Web 应用');
  console.log('   node scripts/build.js all   # 构建所有平台\n');
  
  console.log(`${colors.cyan}📖 更多信息:${colors.reset}`);
  console.log('   构建指南: BUILD_GUIDE.md');
  console.log('   项目说明: README.md\n');
  
  console.log(`${colors.yellow}💡 小贴士:${colors.reset}`);
  console.log('   - 首次运行可能需要下载一些依赖');
  console.log('   - 如遇到问题，请查看文档或提交 Issue');
  console.log('   - 建议使用 VS Code 进行开发\n');
  
  console.log(`${colors.magenta}祝你开发愉快！ 🚀${colors.reset}`);
}

// 异常处理
process.on('uncaughtException', (error) => {
  log.error(`未捕获的异常: ${error.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  log.error(`未处理的 Promise 拒绝: ${reason}`);
  process.exit(1);
});

// 运行主程序
main().catch(error => {
  log.error(`程序执行失败: ${error.message}`);
  process.exit(1);
});
