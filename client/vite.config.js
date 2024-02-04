import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  // server: {
  //   proxy: {
  //     '/api': {
  //       target : 'http://192.168.208.1:8080',
  //       secure: false,
  //     },
  //   },
  // },
  plugins: [react()],
})
