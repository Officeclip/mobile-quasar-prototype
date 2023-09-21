<script setup lang="ts">
import { defineProps, ref, Ref } from 'vue';
import { autoRentalExpense } from '../../../models/expense/expenseDetails';

const props = defineProps(['expense']);
const autoRentalExpense: Ref<autoRentalExpense | undefined> = ref();
// eslint-disable-next-line vue/no-setup-props-destructure
autoRentalExpense.value = props.expense;
//debugger;
console.log(`autoRentalExpense: ${props.expense}`);
</script>

<template>
  <q-item-section class="q-ma-md">
    <q-item-label caption> From Date </q-item-label>
    <q-item-label class="q-mb-sm">
      {{ autoRentalExpense?.fromDate }}
    </q-item-label>
  </q-item-section>
</template>
