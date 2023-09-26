<!-- eslint-disable vue/no-setup-props-destructure -->
<script setup>
import { defineProps, ref, computed } from 'vue';

const props = defineProps(['autoRental']);

const dense = ref(false);

const fromDate = ref('');
const toDate = ref('');

fromDate.value = props.autoRental.fromDate;
toDate.value = props.autoRental.toDate;


const formattedFromDate = computed(() => {
  let dateValue = dateTimeHelper.extractDateFromUtc(fromDate.value);
  return dateValue;
})

const formattedFromDate1 = fromDate.value ? formattedFromDate : fromDate;

const formattedToDate = computed(() => {
  let dateValue = dateTimeHelper.extractDateFromUtc(toDate.value);
  return dateValue;
})

const formattedToDate1 = toDate.value ? formattedToDate : toDate;
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <div>
    <div class="q-pa-md">
      <div class="q-gutter-y-md column">
        <q-input v-model="props.autoRental.rentalAgency" label="Rental Agency *" placeholder="enter rental agency name"
          :dense="dense" lazy-rules :rules="[
            (val) => (val && val.length > 0) || 'enter agency name',
          ]">
        </q-input>
        <q-input v-model="props.autoRental.city" label="City *" placeholder="enter city name" :dense="dense" lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || 'enter city name',
          ]">
        </q-input>
        <q-input name="fromDate" v-model="formattedFromDate1" label="From Date" :rules="[
          (val) => (val && val.length > 0) || 'please select from date',
        ]">
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="dueDate" mask='YYYY-MM-DD'>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-input name="toDate" v-model="formattedToDate1" label="To Date" :rules="[
          (val) => (val && val.length > 0) || 'please select arival date',
        ]">
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="dueDate" mask='YYYY-MM-DD'>
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
  </div>
</template>
