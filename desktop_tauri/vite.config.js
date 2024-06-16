import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'; // Импортируем плагин Vue
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // prevent vite from obscuring rust errors
  root: './web',
  clearScreen: false,
  // Tauri expects a fixed port, fail if that port is not available
  server: {
    port: 5173,  // Убедитесь, что порт указан правильно
  },
  // to access the Tauri environment variables set by the CLI with information about the current target
  envPrefix: ['VITE_', 'TAURI_PLATFORM', 'TAURI_ARCH', 'TAURI_FAMILY', 'TAURI_PLATFORM_VERSION', 'TAURI_PLATFORM_TYPE', 'TAURI_DEBUG'],
  build: {
    // Tauri uses Chromium on Windows and WebKit on macOS and Linux
    target: process.env.TAURI_PLATFORM == 'windows' ? 'chrome105' : 'safari13',
    // don't minify for debug builds
    minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
    // produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_DEBUG,
    outDir: '../dist' // путь для выходных файлов сборки
  },
  plugins: [
    VitePWA({
      manifest: {
        "name": "2ThreeDimention",
        "short_name": "2threeD",
        "description": "Application to make three projections of object and reconstruct them to threeD frame",
        "theme_color": "#48829d",
        "background_color": "#5b19d7",
        "display": "standalone",
        "orientation": "any",
        "scope": "/",
        "start_url": "/",
        "icons": [
            {
                "src": "icons/icon_192.png",
                "sizes": "192x192",
                "type": "image/png",
                "purpose": "any"
            },
            {
                "src": "icons/icon_384.png",
                "sizes": "384x384",
                "type": "image/png",
                "purpose": "any"
            },
            {
                "src": "icons/maskable_192.png",
                "sizes": "192x192",
                "type": "image/png",
                "purpose": "maskable"
            },
            {
                "src": "icons/maskable_384.png",
                "sizes": "384x384",
                "type": "image/png",
                "purpose": "maskable"
            }
        ]
    },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 год
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 год
              }
            }
          },
          {
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'jsdelivr-cdn',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 год
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: 'module',
      }
    })
  ]
});