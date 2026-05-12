import { defineStore } from 'pinia'
import { useTheme } from 'vuetify'

export const useuiStateStore = defineStore('uiStateStore', {
  state: () => ({
    snackbar: false,
    timeout: 5000,
    toggle: false,
    username: '',
    themestate: localStorage.getItem('theme') || 'system',
    currentTheme: '',
    navTheme: true,
    theme: useTheme(),
  }),
  actions: {
    snackbarState() {
      this.snackbar = true
      this.timeout = 8000
    },
    toggleState() {
      this.toggle = !this.toggle
    },
    toggleTheme() {
      console.log('TOGLLGING')
      if (this.themestate === 'dark_theme') {
        localStorage.setItem('theme', 'dark_theme')
        this.navTheme = false
        this.theme.change('dark_theme')
        this.themestate = 'dark_theme'
      } else {
        localStorage.setItem('theme', 'light_theme')
        this.navTheme = true
        this.theme.change('light_theme')
        this.themestate = 'light_theme'
      }
      this.currentTheme = localStorage.theme.split('T')[0]
      console.log(this.currentTheme)
    },
    checkTheme() {
      if (localStorage.getItem('theme')) {
        this.themestate = localStorage.getItem('theme')
        this.currentTheme = localStorage.theme.split('T')[0]
        this.theme.change(this.themestate)
        if (localStorage.getItem('theme') === 'dark_theme') {
          this.navTheme = false
        } else if (localStorage.getItem('theme') === 'light_theme') {
          this.navTheme = true
        }
      } else {
        this.themestate = 'light_theme'
        this.currentTheme = 'light_theme'
        this.theme.change('light_theme')
      }
    },
  },
})
