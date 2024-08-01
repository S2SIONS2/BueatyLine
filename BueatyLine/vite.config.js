import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/login': { // 로그인
        target: 'http://stage-kmc.daeho.shop:81/api2/login_api/login',
        changeOrigin: true,
      },
      '/refreshToken' : { // 로그인 리프레시 토큰
        target: 'http://stage-kmc.daeho.shop:81/api2/login_api/refresh_token',
        changeOrigin: true,
      },
      '/logout': { // 로그아웃
        target: 'http://stage-kmc.daeho.shop:81/api2/login_api/logout',
        changeOrigin: true,
      },
      '/getList': {
        target: 'http://stage-kmc.daeho.shop:81/api2/work_category_api/getList',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // 경로 재작성
      },
      '/add': {
        target: 'http://stage-kmc.daeho.shop:81/api2/work_category_api/add',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/del': {
        target: 'http://stage-kmc.daeho.shop:81/api2/work_category_api/del',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
