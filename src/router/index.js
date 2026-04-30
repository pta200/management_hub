import { createRouter, createWebHistory } from 'vue-router'
import { routes, handleHotUpdate } from 'vue-router/auto-routes'
import { useUserStore } from '@/stores/users.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
// This will update routes at runtime without reloading the page
if (import.meta.hot) { 
  handleHotUpdate(router) 
} 

export default router

router.beforeEach(async (to) => {
  // get user store instance
  const userStore = useUserStore()

  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login']
  const authRequired = !publicPages.includes(to.path)

  // check if component requires authentication and if valid token exists otherwise redirect to login component
  if (authRequired) {
    if (userStore.tokenExp() == true) {
      return { name: 'login' }
    }
  }
})
