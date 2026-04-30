// Styles
import '@mdi/font/css/materialdesignicons.css'

// Vuetify
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
  components,
  directives,
  theme: {
    
    themes: {
      light_theme: {
        dark: false,
        colors: {
          appBg: '#fafafa',
          linkText: '#3d3d3d',
          btnText: '#fafafa',
          primary: '#8c5bff',
          errorBg: '#f54444',
        },
      },
      dark_theme: {
        dark: true,
        colors: {
          linkBg: '#413C47',
          linkBorder: '#413C47',
          linkText: '#f5f1f1ff',
          appBg: '#2c2c2c',
          primary: '#8c5bff',
          errorBg: '#f54444',
        },
      },
    },
    defaultTheme: 'light_theme',
  },
})

// export default createVuetify({
//   theme: {
//     defaultTheme: 'system', // 'system' | 'light' | 'dark'
//   },
// })