<script setup lang="ts">
import 'font-awesome/css/font-awesome.min.css'
import TopBarVue from './components/TopBar.vue';
import PopUpVue from './components/PopUp.vue';
import { getUser } from './tools/jwtTools';

const run = async () => {
  await getUser()
}
run()


</script>
<template>
  <w-app>
    <TopBarVue />
    <PopUpVue />
    <router-view />
  </w-app>
</template>
