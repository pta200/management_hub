<template>
  <v-container fluid class="fluid">
    <v-row align="center" justify="center" class="row">
      <v-col cols="12" md="6" align="center" justify="center">
        <div class="wrapper">
          <nav>
            <RouterLink to="/students">Students</RouterLink>
          </nav>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<route lang="json">
{
  "name": "Home"
}
</route>

<style>
.btn-container {
  display: flex;
  justify-content: space-evenly;
}
</style>
