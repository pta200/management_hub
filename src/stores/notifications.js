import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from './users.js'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_ROOT_URL || ''

export const useNotificationStore = defineStore('notifications', () => {
  const items = ref([])
  const total = ref(0)
  const loading = ref(false)
  const userStore = useUserStore()

  async function getNotifications(offset = 0, limit = 100) {
    loading.value = true
    try {
      const response = await axios.get(
        API_URL + `/notifications/paginate?offset=${offset}&limit=${limit}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.authToken}`,
          },
        },
      )
      console.log(response.data)

      items.value = response.data?.items
      total.value = response.data?.total_items ?? 0
      return response
    } catch (error) {
      items.value = []
      console.error('Error during request:', error)
      if (axios.isAxiosError(error) && error?.response) {
        return error.response
      }
      return error.message
    } finally {
      loading.value = false
    }
  }

  async function addNotification(payload) {
    try {
      const response = await axios.post(API_URL + '/notifications', payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userStore.authToken}`,
        },
      })
      console.log('Response:', response.data)
      items.value.push(response.data)
      return response
    } catch (error) {
      console.error('Error during POST request:', error)
      if (axios.isAxiosError(error) && error?.response) {
        return error.response
      }
      return error.message
    }
  }

  async function editNotification(notificationId, payload) {
    try {
      const response = await axios.put(API_URL + `/notifications/notification/${notificationId}`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userStore.authToken}`,
        },
      })
      console.log('Response:', response)
      const index = items.value.findIndex((book) => book.book_id === notificationId)
      items.value.splice(index, 1, response.data)
      return response
    } catch (error) {
      console.error('Error during POST request:', error)
      if (axios.isAxiosError(error) && error?.response) {
        return error.response
      }
      return error.message
    }
  }

  async function deleteNotification(notificationId) {
    try {
      const response = await axios.delete(API_URL + `/notifications/${notificationId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userStore.authToken}`,
        },
      })
      console.log('Response:', response)
      const index = items.value.findIndex((book) => book.book_id === notificationId)
      items.value.splice(index, 1)
      return response
    } catch (error) {
      console.error('Error during POST request:', error)
      if (axios.isAxiosError(error) && error?.response) {
        return error.response
      }
      return error.message
    }
  }

  async function searchNotifications(payload, offset = 0, limit = 100) {
    try {
      const queryString = new URLSearchParams(payload).toString()
      console.log(`/notifications/search?filter=${queryString}&offset=${offset}&limit=${limit}`)
      const response = await axios.get(
        API_URL + `/notifications/search?${queryString}&offset=${offset}&limit=${limit}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.authToken}`,
          },
        },
      )
      console.log(response.data)

      items.value = response.data?.items
      total.value = response.data?.total_items ?? 0
      return response
    } catch (error) {
      items.value = []
      console.error('Error during request:', error)
      if (axios.isAxiosError(error) && error?.response) {
        return error.response
      }
      return error.message
    } finally {
      loading.value = false
    }
  }

  return { items, total, getNotifications, addNotification, editNotification, deleteNotification, searchNotifications }
})
