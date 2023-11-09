<!-- eslint-disable vue/no-setup-props-destructure -->
<script setup>
import { defineProps, ref, computed } from 'vue';
import dateTimeHelper from '../../../helpers/dateTimeHelper';

const props = defineProps(['mileage', 'isDetailRequired']);

const dense = ref(false);
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <div>
    <div class="q-pa-md">
      <div class="q-gutter-y-md column">
        <q-input v-model="props.mileage.mileage" label="Mileage" :label-color="props.isDetailRequired ? 'red' : ''"
          placeholder="enter mileage" :dense="dense" lazy-rules
          :rules="[(val) => (val && val.length > 0 || !props.isDetailRequired) || 'enter mileage']">
        </q-input>
      </div>
    </div>
  </div>
</template>
<style scoped>
.required {
  color: red;
}
</style>
