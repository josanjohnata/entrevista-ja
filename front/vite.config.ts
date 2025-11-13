import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@vaga-turbo-bot': path.resolve(__dirname, '../vaga-turbo-bot/src'),
      '@josanjohnata/optimize-cv': path.resolve(__dirname, '../vaga-turbo-bot'),
      '@': path.resolve(__dirname, '../vaga-turbo-bot/src'),
    },
  },
})
