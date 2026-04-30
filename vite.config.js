import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import vueDevTools from 'vite-plugin-vue-devtools'
import VueRouter from 'vue-router/vite'
import vuetify from 'vite-plugin-vuetify'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    VueRouter({
      routesFolder: [
        {
          src: 'src/views',
          path: '',
          // override globals
          exclude: excluded => excluded,
          filePatterns: filePatterns => filePatterns,
          extensions: extensions => extensions,
        },
      ],
       // files to exclude from the scan
      exclude: ['src/views/NavigationView.vue','src/views/TitleView.vue', 'src/views/PreferencesView.vue'],
        
    }),
    vue(),
    // vueDevTools(),
    vuetify({ autoImport: true }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
