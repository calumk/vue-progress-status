import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'VueProgressStatus',
      fileName: (format) => `vue-progress-status.${format}.js`
    },
    rollupOptions: {
      // Externalize Vue to avoid bundling it
      external: ['vue'],
      output: {
        // Global variable used when the bundle is loaded in UMD format
        globals: {
          vue: 'Vue'
        },
        // Ensure CSS is extracted to a separate file
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'style.css'
          return assetInfo.name
        }
      }
    },
    // Generate sourcemaps
    sourcemap: true,
    // Ensure CSS is extracted for the library mode
    cssCodeSplit: false
  }
}) 