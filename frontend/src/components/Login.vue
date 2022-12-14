<script setup lang="ts">
import { ref } from 'vue';
import { loginUser } from '../tools/jwtTools';
import { global } from '../tools/global';

const user = ref({
  username: "",
  password: ""
})

const settings = ref({
  loading: false,
  validators: {
    required: value => !!value || 'This field is required',
  }
})

const login = async () => {
  settings.value.loading = true;
  let r = await loginUser(String(user.value.username), String(user.value.password))
  settings.value.loading = false;
  if (r?.success == true) {
    global.setPopup(false, "Success", "You've been successfully logged in!", 1500)
    global.setName()
    global.state.login = false
    resetForm()
    return
  }
  global.setPopup(true, "Huston, we have a problem.", "Looks like we couldn't find a match for that username/password.", 2500)
}

const resetForm = () => {
  user.value.username = ""
  user.value.password = ""
  settings.value.loading = false
}

const openRegister = () => {
  global.state.login = false
  global.state.register = true
}

</script>

<template>
  <w-dialog v-model="global.state.login" :width="500" :persistent="true" :persistent-no-animation="false"
    title-class="primary-light1--bg white" color="blue-dark3">


    <w-toolbar bg-color="blue-light5" color="blue-dark3">
      Sign In
      <w-flex justify-end>
        <w-button bg-color="blue-light5" color="error" @click="global.state.login = false" icon="fa fa-times-circle" lg>
        </w-button>
      </w-flex>
    </w-toolbar>


    <w-flex column>
      <div v-if="!settings.loading">
        <br />

        <w-form>
          <w-input class="mb3" v-model="user.username" label="Username" :validators="[settings.validators.required]" />
          <w-input class="mb3" v-model="user.password" label="Password" :validators="[settings.validators.required]" />
          <w-button @click="login()" :disabled="user.password == '' || user.username == ''" round shadow
            xl>LOGIN</w-button>
        </w-form>
        <br />

        <h4>Don't have an account yet?</h4>
        <w-button @click="openRegister()" bg-color="light-blue" color="white" round shadow>REGISTER</w-button>

      </div>

      <div v-if="settings.loading">
        <w-progress class="mt4" color="yellow" bg-color="cyan" size="2.5em"></w-progress>
      </div>

    </w-flex>
  </w-dialog>
</template>