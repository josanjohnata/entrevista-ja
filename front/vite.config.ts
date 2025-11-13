import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const resolveOptimizeCvAssets = () => ({
  name: 'resolve-optimize-cv-assets',
  resolveId(source: string) {
    if (source.includes('../../../../public/background.png')) {
      return path.resolve(__dirname, 'public/background.png')
    }
    return null
  }
})

export default defineConfig({
  plugins: [react(), resolveOptimizeCvAssets()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'node_modules/@josanjohnata/optimize-cv/src'),
    },
  },
})
