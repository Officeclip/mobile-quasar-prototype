<script setup lang="ts">
import { defineProps, ref, Ref } from 'vue';
import { airTravelExpense } from '../../../models/expense/expenseDetails';
import dateTimeHelper from '../../../helpers/dateTimeHelper';

const props = defineProps(['expense']);
const airTravel: Ref<airTravelExpense | undefined> = ref();
// eslint-disable-next-line vue/no-setup-props-destructure
airTravel.value = props.expense;
</script>

<template>
  <q-item-label caption class="q-pt-md"> Departure Airport </q-item-label>
  <q-item-label class="q-mb-sm">
    {{ airTravel?.departureAirport }}
  </q-item-label>
  <q-item-label caption> Arrival Airport </q-item-label>
  <q-item-label class="q-mb-sm">
    {{ airTravel?.arrivalAirport }}
  </q-item-label>
  <q-item-label caption> Departure Date </q-item-label>
  <q-item-label class="q-mb-sm">
    {{
      dateTimeHelper.formatDateTimeFromRestAPIForUI(
        airTravel?.departureDate as string,
        true,
      )
    }}
  </q-item-label>
  <q-item-label caption> Arrival Date </q-item-label>
  <q-item-label class="q-mb-sm">
    {{
      dateTimeHelper.formatDateTimeFromRestAPIForUI(
        airTravel?.arrivalDate as string,
        true,
      )
    }}
  </q-item-label>
</template>
