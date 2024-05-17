<!-- eslint-disable vue/no-setup-props-destructure -->
<script setup>
import { defineProps, ref } from 'vue';

const props = defineProps(['hotel', 'isDetailRequired']);

const dense = ref(false);
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <div class="q-ma-lg">
    <div class="q-ml-sm">
      <q-input v-model="props.hotel.hotelName" label="Hotel Name" :label-color="props.isDetailRequired ? 'red' : ''"
        placeholder="enter hotel name" :dense="dense" lazy-rules
        :rules="[(val) => (val && val.length > 0 || !props.isDetailRequired) || 'enter hotel name']">
      </q-input>
      <q-input v-model="props.hotel.city" label="City" :label-color="props.isDetailRequired ? 'red' : ''"
        placeholder="enter city name" :dense="dense" lazy-rules
        :rules="[(val) => (val && val.length > 0 || !props.isDetailRequired) || 'enter city name']">
      </q-input>
      <q-input name="fromDate" v-model="props.hotel.fromDate" label="From Date"
        :label-color="props.isDetailRequired ? 'red' : ''" :rules="[
        (val) => (val && val.length > 0 || !props.isDetailRequired) || 'please select From Date',
      ]">
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="props.hotel.fromDate" mask="YYYY-MM-DD">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-input name="toDate" v-model="props.hotel.toDate" label="To Date"
        :label-color="props.isDetailRequired ? 'red' : ''" :rules="[
        (val) => (val && val.length > 0 || !props.isDetailRequired) || 'please select To Date',
      ]">
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="props.hotel.toDate" mask="YYYY-MM-DD">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
  </div>
</template>
<style scoped>
.required {
  color: red;
}
</style>
