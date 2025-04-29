import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Check if we're building for GitHub Pages
  const isGitHubPages = mode === 'github-pages'

  // Base config shared between both builds
  const baseConfig = {
    plugins: [
      vue(),
      {
        name: 'create-root-index',
        closeBundle: () => {
          if (isGitHubPages) {
            // Create a redirect index.html in the root
            const redirectHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>@calumk/vue-progress-status - Redirecting...</title>
  <meta http-equiv="refresh" content="0;URL='example/index.html'" />
</head>
<body>
  <p>If you are not redirected automatically, <a href="example/index.html">click here</a>.</p>
</body>
</html>`;
            fs.writeFileSync('dist-demo/index.html', redirectHtml);
          }
        }
      }
    ],
  }

  // Settings for GitHub Pages demo build
  if (isGitHubPages) {
    return {
      ...baseConfig,
      base: '/vue-progress-status/', // Set the base path for GitHub Pages
      build: {
        outDir: 'dist-demo',
        emptyOutDir: true,
        rollupOptions: {
          input: {
            main: resolve(__dirname, 'example/index.html'),
          },
        },
      },
    }
  }

  // Settings for library build (default)
  return {
    ...baseConfig,
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
  }
}) 