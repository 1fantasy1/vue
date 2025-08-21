// Electron main process
// CommonJS file because electron-builder expects a Node entrypoint
const { app, BrowserWindow, shell, Menu } = require('electron')
const path = require('path')

const isDev = !app.isPackaged
const isDebugMode = process.env.DEBUG_MODE === 'true' || process.argv.includes('--debug')

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      devTools: true // 总是启用开发者工具
    }
  })

  // 创建菜单，包含开发者工具选项
  const menuTemplate = [
    {
      label: '查看',
      submenu: [
        {
          label: '重新加载',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            win.webContents.reload()
          }
        },
        {
          label: '强制重新加载',
          accelerator: 'CmdOrCtrl+Shift+R',
          click: () => {
            win.webContents.reloadIgnoringCache()
          }
        },
        {
          type: 'separator'
        },
        {
          label: '开发者工具',
          accelerator: 'F12',
          click: () => {
            win.webContents.toggleDevTools()
          }
        }
      ]
    },
    {
      label: '窗口',
      submenu: [
        {
          label: '最小化',
          accelerator: 'CmdOrCtrl+M',
          click: () => {
            win.minimize()
          }
        },
        {
          label: '关闭',
          accelerator: 'CmdOrCtrl+W',
          click: () => {
            win.close()
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)

  // 注册F12快捷键
  win.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12') {
      win.webContents.toggleDevTools()
    }
  })

  if (isDev) {
    const devServerUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173'
    win.loadURL(devServerUrl)
    win.webContents.openDevTools({ mode: 'detach' })
  } else {
    const filePath = path.join(__dirname, '..', 'dist', 'index.html')
    console.log('加载文件路径:', filePath)
    win.loadFile(filePath)
    
    // 在生产环境中也可以选择性地打开开发者工具（用于调试）
    // 如果是调试模式或者检测到需要调试，自动打开开发者工具
    if (isDebugMode) {
      console.log('调试模式：自动打开开发者工具')
      win.webContents.openDevTools({ mode: 'detach' })
    }
    
    // 页面加载完成后的回调
    win.webContents.once('did-finish-load', () => {
      console.log('页面加载完成')
      // 如果遇到问题，可以取消注释下面的行来强制打开开发者工具
      // win.webContents.openDevTools({ mode: 'detach' })
    })
    
    // 添加错误处理
    win.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
      console.error('页面加载失败:', {
        errorCode,
        errorDescription,
        validatedURL,
        filePath
      })
    })
    
    // 监听页面白屏或JS错误
    win.webContents.on('render-process-gone', (event, details) => {
      console.error('渲染进程崩溃:', details)
    })
  }

  // Open external links in default browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    console.log('尝试打开URL:', url)
    if (url.startsWith('http')) {
      shell.openExternal(url)
      return { action: 'deny' }
    }
    return { action: 'allow' }
  })

  // 监听导航事件
  win.webContents.on('will-navigate', (event, navigationUrl) => {
    console.log('将要导航到:', navigationUrl)
    
    // 如果导航到 file:///C:/ 这样的路径，阻止它
    if (navigationUrl.startsWith('file:///C:/') && !navigationUrl.includes('index.html')) {
      console.log('阻止不正确的文件系统导航:', navigationUrl)
      event.preventDefault()
      
      // 重定向到正确的应用根路径
      const appPath = win.webContents.getURL()
      const basePath = appPath.split('#')[0]
      win.webContents.loadURL(basePath + '#/')
    }
  })

  // 监听页面导航完成
  win.webContents.on('did-navigate', (event, url) => {
    console.log('导航完成:', url)
  })
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
