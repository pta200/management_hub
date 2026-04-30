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
          // console.log("get token from local")
          this.authToken = localStorage.getItem('auth_token')
        } else {
          return true
        }
      }
      // console.log(jose.decodeJwt(this.authToken)?.exp);
      // console.log((Math.floor(Date.now() / 1000)));
      if (Math.floor(Date.now() / 1000) > jose.decodeJwt(this.authToken)?.exp) {
        // console.log("NOW IS GREATER THAN token")
        localStorage.removeItem('auth_token')
        return true
      }
      // console.log("now is not greater so token is valid")
      return false
    },
    async login(payload) {
      try {
        console.log('start login....')
        const formData = new FormData()
        formData.append('username', payload.username)
        formData.append('password', payload.password)
        const response = await axios.post(API_URL + `/auth/token`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Important for file uploads
          },
        })
        console.log('post complete....')
        console.log(response)
        this.authToken = response?.data?.access_token
        localStorage.setItem('auth_token', this.authToken)
        console.log(jose.decodeJwt(this.authToken))
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
