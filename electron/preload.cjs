// Preload script for contextIsolation
const { contextBridge } = require('electron')

// Expose a minimal API if needed later
contextBridge.exposeInMainWorld('appInfo', {
  platform: process.platform,
})
