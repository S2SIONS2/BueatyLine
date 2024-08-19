import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { // 로그인
        target: 'http://stage-kmc.daeho2.shop:81/api2',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')

      },
    }
  }
})
