<script setup lang="ts">
import { ref } from 'vue';
import { databaseMutate } from '../tools/dbTools';
import { setCookies } from '../tools/jwtTools';
import { global } from '../tools/global';

const user = ref({
  username: "",
  email: "",
  password: ""
})

const settings = ref({
  loading: false,
  validators: {
    required: value => !!value || 'This field is required',
  }
})

const register = async () => {
  let body: BodyInit = JSON.stringify(user.value)
  settings.value.loading = true
  let r: { success: Boolean, resp: any } = await databaseMutate("/register", body, "POST", false)
  settings.value.loading = false
  if (r?.success) {
    setCookies(r?.resp?.token, r?.resp?.user, r?.resp?.id)
    global.setPopup(false, "Success", "You've created a new account!", 1500)
    global.setName()
    global.state.register = false
    resetForm()
    return
  }
  try {
    if (r?.error && r?.error.includes("username")) {
      global.setPopup(true, "Huston, we have a problem.", "We're sorry, but that username is already taken.", 2500)
      user.value.username = ""
      return
    }
  }
  catch { }
  global.setPopup(true, "Huston, we have a problem.", "Looks like we're having some issues, please try again.", 2500)

}


const resetForm = () => {
  user.value.username = ""
  user.value.password = ""
  user.value.email = ""
}

const openLogin = () => {
  global.state.login = true
  global.state.register = false
}

</script>

<template>
  <w-dialog v-model="global.state.register" :width="500" :persistent="true" :persistent-no-animation="false"
    title-class="primary-light1--bg white" color="blue-dark3">

    <w-toolbar bg-color="blue-light5" color="blue-dark3">
      Register
      <w-flex justify-end>
        <w-button bg-color="blue-light5" color="error" @click="global.state.register = false" icon="fa fa-times-circle"
          lg>
        </w-button>
      </w-flex>
    </w-toolbar>

    <w-flex column>
      <div v-if="!settings.loading">
        <br />

        <w-form>
          <w-input class="mb3" v-model="user.username" label="Username" :validators="[settings.validators.required]" />
          <w-input class="mb3" v-model="user.email" label="Email" />
          <w-input class="mb3" v-model="user.password" label="Password" :validators="[settings.validators.required]" />
          <w-button @click="register()" :disabled="user.password == '' || user.username == ''" round xl
            shadow>REGISTER</w-button>
        </w-form>
        <br />

        <h4>Here by mistake?</h4>
        <w-button @click="openLogin()" bg-color="light-blue" color="white" round shadow>LOGIN</w-button>

      </div>

      <div v-if="settings.loading">
        <w-progress class="mt4" color="yellow" bg-color="cyan" size="2.5em"></w-progress>
      </div>

    </w-flex>

  </w-dialog>
</template>