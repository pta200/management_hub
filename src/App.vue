<template>
  <v-app  class="bg-appBg">
    <TitleView />
    <NavigationView />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import TitleView from './views/TitleView.vue'
import NavigationView from './views/NavigationView.vue'
</script>