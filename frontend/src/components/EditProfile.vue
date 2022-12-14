<script setup lang="ts">
import { ref } from 'vue';
import { databaseMutate } from '../tools/dbTools';
import { setCookies } from '../tools/jwtTools';
import { global } from '../tools/global';

const user = ref({
  username: global.user.username,
  email: global.user.email,
  password: ""
})

const settings = ref({
  loading: false,
  changePassword: false,
  validators: {
    required: value => !!value || 'This field is required',
  }
})

const update = async () => {
  if (!settings.value.changePassword) user.value.password = ""
  user.value.email = global.user.email
  let body: BodyInit = JSON.stringify(user.value)
  settings.value.loading = true
  let r: { success: Boolean, resp: { token: String, user: String, id: String } } = await databaseMutate("/updateuser", body, "PATCH", true)
  settings.value.loading = false
  if (r?.success) {
    global.state.edit = false
    setCookies(r?.resp?.token, r?.resp?.user, r?.resp?.id)
    global.setName()
    global.setPopup(false, "Success", "You've updated your account!", 1500)
    return
  }
  try {
    if (r?.error.includes("username")) {
      global.setPopup(true, "Huston, we have a problem.", "We're sorry, but that username is already taken.", 2500)
      user.value.username = global.user.username
      return
    }
  }
  catch { }
  global.setPopup(true, "Huston, we have a problem.", "Looks like we're having some issues, please try again.", 2500)
  user.value.username = global.user.username
}

</script>

<template>
  <w-dialog v-model="global.state.edit" :width="500" :persistent="true" :persistent-no-animation="false"
    title-class="primary-light1--bg white">

    <w-toolbar bg-color="blue-light5" color="blue-dark3">
      Edit Profile
      <w-flex justify-end>
        <w-button bg-color="blue-light5" color="error" @click="global.state.edit = false" icon="fa fa-times-circle" lg>
        </w-button>
      </w-flex>
    </w-toolbar>

    <w-flex column>

      <div v-if="!settings.loading">
        <br />
        <w-form>
          <w-input class="mb3" v-model="user.username" label="Username" :validators="[settings.validators.required]" />
          <w-input class="mb3" v-model="global.user.email" label="Email" />
          <div v-if="settings.changePassword">
            <w-input class="mb3" v-model="user.password" label="Password"
              :validators="[settings.validators.required]" />
          </div>
        </w-form>

        <w-button @click="update()" :disabled="user.username == ''" round shadow lg>UPDATE</w-button>

        <div v-if="!settings.changePassword">
          <br />
          <h5>Want to change your password?</h5>
          <w-button bg-color="light-blue" color="white" round shadow @click="settings.changePassword = true">CHANGE
            PASSWORD</w-button>
        </div>

        <div v-if="settings.changePassword">
          <br />
          <h5>Rather not change your password?</h5>
          <w-button bg-color="light-blue" color="white" round shadow
            @click="settings.changePassword = false">CANCEL</w-button>
        </div>

      </div>

      <div v-if="settings.loading">
        <w-progress class="mt4" color="yellow" bg-color="cyan" size="2.5em"></w-progress>
      </div>

    </w-flex>

  </w-dialog>
</template>