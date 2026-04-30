<script setup>
import { onMounted} from 'vue'
import { useUserStore } from '@/stores/users.js'
import { useuiStateStore } from '@/stores/uiState.js'

const userStore = useUserStore()
const uiStateStore = useuiStateStore()

async function doLogout() {
      this.userStore.logout()
      this.$router.push('/login')
}

function toggleLable() {
      return "Theme: " + uiStateStore.currentTheme.split("_")[0];
    }

onMounted(() => {
  uiStateStore.checkTheme()
})

</script>

<template>
  <v-menu origin="top center" v-if="userStore.authToken" :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" icon="mdi-account-circle"></v-btn>
    </template>
    <v-list density="comfortable" nav class="popout">
      <v-list-item @click="this.doLogout()" prepend-icon="mdi-logout" title="Logout"> </v-list-item>
      <!-- Setting group -->
      <v-list-group>
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            title="Settings"
            value="Settings"
            prepend-icon="mdi-cog-outline"
          ></v-list-item>
        </template>
        <v-list-item id="toggleswitch">
          <v-switch
            @change="uiStateStore.toggleTheme(uiStateStore.themestate)"
            v-model="uiStateStore.themestate"
            true-value="dark_theme"
            false-value="light_theme"
            :label="toggleLable()"
            :hide-details="true"
          ></v-switch>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-menu>
</template>

<style scoped>
.popout {
  margin-right: 2px;
}
#toggleswitch {
  padding-inline-start: 10% !important;
}
</style>
