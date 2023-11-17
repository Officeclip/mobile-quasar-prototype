<!-- eslint-disable vue/no-setup-props-destructure -->
<script setup>
import { defineProps, ref, computed } from 'vue';
import dateTimeHelper from '../../../helpers/dateTimeHelper';

const props = defineProps(['autoRental', 'isDetailRequired']);

const dense = ref(false);

// const fromDate = ref('');
// const toDate = ref('');

// fromDate.value = props.autoRental.fromDate;
// toDate.value = props.autoRental.toDate;

// const formattedFromDate = computed(() => {
//   let dateValue = dateTimeHelper.extractDateFromUtc(fromDate.value);
//   return dateValue;
// });

// const formattedFromDate1 = fromDate.value ? formattedFromDate : fromDate;

// const formattedToDate = computed(() => {
//   let dateValue = dateTimeHelper.extractDateFromUtc(toDate.value);
//   return dateValue;
// });

// const formattedToDate1 = toDate.value ? formattedToDate : toDate;
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <div class="q-ma-lg">
    <div class="q-ml-sm">
      <q-input v-model="props.autoRental.rentalAgency" label="Rental Agency"
        :label-color="props.isDetailRequired ? 'red' : ''" placeholder="enter rental agency name" :dense="dense"
        lazy-rules :rules="[(val) => (val && val.length > 0 || !props.isDetailRequired) || 'enter agency name']">
      </q-input>
      <q-input v-model="props.autoRental.city" label="City" :label-color="props.isDetailRequired ? 'red' : ''"
        placeholder="enter city name" :dense="dense" lazy-rules
        :rules="[(val) => (val && val.length > 0 || !props.isDetailRequired) || 'enter city name']">
      </q-input>
      <q-input name="fromDate" v-model="props.autoRental.fromDate" label="From Date"
        :label-color="props.isDetailRequired ? 'red' : ''" :rules="[
          (val) => (val && val.length > 0 || !props.isDetailRequired) || 'please select From Date',
        ]">
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="props.autoRental.fromDate" mask="YYYY-MM-DD">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-input name="toDate" v-model="props.autoRental.toDate" label="To Date"
        :label-color="props.isDetailRequired ? 'red' : ''" :rules="[
          (val) => (val && val.length > 0 || !props.isDetailRequired) || 'please select To Date',
        ]">
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="props.autoRental.toDate" mask="YYYY-MM-DD">
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
