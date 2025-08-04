#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 解析命令行参数
const args = process.argv.slice(2);
const platform = args[0] || 'current';
const buildType = args[1] || 'dev';

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
const isMac = process.platform === 'darwin';
const isLinux = process.platform === 'linux';

// 构建配置
const buildConfigs = {
  web: {
    command: 'npm run build',
    description: '构建 Web 应用',
    output: 'dist/'
  },
  electron: {
    win: {
      command: 'npm run build:win',
      description: '构建 Windows 桌面应用',
      output: 'dist-electron/*.exe'
    },
    linux: {
      command: 'npm run build:linux', 
      description: '构建 Linux 桌面应用',
      output: 'dist-electron/*.{AppImage,deb}'
    },
    mac: {
      command: 'npm run build:mac',
      description: '构建 macOS 桌面应用', 
      output: 'dist-electron/*.dmg'
    },
    all: {
      command: 'npm run build:all',
      description: '构建所有平台桌面应用',
      output: 'dist-electron/'
    }
  },
  mobile: {
    android: {
      command: 'npm run cap:android',
      description: '同步 Android 项目',
      output: 'android/'
    }
  }
};

function runCommand(command, description) {
  try {
    log.step(description);
    execSync(command, { stdio: 'inherit' });
    log.success(`${description} - 完成`);
    return true;
  } catch (error) {
    log.error(`${description} - 失败: ${error.message}`);
    return false;
  }
}

function showUsage() {
  console.log(`
${colors.magenta}鸿庆书云 - 构建工具${colors.reset}

用法: node scripts/build.js [platform] [type]

平台选项:
  web        构建 Web 应用
  desktop    构建当前平台桌面应用
  win        构建 Windows 桌面应用
  linux      构建 Linux 桌面应用  
  mac        构建 macOS 桌面应用
  all        构建所有桌面平台
  android    同步 Android 项目
  current    根据当前系统选择平台 (默认)

构建类型:
  dev        开发构建 (默认)
  prod       生产构建

示例:
  node scripts/build.js web
  node scripts/build.js desktop
  node scripts/build.js all
  node scripts/build.js android
`);
}

async function main() {
  if (args.includes('--help') || args.includes('-h')) {
    showUsage();
    return;
  }

  console.log(`
${colors.magenta}🎯 鸿庆书云 - 智能构建系统${colors.reset}
平台: ${platform} | 类型: ${buildType}
=====================================
`);

  // 总是先安装依赖
  if (!runCommand('npm install', '安装项目依赖')) {
    process.exit(1);
  }

  let buildSuccess = true;

  switch (platform) {
    case 'web':
      buildSuccess = runCommand(buildConfigs.web.command, buildConfigs.web.description);
      break;

    case 'desktop':
    case 'current':
      if (isWindows) {
        buildSuccess = runCommand(buildConfigs.electron.win.command, buildConfigs.electron.win.description);
      } else if (isMac) {
        buildSuccess = runCommand(buildConfigs.electron.mac.command, buildConfigs.electron.mac.description);
      } else if (isLinux) {
        buildSuccess = runCommand(buildConfigs.electron.linux.command, buildConfigs.electron.linux.description);
      }
      break;

    case 'win':
      buildSuccess = runCommand(buildConfigs.electron.win.command, buildConfigs.electron.win.description);
      break;

    case 'linux':
      buildSuccess = runCommand(buildConfigs.electron.linux.command, buildConfigs.electron.linux.description);
      break;

    case 'mac':
      buildSuccess = runCommand(buildConfigs.electron.mac.command, buildConfigs.electron.mac.description);
      break;

    case 'all':
      // 先构建 Web，再构建所有桌面平台
      buildSuccess = runCommand(buildConfigs.web.command, buildConfigs.web.description);
      if (buildSuccess) {
        buildSuccess = runCommand(buildConfigs.electron.all.command, buildConfigs.electron.all.description);
      }
      break;

    case 'android':
      buildSuccess = runCommand(buildConfigs.mobile.android.command, buildConfigs.mobile.android.description);
      break;

    default:
      log.error(`未知平台: ${platform}`);
      showUsage();
      process.exit(1);
  }

  if (buildSuccess) {
    log.success(`\n🎉 ${platform} 平台构建完成！`);
    
    // 显示输出文件信息
    if (platform === 'web' && fs.existsSync('dist/index.html')) {
      log.info(`Web 应用: dist/index.html`);
    }
    
    if (['desktop', 'current', 'win', 'linux', 'mac', 'all'].includes(platform)) {
      if (fs.existsSync('dist-electron')) {
        const files = fs.readdirSync('dist-electron').filter(f => 
          f.endsWith('.exe') || f.endsWith('.AppImage') || f.endsWith('.deb') || f.endsWith('.dmg')
        );
        files.forEach(file => {
          log.info(`桌面应用: dist-electron/${file}`);
        });
      }
    }
    
    if (platform === 'android' && fs.existsSync('android')) {
      log.info(`Android 项目: android/`);
    }
  } else {
    log.error(`\n💥 ${platform} 平台构建失败！`);
    process.exit(1);
  }
}

main().catch(error => {
  log.error(`构建过程发生错误: ${error.message}`);
  process.exit(1);
});
