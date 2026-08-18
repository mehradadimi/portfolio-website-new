import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    __BUILD_ID__: JSON.stringify(
      new Date().toISOString().slice(2, 16).replace('T', '.').replaceAll('-', '').replace(':', ''),
    ),
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('@react-three')) return 'r3f'
          if (id.includes('three')) return 'three'
          if (id.includes('gsap') || id.includes('lenis')) return 'motion'
        },
      },
    },
  },
})
