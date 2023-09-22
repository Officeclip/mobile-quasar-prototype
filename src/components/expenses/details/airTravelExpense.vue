<script setup lang="ts">
import { defineProps, ref, Ref } from 'vue';
import { airTravelExpense } from '../../../models/expense/expenseDetails';
import dateTimeHelper from '../../../helpers/dateTimeHelper';

const props = defineProps(['expense']);
const airTravelExpense: Ref<airTravelExpense | undefined> = ref();
// eslint-disable-next-line vue/no-setup-props-destructure
airTravelExpense.value = props.expense;
//debugger;
console.log(`airTravelExpense: ${props.expense}`);
</script>

<template>
  <q-item-label caption class="q-pt-md"> Departure Airport </q-item-label>
  <q-item-label class="q-mb-sm">
    {{ airTravelExpense?.departureAirport }}
  </q-item-label>
  <q-item-label caption> Arrival Airport </q-item-label>
  <q-item-label class="q-mb-sm">
    {{ airTravelExpense?.arrivalAirport }}
  </q-item-label>
  <q-item-label caption> Departure Date </q-item-label>
  <q-item-label class="q-mb-sm">
    {{ dateTimeHelper.extractDateFromUtc(airTravelExpense?.departureDate) }}
  </q-item-label>
  <q-item-label caption> Arrival Date </q-item-label>
  <q-item-label class="q-mb-sm">
    {{ dateTimeHelper.extractDateFromUtc(airTravelExpense?.arrivalDate) }}
  </q-item-label>
</template>
