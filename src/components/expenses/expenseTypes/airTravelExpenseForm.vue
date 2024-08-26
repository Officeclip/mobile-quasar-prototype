<!-- eslint-disable vue/no-setup-props-destructure -->
<script lang="ts" setup>
import { defineProps, ref } from 'vue';
import { date, QInput } from 'quasar';

const props = defineProps(['airTravel', 'isDetailRequired']);

const dense = ref(false);
const mask = 'YYYY-MM-DD';

const arrivalAirportRef = ref<QInput>(); // from: https://stackoverflow.com/a/65106524
const departureAirportRef = ref<QInput>();
const departureDateRef = ref<QInput>();
const arrivalDateRef = ref<QInput>();

// const errorMessage = ref('');

// function dateValidation(dateString) {
//   if (!date.isValid(dateString)) {
//     return (errorMessage.value = 'Please enter a valid date');
//   }
//   if (dateString < props.airTravel.departureDate) {
//     return (errorMessage.value =
//       'Arrival Date should be after the Departure Date.');
//   }
// }

const ruleNotEmpty = (val: string) => {
  const condition = (val && val.length > 0) || !props.isDetailRequired;
  return condition ? true : 'This field is required';
};

const validateAll = () => {
  arrivalAirportRef.value?.validate();
  departureAirportRef.value?.validate();
  departureDateRef.value?.validate();
  arrivalDateRef.value?.validate();

  if (
    arrivalAirportRef.value?.hasError ||
    departureAirportRef.value?.hasError ||
    departureDateRef.value?.hasError ||
    arrivalDateRef.value?.hasError
  ) {
    return false;
  } else {
    return true;
  }
};

defineExpose({
  validateAll,
});
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <div class="q-ma-lg">
    <div class="q-ml-sm">
      <q-input
        ref="departureAirportRef"
        v-model="props.airTravel.departureAirport"
        label="Departure Airport"
        placeholder="enter departure airport name"
        :dense="dense"
        :label-color="props.isDetailRequired ? 'red' : ''"
        :rules="[ruleNotEmpty]"
      >
      </q-input>
      <q-input
        ref="arrivalAirportRef"
        v-model="props.airTravel.arrivalAirport"
        label="Arrival Airport"
        placeholder="enter arrival airport name"
        :dense="dense"
        :label-color="props.isDetailRequired ? 'red' : ''"
        :rules="[ruleNotEmpty]"
      >
      </q-input>
      <q-input
        ref="departureDateRef"
        name="departureDate"
        v-model="props.airTravel.departureDate"
        label="Departure Date"
        :label-color="props.isDetailRequired ? 'red' : ''"
        :rules="[ruleNotEmpty]"
      >
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date v-model="props.airTravel.departureDate" :mask="mask">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup color="primary" flat label="Close" />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-input
        ref="arrivalDateRef"
        name="arrivalDate"
        v-model="props.airTravel.arrivalDate"
        label="Arrival Date"
        :label-color="props.isDetailRequired ? 'red' : ''"
        :rules="[ruleNotEmpty]"
      >
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date v-model="props.airTravel.arrivalDate" :mask="mask">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup color="primary" flat label="Close" />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
  </div>
</template>
