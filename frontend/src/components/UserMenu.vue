<script setup lang="ts">
import { ref } from 'vue';
import { global } from '../tools/global';
import EditProfileVue from './EditProfile.vue';


const open = ref(false)

const handleEditClick = async () => {
  open.value = false
  global.state.edit = true
}

const handleLogoutClick = () => {
  document.cookie = "Authorization= ; path=/; expires = Thu, 01 Jan 1970 00:00:00 GMT"
  document.cookie = "Expires= ; path=/; expires = Thu, 01 Jan 1970 00:00:00 GMT"
  document.cookie = "Username= ; path=/; expires = Thu, 01 Jan 1970 00:00:00 GMT"
  global.setName()
  let title: string = "Success!"
  let message: string = "You've been logged out!"
  global.setPopup(false, title, message, 1500)
  open.value = false
}
</script>

<template>

  <w-button bg-color="blue-light5" @click="open = true">
    <w-icon xl color="primary">
      fa fa-bars
    </w-icon>
  </w-button>

  <w-drawer right v-model="open" column width="200px">
    <w-flex column>

      <w-toolbar horizontal top height="2.5em" bg-color="blue-light5">
        <div class="spacer"></div>
        <w-button bg-color="blue-light5" color="error" @click="open = false" icon="fa fa-times-circle" xl>
        </w-button>
      </w-toolbar>

      <w-toolbar bg-color="white" horizontal height="5em">
        <w-flex column align-end>
          <w-button round shadow lg class="ma1" @click="handleEditClick()">
            <w-icon class="mr1">fa fa-pencil-square-o</w-icon>
            EDIT PROFILE
          </w-button>
          <w-button round shadow lg class="ma1" @click="handleLogoutClick()">
            <w-icon class="mr1">fa fa-sign-out</w-icon>
            LOG OUT</w-button>
        </w-flex>
      </w-toolbar>
      <w-toolbar bg-color="white" horizontal height="500em">
      </w-toolbar>

    </w-flex>
  </w-drawer>
  <EditProfileVue />
</template>