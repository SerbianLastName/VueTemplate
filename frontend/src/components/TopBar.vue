<script setup lang="ts">
import LoginVue from './Login.vue';
import RegisterVue from './Register.vue';
import UserMenuVue from './UserMenu.vue';
import { global } from '../tools/global';
</script>

<template>
  <w-toolbar horizontal fixed top height="2.5em" color="blue-dark3" bg-color="blue-light5">
    <w-flex align-center class="wrapper">

      <h5> Hello, {{ global.user.username || "Guest" }}</h5>

      <div class="spacer"></div>

      <div v-if="!global.user.loggedIn">
        <w-button @click="global.state.login = true" round shadow lg>
          LOGIN</w-button>
      </div>

      <div v-if="global.user.loggedIn">
        <UserMenuVue />
      </div>

    </w-flex>

  </w-toolbar>

  <RegisterVue />
  <LoginVue />

</template>