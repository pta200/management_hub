<template>
  <v-dialog v-model="isVisible" max-width="800">
   <v-card>
      <!-- Dialog Header with Close Button -->
      <v-card-title class="d-flex align-center">
        <span class="text-h5">Create New Notification</span>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" variant="text" @click="closeDialog"></v-btn>
      </v-card-title>
    <v-card-text>
  <v-form ref="form" @submit.prevent="save">
    <v-stepper v-model="step" :items="items">
      <template v-slot:item.1>

          <v-text-field label="Name" v-model="notificationName" :rules="[requiredRule]"></v-text-field>

      </template>
      <template v-slot:item.2>
          <v-select
            label="Delivery Options"
            v-model="notifcationDelivery"
            :items="['email', 'sms']"
            :rules="[requiredRule]"
            return-object
          ></v-select>
      </template>
      <template v-slot:item.3>
          <v-row>
            <v-col cols="12" md="6">
              <v-card title="Available">
                <v-data-table-server
                  v-model:items-per-page="itemsPerPage"
                  :headers="headers"
                  hide-default-header
                  :items="filteredContacts"
                  :loading="studentStore.loading"
                  :items-length="totalItems"
                  :search="debouncedSearch"
                  @update:options="loadItems"
                  no-data-text="No students on record"
                >
                  
                  <template v-slot:[`item.actions`]="{ item, index }">
                    <div class="d-flex ga-2 justify-end">
                      <v-icon
                        color="success"
                        icon="mdi-plus-circle"
                        size="small"
                        @click="addItemToSelected(item, index)"
                      ></v-icon>
                    </div>
                  </template>

                  <template v-slot:bottom="{ props }">
                    <v-text-field
                      v-model="searchField"
                      label="Search Recipients..."
                      prepend-inner-icon="mdi-magnify"
                      variant="outlined"
                      hide-details
                      single-line
                    ></v-text-field>
                    <v-spacer></v-spacer>
                    <!-- Default Pagination Controls -->
                    <v-data-table-footer v-bind="props" :items-per-page-options="[5, 10, 25, 100]"></v-data-table-footer>
                  </template>

                </v-data-table-server>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <v-card title="Selected">
                <v-list density="compact" max-height="200" class="overflow-y-auto">
                  <v-list-item
                    v-for="(item, index) in selectedContacts"
                    :key="index"
                    link
                    @click="removeItemFromSelected(item, index)"
                  >
                    <v-list-item-title>
                      {{ item.name }}
                    </v-list-item-title>
                    <template v-slot:append>
                      <v-icon color="error">mdi-minus-circle</v-icon>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
      </template>

      <template v-slot:actions="{ prev, next }">
        <v-stepper-actions>
          <template v-slot:prev>
            <v-btn @click="prev"> Previous </v-btn>
          </template>
          <template v-slot:next>
            <v-btn v-if="step === 3" @click="save" :disabled="false"> Submit </v-btn>
            <v-btn v-else @click="nextStep"> Next </v-btn>
          </template>
        </v-stepper-actions>
      </template>
    </v-stepper>
  </v-form>
  </v-card-text>
      </v-card>
  </v-dialog>
</template>

<script setup>
import { watch, ref, computed } from 'vue'
import { useStudentStore } from '@/stores/students'
import debounce from 'lodash.debounce'
import { useRouter } from 'vue-router'

const isVisible = ref(false)
const open = () => {
  isVisible.value = true
}
defineExpose({ open })
const availableContacts = ref([])
const selectedContacts = ref([])
const contactSearch = ref('')
const studentStore = useStudentStore()
const notificationName = ref('')
const notifcationDelivery = ref('')
const form = ref(null)
const step = ref(1)
const items = ['Name', 'Delivery', 'Recipients']
const requiredRule = (value) => !!value || 'Field is required.'
const itemsPerPage = ref(5)
const totalItems = ref(0)
const headers = [
  { title: 'Name', key: 'name', align: 'start' },
  { title: 'Actions', key: 'actions', align: 'end', sortable: false },
]
const searchField = ref('')
const debouncedSearch = ref('')

const closeDialog = () => {
  isVisible.value = false
  notificationName.value = ''
  notifcationDelivery.value = ''
  selectedContacts.value = []
  step.value = 1
}

async function loadItems({ page, itemsPerPage, sortBy, search }) {
  console.log('PARAMS', page, itemsPerPage)
  const offset = (page - 1) * itemsPerPage
  console.log('CALC', offset, itemsPerPage)
  if (!search) {
    await studentStore.getStudents(offset, itemsPerPage)
  } else {
    console.log('search param', search)
    await studentStore.searchStudents({ name: search }, offset, itemsPerPage)
  }
  availableContacts.value = JSON.parse(JSON.stringify(studentStore.items))
  totalItems.value = studentStore.total
}

const updateSearch = debounce((val) => {
  debouncedSearch.value = val
}, 500)

watch(searchField, (newVal) => {
  updateSearch(newVal)
})

async function save() {
  const { valid } = await form.value.validate()
  if (valid) {
    console.log('save notification', notificationName.value, notifcationDelivery.value, selectedContacts.value
    )
  } else {
    console.log('Fields are required')
  }
}

async function nextStep() {
  // fire validation per step otherwise block
  const { valid } = await form.value.validate()
  if (valid) {
    step.value++
  }
}

const filteredContacts = computed(() => {
  // check if search and return full contact list
  if (!contactSearch.value) {
    totalItems.value = studentStore.total
    return availableContacts.value
  }
  // filter match into new list
  const lowerCaseSearch = contactSearch.value.toLowerCase()
  const newContacts =  availableContacts.value.filter((item) => {
    return item.name.toLowerCase().includes(lowerCaseSearch)
  })
  totalItems.value  = newContacts.length
  return newContacts
})

const addItemToSelected = (item, index) => {
  // Add the item to the selected list
  selectedContacts.value.push(item)
  // Remove the item from the available list using its index
  availableContacts.value.splice(index, 1)
}

const removeItemFromSelected = (item, index) => {
  // Add the item back to the available list
  availableContacts.value.push(item)
  // Remove the item from the selected list using its index
  selectedContacts.value.splice(index, 1)
}
</script>
