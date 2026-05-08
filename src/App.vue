<template>
  <v-app  class="bg-appBg">
    <TitleView />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import TitleView from './views/TitleView.vue'
</script>