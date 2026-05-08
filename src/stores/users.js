import axios from 'axios'
import { defineStore } from 'pinia'
import * as jose from 'jose'

const API_URL = import.meta.env.VITE_API_ROOT_URL || ''

export const useUserStore = defineStore('UserStore', {
  state: () => ({
    authToken: '',
  }),
  getters: {
    userRole() {
      return jose.decodeJwt(this.authToken)?.scope
    },
    username() {
      if (this.authToken) {
        return jose.decodeJwt(this.authToken)?.sub
      }
    },
  },
  actions: {
    tokenExp() {
      if (!this.authToken) {
        if (localStorage.getItem('auth_token')) {
          this.authToken = localStorage.getItem('auth_token')
        } else {
          return true
        }
      }
      if (Math.floor(Date.now() / 1000) > jose.decodeJwt(this.authToken)?.exp) {
        localStorage.removeItem('auth_token')
        return true
      }
      return false
    },
    async login(payload) {
      try {

        const formData = new FormData()
        formData.append('username', payload.username)
        formData.append('password', payload.password)
        const response = await axios.post(API_URL + `/auth/token`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Important for file uploads
          },
        })
        this.authToken = response?.data?.access_token
        localStorage.setItem('auth_token', this.authToken)
        return response
      } catch (error) {
        if (axios.isAxiosError(error)) {
          return error.response
        }
        return error
      }
    },
    async logout() {
      this.authToken = null
      localStorage.removeItem('auth_token')
    },
  },
})
