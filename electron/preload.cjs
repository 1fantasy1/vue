const { contextBridge, ipcRenderer } = require('electron');

// 通过 contextBridge 安全地暴露 API 给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 示例 API
  getVersion: () => process.versions.electron,
  getPlatform: () => process.platform,
  
  // 可以添加更多 API
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  
  // 监听主进程事件
  onMenuAction: (callback) => ipcRenderer.on('menu-action', callback),
  
  // 移除监听器
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});
