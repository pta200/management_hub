import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from './users.js'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_ROOT_URL || ''

export const useStudentStore = defineStore('students', () => {
  const items = ref([])
  const total = ref(0)
  const loading = ref(false)
  const userStore = useUserStore()

  async function getStudents(offset = 0, limit = 100) {
    loading.value = true
    try {
      const response = await axios.get(
        API_URL + `/students/paginate?offset=${offset}&limit=${limit}`,
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

  async function addStudent(payload) {
    try {
      const response = await axios.post(API_URL + '/students', payload, {
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

  async function editStudent(studentId, payload) {
    try {
      const response = await axios.put(API_URL + `/students/student/${studentId}`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userStore.authToken}`,
        },
      })
      console.log('Response:', response)
      const index = items.value.findIndex((book) => book.book_id === studentId)
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

  async function deleteStudent(studentId) {
    try {
      const response = await axios.delete(API_URL + `/students/${studentId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userStore.authToken}`,
        },
      })
      console.log('Response:', response)
      const index = items.value.findIndex((book) => book.book_id === studentId)
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

  async function searchStudents(payload, offset = 0, limit = 100) {
    try {
      const queryString = new URLSearchParams(payload).toString()
      console.log(`/students/search?filter=${queryString}&offset=${offset}&limit=${limit}`)
      const response = await axios.get(
        API_URL + `/students/search?${queryString}&offset=${offset}&limit=${limit}`,
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

  return { items, total, getStudents, addStudent, editStudent, deleteStudent, searchStudents }
})
