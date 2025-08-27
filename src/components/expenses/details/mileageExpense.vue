<script setup lang="ts">
import { defineProps, ref, Ref } from 'vue';
import { mileageExpense } from '../../../models/expense/expenseDetails';

const props = defineProps(['expense']);
const mileage: Ref<mileageExpense | undefined> = ref();
// eslint-disable-next-line vue/no-setup-props-destructure
mileage.value = props.expense;
</script>

<template>
  <q-item-label caption> Mileage </q-item-label>
  <q-item-label class="q-mb-sm"> {{ mileage?.mileage }} (miles) </q-item-label>
</template>
