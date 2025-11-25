<script setup lang="ts">
import { ref, Ref } from 'vue';
import { mileageExpense } from '../../../models/expense/expenseDetails';

const props = defineProps(['expense']);
const mileage: Ref<mileageExpense | undefined> = ref();

mileage.value = props.expense;
</script>

<template>
  <q-item-label caption> Mileage </q-item-label>
  <q-item-label class="q-mb-sm"> {{ mileage?.mileage }} (miles) </q-item-label>
</template>
