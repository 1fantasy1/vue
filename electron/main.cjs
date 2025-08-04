const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

const isDev = process.env.NODE_ENV === 'development';

// 便携模式：将用户数据目录设置为应用目录下的 data 文件夹
const isPortable = process.env.PORTABLE === 'true' || process.argv.includes('--portable');
if (isPortable) {
  const portableDataPath = path.join(path.dirname(process.execPath), 'data');
  if (!fs.existsSync(portableDataPath)) {
    fs.mkdirSync(portableDataPath, { recursive: true });
  }
  app.setPath('userData', portableDataPath);
  app.setPath('userCache', path.join(portableDataPath, 'cache'));
  app.setPath('logs', path.join(portableDataPath, 'logs'));
}

let mainWindow;
let viteProcess;

function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true
    },
    icon: path.join(__dirname, '../build/icon.png'),
    show: false,
    titleBarStyle: 'default',
    title: isPortable ? '鸿庆书云 (便携版)' : '鸿庆书云'
  });

  // 开发模式下启动Vite开发服务器
  if (isDev) {
    // 启动Vite开发服务器
    viteProcess = spawn('npm', ['run', 'dev'], {
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe'
    });

    // 等待开发服务器启动
    setTimeout(() => {
      mainWindow.loadURL('http://localhost:5173');
      mainWindow.webContents.openDevTools();
    }, 3000);
  } else {
    // 生产模式下加载构建的文件
    const indexPath = path.join(__dirname, '../dist/index.html');
    console.log('Loading file:', indexPath);
    
    // 确保正确加载文件
    mainWindow.loadFile(indexPath).then(() => {
      console.log('File loaded successfully');
    }).catch((error) => {
      console.error('Failed to load file:', error);
    });
    
    // 添加错误处理
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
      console.error('Failed to load:', errorCode, errorDescription);
    });
    
    // 当页面加载完成时确保导航到首页
    mainWindow.webContents.once('did-finish-load', () => {
      console.log('Page finished loading');
    });
  }

  // 窗口准备好后显示
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // 当窗口关闭时触发
  mainWindow.on('closed', () => {
    mainWindow = null;
    if (viteProcess) {
      viteProcess.kill();
    }
  });
}

// 当 Electron 完成初始化并准备创建浏览器窗口时调用此方法
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // 在 macOS 上，当点击 dock 图标并且没有其他窗口打开时，
    // 通常在应用程序中重新创建一个窗口。
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 当所有窗口关闭时退出应用程序，除了在 macOS 上。
// 在 macOS 上，应用程序和它们的菜单栏通常保持活跃状态，
// 直到用户使用 Cmd + Q 明确退出。
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 在这个文件中，你可以包含应用程序特定的主进程代码。
// 你也可以将它们放在单独的文件中，并在这里引入。
