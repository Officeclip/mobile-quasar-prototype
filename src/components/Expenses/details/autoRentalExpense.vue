<script setup lang="ts">
import { defineProps, ref, Ref } from 'vue';
import { autoRentalExpense } from '../../../models/expense/expenseDetails';
import dateTimeHelper from '../../../helpers/dateTimeHelper';

const props = defineProps(['expense']);
const autoRentalExpense: Ref<autoRentalExpense | undefined> = ref();
// eslint-disable-next-line vue/no-setup-props-destructure
autoRentalExpense.value = props.expense;
//debugger;
console.log(`autoRentalExpense: ${props.expense}`);
</script>

<template>
  <q-item-label caption> From Date </q-item-label>
  <q-item-label class="q-mb-sm">
    {{ dateTimeHelper.extractDateFromUtc(autoRentalExpense?.fromDate) }}
  </q-item-label>
  <q-item-label caption> To Date </q-item-label>
  <q-item-label class="q-mb-sm">
    {{ dateTimeHelper.extractDateFromUtc(autoRentalExpense?.toDate) }}
  </q-item-label>
  <q-item-label caption> Rental Agency </q-item-label>
  <q-item-label class="q-mb-sm">
    {{ autoRentalExpense?.rentalAgency }}
  </q-item-label>
  <q-item-label caption> City </q-item-label>
  <q-item-label class="q-mb-sm">
    {{ autoRentalExpense?.city }}
  </q-item-label>
</template>
