<script setup>
import { defineProps } from 'vue';
import { QSpinner } from 'quasar';

defineProps({
  visible: {
    type: Boolean,
    default: true,
  },
  size: {
    type: String,
    default: '50px',
  },
  color: {
    type: String,
    default: 'primary',
  },
  thickness: {
    type: Number,
    default: 5,
  },
  message: {
    type: String,
    default: 'Loading, please wait...',
  },
});
</script>
<template>
  <div class="loader-container flex flex-center" v-if="visible">
    <q-card>
      <q-card-section class="flex flex-center">
        <q-spinner
          :size="size"
          :color="color"
          :thickness="thickness"
          class="q-mr-md"
        />
        <div v-if="message" class="loader-message">
          {{ message }}
        </div></q-card-section
      >
    </q-card>
  </div>
</template>

<style scoped>
.loader-container {
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 9999;
}

.loader-message {
  /* margin-top: 10px; */
  font-size: 1.3em;
  /* color: var(--q-color-primary); */
}
</style>
