<script setup lang="ts">
import { global } from '../tools/global';
</script>

<template>
  <w-dialog v-model="global.popup.open" :overlay-opacity="0.5" :width="500" :persistent="true"
    :persistent-no-animation="false" title-class="primary-light1--bg white" color="blue-dark3">

    <div v-if="!global.popup.error">
      <w-toolbar bg-color="blue-light5" color="blue-dark3">
        <w-flex align-center column justify-center>
          <b> {{ global.popup.title || "Success!" }}</b>
        </w-flex>
      </w-toolbar>
    </div>

    <div v-if="global.popup.error">
      <w-toolbar bg-color="error" color="white" shadow>
        <w-flex align-center column justify-center>
          <b> {{ global.popup.title || "Error" }}</b>
          <w-icon class="ma2" lg color="white">
            fa fa-exclamation-triangle
          </w-icon>
        </w-flex>
      </w-toolbar>
    </div>


    <br />

    <w-flex align-center column justify-center>
      {{ global.popup.message || "There should be a message here." }}
    </w-flex>

  </w-dialog>
</template>
