<script setup>
import { useUserStore } from '../stores/users.js'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const links = router.getRoutes().filter(route => !route.path.includes(':'))

</script>

<template>
  <v-system-bar window v-if="userStore.authToken" class="linkOutter bg-linkBg border-linkBorder">
      <div v-for="nav in links" :key="nav.title" class="linkClass">
        <router-link class="link text-linkText" v-if="nav.name != 'login'" :to="nav.path">{{
          nav.name
        }}</router-link>
      </div>
    <v-spacer></v-spacer>
  </v-system-bar>
</template>

<style scoped>
.linkOutter {
  border-bottom: 0.5px solid #dce1e1;
  opacity: 90%;
}
.linkClass {
  display: flex;
  align-items: center;
}

.linkClass * {
  margin-right: 30px;
  display: flex;
}

.link {
  font-weight: bold;
  text-decoration: none;
  font-family: 'Roboto Regular', sans-serif;
  font-size: 14px;
}

.menuBtn {
  margin: 0;
  padding: 0;
}
</style>
