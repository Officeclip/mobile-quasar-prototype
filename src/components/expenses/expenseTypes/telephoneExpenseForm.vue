<!-- eslint-disable vue/no-setup-props-destructure -->
<script setup>
import { defineProps, ref } from 'vue';

const props = defineProps(['telephone', 'isDetailRequired']);

const dense = ref(false);
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <div class="q-ma-lg">
    <div class="q-ml-sm">
      <q-input v-model="props.telephone.phoneNumber" label="Phone Number"
        :label-color="props.isDetailRequired ? 'red' : ''" placeholder="enter phone number" :dense="dense" lazy-rules
        :rules="[(val) => (val && val.length > 0 || !props.isDetailRequired) || 'enter phone number']">
      </q-input>
      <q-input v-model="props.telephone.city" label="City" :label-color="props.isDetailRequired ? 'red' : ''"
        placeholder="enter city name" :dense="dense" lazy-rules
        :rules="[(val) => (val && val.length > 0 || !props.isDetailRequired) || 'enter city name']">
      </q-input>
    </div>
  </div>
</template>
<style scoped>
.required {
  color: red;
}
</style>
