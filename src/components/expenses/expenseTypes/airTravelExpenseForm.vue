<!-- eslint-disable vue/no-setup-props-destructure -->
<script setup>
import { defineProps, ref } from 'vue';
import { date } from 'quasar';

const props = defineProps(['airTravel', 'isDetailRequired']);

const dense = ref(false);

const errorMessage = ref('');

function dateValidation(dateString) {
  if (!date.isValid(dateString)) {
    return (errorMessage.value = 'Please enter a valid date');
  }
  if (dateString < props.airTravel.departureDate) {
    return (errorMessage.value =
      'Arrival Date should be after the Departure Date.');
  }
}
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <div class="q-ma-lg">
    <div class="q-ml-sm">
      <q-input
        v-model="props.airTravel.departureAirport"
        label="Departure Airport"
        :label-color="props.isDetailRequired ? 'red' : ''"
        placeholder="enter departure airport name"
        :dense="dense"
        lazy-rules
        :rules="[
          (val) =>
            (val && val.length > 0) ||
            !props.isDetailRequired ||
            'enter departure airport name.',
        ]"
      >
      </q-input>
      <q-input
        v-model="props.airTravel.arrivalAirport"
        label="Arrival Airport"
        :label-color="props.isDetailRequired ? 'red' : ''"
        placeholder="enter arrival airport name"
        :dense="dense"
        lazy-rules
        :rules="[
          (val) =>
            (val && val.length > 0) ||
            !props.isDetailRequired ||
            'enter arrival airport name',
        ]"
      >
      </q-input>
      <q-input
        name="departureDate"
        v-model="props.airTravel.departureDate"
        label="Departure Date"
        :label-color="props.isDetailRequired ? 'red' : ''"
        lazy-rules
        :rules="['date']"
        mask="date"
        error-message="Please enter a valid date"
      >
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date v-model="props.airTravel.departureDate">
                <div class="row items-center justify-end">
                  <q-btn
                    v-close-popup
                    label="Close"
                    color="primary"
                    flat
                  ></q-btn>
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-input
        name="arrivalDate"
        v-model="props.airTravel.arrivalDate"
        label="Arrival Date"
        :label-color="props.isDetailRequired ? 'red' : ''"
        lazy-rules
        :rules="[(val) => val && dateValidation(val)]"
        mask="date"
        :error-message="
          errorMessage ? errorMessage : 'Please enter a valid date'
        "
      >
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date v-model="props.airTravel.arrivalDate">
                <div class="row items-center justify-end">
                  <q-btn
                    v-close-popup
                    label="Close"
                    color="primary"
                    flat
                  ></q-btn>
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
  </div>
</template>
