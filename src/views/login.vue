<script>
import { useUserStore } from '../stores/users.js'
export default {
  setup() {
    const userStore = useUserStore()
    return {
      userStore,
    }
  },
  data: () => ({
    error: false,
    errorMessage: '',
    valid: true,
    loadingLogin: false,
    username: '',
    usernameRules: [(v) => !!v || 'Username is required'],
    passwordShow: false,
    password: '',
    passwordRules: [
      (v) => !!v || 'Required.',
      (v) => v.length >= 8 || 'Min 8 characters',
      (v) =>
        /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(v) ||
        'Password must contain at least lowercase letter, one number, a special character and one uppercase letter',
    ],
  }),
  methods: {
    validate() {
      this.$refs.form
        .validate()
        .then((result) => {
          if (result.valid) {
            this.doLogin(this.username, this.password)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    clear() {
      this.$refs.form.resetValidation()
      this.$refs.form.reset()
      this.valid = true
    },
    clearStatus() {
      this.error = false
      this.errorMessage = ''
    },
    async doLogin(username, password) {
      this.loadingLogin = true
      const loginResponse = await this.userStore.login({ username, password })

      if (loginResponse?.status == 200) {
        this.$router.push('/')
      } else if (loginResponse?.status == 401) {
        this.error = true
        this.errorMessage = 'Invalid username and/or password'
      } else {
        this.error = true
        if (loginResponse?.data) {
          this.errorMessage = loginResponse?.data
        }
        if (loginResponse?.message) {
          this.errorMessage = loginResponse?.message
        }
        this.errorMessage = 'failed to authenticate'
      }
      this.loadingLogin = false
    },
  },
}
</script>

<route lang="json">
{
  "name": "login"
}
</route>

<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-container fluid class="fluid form-container">
      <v-row align="center" justify="center" class="row">
        <!-- <v-col cols="12" md="6" align="center" justify="center" v-if="error" class="error-text">
          {{ errorMessage }}
        </v-col>
        <v-col cols="12" md="6" align="center" justify="center" v-else> </v-col> -->
        <v-alert v-if="error" type="error" style="max-width: 300px; margin: 0 auto">
          {{ errorMessage }}
        </v-alert>
      </v-row>
      <v-row align="center" justify="center" class="row">
        <v-col cols="12" md="6">
          <v-text-field
            v-model="username"
            :counter="10"
            :rules="usernameRules"
            label="Username"
            required
            @focus="clearStatus"
            @keydown.enter="validate"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="12" md="6">
          <v-text-field
            v-model="password"
            :prepend-inner-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="passwordRules"
            :type="passwordShow ? 'text' : 'password'"
            name="password"
            label="Password"
            hint="At least 8 characters"
            counter
            @click:prepend-inner="passwordShow = !passwordShow"
            @focus="clearStatus"
            @keydown.enter="validate"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="12" md="6">
          <v-btn v-show="!valid || !loadingLogin" color="grey" class="mr-3" @click="validate">
            Submit
          </v-btn>
          <v-progress-circular
            v-show="loadingLogin"
            indeterminate
            model-value="20"
            class="mr-3"
          ></v-progress-circular>
          <v-btn color="grey" class="mr-4" @click="clear" v-show="!valid || !loadingLogin">
            Reset
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<style scoped>
.form-container {
  width: 80%;
  margin-top: 50px;
}
.error-text {
  color: red;
}
</style>
