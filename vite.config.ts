import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'basepower': path.resolve(__dirname, './basepower/src'),
      'basepower/react': path.resolve(__dirname, './basepower/src/react'),
    }
  },
  optimizeDeps: {
    exclude: ['basepower']
  },
  server: {
    host: true,
    watch: {
      ignored: ['**/basepower/docs/**', '**/basepower/tests/**']
    }
  }
})
