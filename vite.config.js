import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [vue()],
// })

// vite.config.js
export default defineConfig({
  plugins: [vue()],
  base: '/weatherForecast-vidget/',
  // ...
  server: {
    proxy: {
      '/api': {
        target: 'https://weather.visualcrossing.com', // Новый целевой сервер
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
