# Management Hub

Vue 3 and Vuetify 4 management dashboard to use with fasttwilio service and others

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).
See [File Based Router Config](https://router.vuejs.org/file-based-routing/file-based-routing.html) which is now part of the Vue router.

## Project Setup

```sh
npm create vue@latest
npm install
npm install vuetify webfontloader @mdi/font vite-plugin-vuetify axios jose
```

### Vuetify setup with Vite
Create a new file at src/plugins/vuetify.ts (or .js) to initialize the framework
```js
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

export default createVuetify({
  components,
  directives,
})
```
Register the Plugin in  entry point (usually src/main.ts or main.js) and tell Vue to use the Vuetify plugin
```js
import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'

const app = createApp(App)
app.use(vuetify)
app.mount('#app')
```
Vuetify components require a root <v-app> component to function correctly. Wrap your main content in src/App.vue. If this an older version of Vuetify there are breaking changes so previous css files may break the grid layout.

If you are using Vite, you can install the vite-plugin-vuetify to enable automatic tree-shaking (only importing components you actually use) and add to vite.config.ts|js
```js
import vuetify from 'vite-plugin-vuetify'
export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
  ],
})
```


### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
