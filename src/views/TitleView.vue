<template>
  <v-app-bar class="appBar" :elevation="0">
    <router-link to="/">
      <v-img class="mx-2" contain :src="logo" width="113" height="44" style="cursor: pointer" />
    </router-link>
    <div class="line-1"></div>
    <v-toolbar-title class="applicationName"> Management Hub </v-toolbar-title>
    <NavigationView />
    <ProfileView />
  </v-app-bar>
</template>

<script setup>
import '@/assets/main.css'
import ProfileView from '@/views/PreferencesView.vue'
import logo from '@/assets/logo.svg'
import NavigationView from './NavigationView.vue'
</script>

<style>
.appBar {
  background-image: linear-gradient(to right, #a598c3, #4314af) !important;
  border: 1px solid #000000;
}

.applicationName {
  color: #3d4860;
  font-family:
    Lazonby-Liquid,
    Gill Sans,
    sans-serif;
}
</style>
