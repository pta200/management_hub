<template>
  <NewNotifcations ref="dialogRef" />
  <v-sheet border rounded>
    <v-card-text v-if="deleteError">
      <v-alert @click="clearError" type="error" class="mt-4">
        {{ errorMessage }}
      </v-alert>
    </v-card-text>
      <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="notificationStore.items"
        :items-per-page-options="[5, 10, 25, 100]"
        :loading="notificationStore.loading"
        :items-length="notificationStore.total"
        :search="debouncedSearch"
        item-value="notification_id"
        @update:options="loadItems"
        no-data-text="No students on record"
      >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>
            <v-icon color="medium-emphasis" icon="mdi-message-badge" size="small" start></v-icon>
            Notifications
          </v-toolbar-title>

          <v-text-field
            v-model="searchField"
            label="Search Items..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            hide-details
            single-line
            density="compact"
            class="mr-3"
          ></v-text-field>

          <v-btn
            class="me-2"
            prepend-icon="mdi-square-rounded-badge"
            rounded="lg"
            text="Create New Notifcation"
            border
            @click="dialogRef.open()"
          ></v-btn>
        </v-toolbar>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <div class="d-flex ga-2 justify-end">
          <v-icon
            color="medium-emphasis"
            icon="mdi-chart-box"
            size="small"
            @click="edit(item.notification_id)"
          ></v-icon>

          <v-icon
            color="medium-emphasis"
            icon="mdi-delete"
            size="small"
            @click="remove(item.notification_id)"
          ></v-icon>
        </div>
      </template>

    </v-data-table-server>
  </v-sheet>

</template>

<route lang="json">
{
  "name": "Notifications"
}
</route>

<script setup>
import { watch, ref, shallowRef, toRef } from 'vue'
import { useNotificationStore } from '@/stores/notifications'
import { useRouter } from 'vue-router'
import debounce from 'lodash.debounce'
import NewNotifcations from '@/components/NewNotifications.vue'

const dialogRef = ref(null)
const router = useRouter()
const deleteError = ref(false)
const errorMessage = ref('')
const notificationStore = useNotificationStore()
const itemsPerPage = ref(5)
const searchField = ref('')
const debouncedSearch = ref('')
const headers = [
  { title: 'Name', key: 'name', align: 'start' },
  { title: 'Delivery', key: 'delivery' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', align: 'end', sortable: false },
]

const updateSearch = debounce((val) => {
  debouncedSearch.value = val
}, 500)

watch(searchField, (newVal) => {
  updateSearch(newVal)
})

async function loadItems({ page, itemsPerPage, sortBy, search }) {
  console.log('PARAMS', page, itemsPerPage)
  const offset = (page - 1) * itemsPerPage
  console.log('CALC', offset, itemsPerPage)
  if (!search) {
    await notificationStore.getNotifications(offset, itemsPerPage)
  } else {
    console.log('search param', search)
    await notificationStore.searchNotifications({ name: search }, offset, itemsPerPage)
  }
}

async function remove(id) {
  const response = await notificationStore.deleteStudent(id)
  if (response?.status == 204) {
    console.log('delete success')
  } else if (response?.status == 401) {
    router.push('/login')
  } else {
    if (response?.data) {
      errorMessage.value = response.data?.detail ? response.data.detail : response.data
    } else {
      errorMessage.value = response
    }
    deleteError.value = true
  }
}

function clearError() {
  deleteError.value = false
  errorMessage.value = ''
}

</script>
