import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  // 使用相对路径，确保 Electron 通过 file:// 加载时资源能正确解析
  base: './',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    },
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Electron 环境优化
    target: 'chrome89', // Electron 使用的 Chrome 版本
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          elementPlus: ['element-plus', '@element-plus/icons-vue']
        }
      }
    }
  },
  define: {
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
    // 添加环境变量，帮助应用检测 Electron 环境
    __IS_ELECTRON__: JSON.stringify(process.env.npm_lifecycle_event === 'electron' || process.env.IS_ELECTRON === 'true'),
    // 确保生产环境使用正确的API地址
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify(process.env.VITE_API_BASE_URL || 'https://cosbrain.675222.xyz/api')
  }
})
