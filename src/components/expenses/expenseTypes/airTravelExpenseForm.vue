<!-- eslint-disable vue/no-setup-props-destructure -->
<script setup>
import { defineProps, ref, computed } from 'vue';
import dateTimeHelper from '../../../helpers/dateTimeHelper';

const props = defineProps(['airTravel', 'isDetailRequired']);

console.log('AirTravel Form Control - isDetailRequired', props.isDetailRequired)

const dense = ref(false);

// const airtravelData = ref('');
// airtravelData.value = props.airTravel;

// // eslint-disable-next-line vue/no-mutating-props
// props.expenseAirtravelDetail = airtravelData.value

// console.log('expenseDetail Airtravel -', airtravelData.value)



// const departureDate = ref('');
// const arrivalDate = ref('');

// departureDate.value = props.airTravel.departureDate;
// arrivalDate.value = props.airTravel.arrivalDate;


// const formattedDepartureDate = computed(() => {
//   let dateValue = dateTimeHelper.extractDateFromUtc(departureDate.value);
//   return dateValue;
// })

// const formattedDepartureDate1 = departureDate.value ? formattedDepartureDate : departureDate;

// const formattedArrivalDate = computed(() => {
//   let dateValue = dateTimeHelper.extractDateFromUtc(arrivalDate.value);
//   return dateValue;
// })

// const formattedArrivalDate1 = arrivalDate.value ? formattedArrivalDate : arrivalDate;
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <div class="q-ma-lg">
    <div class="q-ml-sm">
      <!-- <pre>{{ airtravelData }}</pre>
        <pre>{{ props.airTravel.departureAirport }}</pre> -->
      <q-input v-model="props.airTravel.departureAirport" label="Departure Airport"
        :label-color="props.isDetailRequired ? 'red' : ''" placeholder="enter departure airport name" :dense="dense"
        lazy-rules
        :rules="[(val) => (val && val.length > 0 || !props.isDetailRequired) || 'enter departure airport name.']">
      </q-input>
      <q-input v-model="props.airTravel.arrivalAirport" label="Arrival Airport"
        :label-color="props.isDetailRequired ? 'red' : ''" placeholder="enter arrival airport name" :dense="dense"
        lazy-rules :rules="[
          (val) => (val && val.length > 0 || !props.isDetailRequired) || 'enter arrival airport name',
        ]">
      </q-input>
      <q-input name="departureDate" v-model="props.airTravel.departureDate" label="Departure Date"
        :label-color="props.isDetailRequired ? 'red' : ''" :rules="[
          (val) => (val && val.length > 0 || !props.isDetailRequired) || 'please select departure date',
        ]">
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="props.airTravel.departureDate" mask='YYYY-MM-DD'>
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-input name="arrivalDate" v-model="props.airTravel.arrivalDate" label="Arrival Date"
        :label-color="props.isDetailRequired ? 'red' : ''" :rules="[
          (val) => (val && val.length > 0 || !props.isDetailRequired) || 'please select arival date',
        ]">
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="props.airTravel.arrivalDate" mask='YYYY-MM-DD'>
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
    <!-- <pre>{{ props.airTravel }}</pre> -->
    <!-- <q-list>
        <q-item-label>Testing</q-item-label>
      </q-list> -->
  </div>
</template>
