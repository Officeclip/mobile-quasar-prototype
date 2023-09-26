<!-- eslint-disable vue/no-setup-props-destructure -->
<script setup>
import { defineProps, ref, computed } from 'vue';

const props = defineProps(['airTravel']);

const dense = ref(false);

const departureDate = ref('');
const arrivalDate = ref('');

departureDate.value = props.airTravel.departureDate;
arrivalDate.value = props.airTravel.arrivalDate;


const formattedDepartureDate = computed(() => {
  let dateValue = dateTimeHelper.extractDateFromUtc(departureDate.value);
  return dateValue;
})

const formattedDepartureDate1 = departureDate.value ? formattedDepartureDate : departureDate;

const formattedArrivalDate = computed(() => {
  let dateValue = dateTimeHelper.extractDateFromUtc(arrivalDate.value);
  return dateValue;
})

const formattedArrivalDate1 = arrivalDate.value ? formattedArrivalDate : arrivalDate;
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <div>
    <div class="q-pa-md">
      <div class="q-gutter-y-md column">
        <q-input v-model="props.airTravel.departureAirport" label="Departure Airport *"
          placeholder="enter departure airport name" :dense="dense" lazy-rules :rules="[
            (val) => (val && val.length > 0) || 'enter departure airport name',
          ]">
        </q-input>
        <q-input v-model="props.airTravel.arrivalAirport" label="Arrival Airport *"
          placeholder="enter arrival airport name" :dense="dense" lazy-rules :rules="[
            (val) => (val && val.length > 0) || 'enter arrival airport name',
          ]">
        </q-input>
        <q-input name="departureDate" v-model="formattedDepartureDate1" label="Departure Date" :rules="[
          (val) => (val && val.length > 0) || 'please select departure date',
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
        <q-input name="arrivalDate" v-model="formattedArrivalDate1" label="Arrival Date" :rules="[
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
      <!-- <q-list>
        <q-item-label>Testing</q-item-label>
      </q-list> -->
    </div>
  </div>
</template>
