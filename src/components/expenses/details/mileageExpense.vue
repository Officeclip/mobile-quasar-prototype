<script setup lang="ts">
import { defineProps, ref, Ref } from 'vue';
import { mileageExpense } from '../../../models/expense/expenseDetails';

const props = defineProps(['expense']);
const mileageExpense: Ref<mileageExpense | undefined> = ref();
// eslint-disable-next-line vue/no-setup-props-destructure
mileageExpense.value = props.expense;
//debugger;
console.log(`mileageExpense: ${props.expense}`);
</script>

<template>
  <q-item-label caption> Mileage </q-item-label>
  <q-item-label class="q-mb-sm">
    {{ mileageExpense?.mileage }} (miles)
  </q-item-label>
</template>
