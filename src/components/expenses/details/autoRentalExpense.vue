<script setup lang="ts">
import { defineProps, ref, Ref } from 'vue';
import { autoRentalExpense } from '../../../models/expense/expenseDetails';
import dateTimeHelper from '../../../helpers/dateTimeHelper';

const props = defineProps(['expense']);
const autoRental: Ref<autoRentalExpense | undefined> = ref();
// eslint-disable-next-line vue/no-setup-props-destructure
autoRental.value = props.expense;
</script>

<template>
  <q-item-label caption class="q-pt-md"> From Date </q-item-label>
  <q-item-label class="q-mb-sm">
    {{ dateTimeHelper.extractDateFromUtc(autoRental?.fromDate) }}
  </q-item-label>
  <q-item-label caption> To Date </q-item-label>
  <q-item-label class="q-mb-sm">
    {{ dateTimeHelper.extractDateFromUtc(autoRental?.toDate) }}
  </q-item-label>
  <q-item-label caption> Rental Agency </q-item-label>
  <q-item-label class="q-mb-sm">
    {{ autoRental?.rentalAgency }}
  </q-item-label>
  <q-item-label caption> City </q-item-label>
  <q-item-label class="q-mb-sm">
    {{ autoRental?.city }}
  </q-item-label>
</template>
