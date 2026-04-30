<template>
  <v-sheet border rounded>
    <v-card-text v-if="deleteError">
      <v-alert @click="clearError" type="error" class="mt-4">
        {{ errorMessage }}
      </v-alert>
    </v-card-text>
    <v-data-table
      :headers="headers"
      :items="studentStore.items"
      :loading="studentStore.loading"
      no-data-text="No students on record"
      :search="search"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>
            <v-icon color="medium-emphasis" icon="mdi-account-group" size="small" start></v-icon>
            Students
          </v-toolbar-title>

          <v-text-field
            v-model="search"
            label="Search"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            hide-details
            single-line
            density="compact"
            class="mr-3"
          ></v-text-field>

          <v-btn
            class="me-2"
            prepend-icon="mdi-account-multiple-plus"
            rounded="lg"
            text="Add a Student"
            border
            @click="add"
          ></v-btn>
        </v-toolbar>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <div class="d-flex ga-2 justify-end">
          <v-icon
            color="medium-emphasis"
            icon="mdi-pencil"
            size="small"
            @click="edit(item.student_id)"
          ></v-icon>

          <v-icon
            color="medium-emphasis"
            icon="mdi-delete"
            size="small"
            @click="remove(item.student_id)"
          ></v-icon>
        </div>
      </template>

      <template v-slot:no-data>
        <v-btn
          prepend-icon="mdi-backup-restore"
          rounded="lg"
          text="Reset data"
          variant="text"
          border
          @click="reset"
        ></v-btn>
      </template>
    </v-data-table>
  </v-sheet>

  <v-dialog v-model="dialog" max-width="600">
    <v-card-text>
      <v-alert v-if="apiError" type="error" class="mt-4">
        {{ errorMessage }}
      </v-alert>
    </v-card-text>
    <v-card :title="`${isEditing ? 'Edit' : 'Add'} a Student`">
      <template v-slot:text>
        <v-form ref="form" @submit.prevent="save">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="formModel.name"
                label="Name"
                :rules="[requiredRule]"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="formModel.email"
                label="Email"
                placeholder="johndoe@gmail.com"
                prepend-inner-icon="mdi-at"
                :rules="emailRules"
                outlined
                density="compact"
                clearable
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="formModel.mobile"
                prepend-inner-icon="mdi-phone"
                placeholder="+12125555555"
                label="Mobile"
                :rules="[mobileRule]"
                outlined
                density="compact"
                clearable
                type="tel"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                v-model="formModel.course"
                :items="['Math', 'History', 'Economics']"
                label="Course"
                :rules="[requiredRule]"
              ></v-select>
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="formModel.gpa"
                label="GPA"
                :rules="[requiredRule]"
                type="number"
                min="0"
              ></v-text-field>
            </v-col>

          </v-row>
        </v-form>
      </template>

      <v-divider></v-divider>

      <v-card-actions class="bg-surface-light">
        <v-btn text="Cancel" variant="plain" @click="dialog = false"></v-btn>

        <v-spacer></v-spacer>

        <v-btn text="Save" @click="save"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<route lang="json">
{
  "name": "Students"
}
</route>

<script setup>
import { onMounted, ref, shallowRef, toRef } from 'vue'
import { useStudentStore } from '@/stores/students'
import { useRouter } from 'vue-router'

const router = useRouter()

function createNewRecord() {
  return {
    name: '',
    email: '',
    mobile: '',
    course: '',
    gpa: '',
  }
}

const studentStore = useStudentStore()

const formModel = ref(createNewRecord())
const dialog = shallowRef(false)
const isEditing = toRef(() => !!formModel.value.student_id)
const apiError = ref(false)
const deleteError = ref(false)
const errorMessage = ref('')
const search = ref('')

const headers = [
  { title: 'Name', key: 'name', align: 'start' },
  { title: 'Email', key: 'email' },
  { title: 'Mobile', key: 'mobile' },
  { title: 'Course', key: 'course' },
  { title: 'GPA', key: 'gpa'},
  { title: 'Actions', key: 'actions', align: 'end', sortable: false },
]

onMounted(() => {
  reset()
})

const requiredRule = (value) => !!value || 'Field is required.'
const emailRules = [
  v => !!v || 'E-mail is required',
  v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
]
const form = ref(null)

function isE164(phone) {
    const e164Regex = /^\+[1-9]\d{6,14}$/;
    return e164Regex.test(phone);
}

const mobileRule = (value) => isE164(value) || 'Invalid mobile format'


function add() {
  formModel.value = createNewRecord()
  dialog.value = true
  apiError.value = false
  deleteError.value = false
  errorMessage.value = ''
}

function edit(id) {
  apiError.value = false
  deleteError.value = false
  errorMessage.value = ''

  const found = studentStore.items.find((rep) => rep.student_id === id)

  formModel.value = {
    student_id: found.student_id,
    name: found.name,
    email: found.email,
    mobile: found.mobile,
    course: found.course,
    gpa: found.gpa,
  }

  dialog.value = true
}

async function remove(repId) {
  const response = await studentStore.deleteStudent(repId)
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

async function save() {
  const { valid } = await form.value.validate()

  if (valid) {
    if (isEditing.value) {
      const response = await studentStore.editStudent(formModel.value.student_id, {
        name: formModel.value.name,
        email: formModel.value.email,
        mobile: formModel.value.mobile,
        course: formModel.value.course,
        gpa: formModel.value.gpa,
      })

      if (response?.status == 200) {
        dialog.value = false
      } else if (response?.status == 401) {
        router.push('/login')
      } else {
        if (response?.data) {
          errorMessage.value = response.data?.detail ? response.data.detail : response.data
        } else {
          errorMessage.value = response
        }
        apiError.value = true
      }
    } else {
      const response = await studentStore.addStudent({
        name: formModel.value.name,
        email: formModel.value.email,
        mobile: formModel.value.mobile,
        course: formModel.value.course,
        gpa: formModel.value.gpa,
      })

      if (response?.status == 201) {
        dialog.value = false
      } else if (response?.status == 401) {
        router.push('/login')
      } else {
        if (response?.data) {
          errorMessage.value = response.data?.detail ? response.data.detail : response.data
        } else {
          errorMessage.value = response
        }
        apiError.value = true
      }
    }
  }
}

async function reset() {
  dialog.value = false
  formModel.value = createNewRecord()
  await studentStore.getStudents()
}

function clearError() {
  deleteError.value = false
  errorMessage.value = ''
}
</script>
