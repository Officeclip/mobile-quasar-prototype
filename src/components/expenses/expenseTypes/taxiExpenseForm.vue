<!-- eslint-disable vue/no-setup-props-destructure -->
<script setup>
import { defineProps, ref, computed } from 'vue';
import dateTimeHelper from '../../../helpers/dateTimeHelper';

const props = defineProps(['taxi', 'isDetailRequired']);

const dense = ref(false);
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <div>
    <div class="q-pa-md">
      <div class="q-gutter-y-md column">
        <q-input v-model="props.taxi.taxiLineName" label="Taxi Line Name"
          :label-color="props.isDetailRequired ? 'red' : ''" placeholder="enter taxi line name" :dense="dense" lazy-rules
          :rules="[(val) => (val && val.length > 0 || !props.isDetailRequired) || 'enter taxi line name']">
        </q-input>
        <q-input v-model="props.taxi.city" label="City" :label-color="props.isDetailRequired ? 'red' : ''"
          placeholder="enter city name" :dense="dense" lazy-rules
          :rules="[(val) => (val && val.length > 0 || !props.isDetailRequired) || 'enter city name']">
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
