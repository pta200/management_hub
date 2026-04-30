
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { loadFonts } from './plugins/webfontloader'

import vuetify from './plugins/vuetify'
import App from './App.vue'
import router from './router'
import axios from 'axios'

// Set the global timeout to 90000 milliseconds (90 seconds)
axios.defaults.timeout = 90000

loadFonts()
createApp(App).use(createPinia()).use(router).use(vuetify).mount('#app')
