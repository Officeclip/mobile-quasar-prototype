<!-- eslint-disable vue/no-setup-props-destructure -->
<script setup>
import { defineProps, ref } from 'vue';

const props = defineProps(['mileage', 'isDetailRequired']);

const dense = ref(false);
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <div class="q-ma-lg">
    <div class="q-ml-sm">
      <q-input v-model="props.mileage.mileage" label="Mileage" :label-color="props.isDetailRequired ? 'red' : ''"
        placeholder="enter mileage" :dense="dense" lazy-rules
        :rules="[(val) => (val && val.length > 0 || !props.isDetailRequired) || 'enter mileage']">
      </q-input>
    </div>
  </div>
</template>
<style scoped>
.required {
  color: red;
}
</style>
