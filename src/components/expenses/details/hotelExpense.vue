<script setup lang="ts">
import { defineProps, ref, Ref } from 'vue';
import { hotelExpense } from '../../../models/expense/expenseDetails';
import dateTimeHelper from '../../../helpers/dateTimeHelper';

const props = defineProps(['expense']);
const hotel: Ref<hotelExpense | undefined> = ref();
// eslint-disable-next-line vue/no-setup-props-destructure
hotel.value = props.expense;
</script>

<template>
  <q-item-label caption class="q-pt-md"> From Date </q-item-label>
  <q-item-label class="q-mb-sm">
    {{ dateTimeHelper.extractDateFromUtc(hotel?.fromDate) }}
  </q-item-label>
  <q-item-label caption> To Date </q-item-label>
  <q-item-label class="q-mb-sm">
    {{ dateTimeHelper.extractDateFromUtc(hotel?.toDate) }}
  </q-item-label>
  <q-item-label caption> Hotel Name </q-item-label>
  <q-item-label class="q-mb-sm">
    {{ hotel?.hotelName }}
  </q-item-label>
  <q-item-label caption> City </q-item-label>
  <q-item-label class="q-mb-sm">
    {{ hotel?.city }}
  </q-item-label>
</template>
