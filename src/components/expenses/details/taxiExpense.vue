<script setup lang="ts">
import { defineProps, ref, Ref } from 'vue';
import { taxiExpense } from '../../../models/expense/expenseDetails';

const props = defineProps(['expense']);
const taxiExpense: Ref<taxiExpense | undefined> = ref();
// eslint-disable-next-line vue/no-setup-props-destructure
taxiExpense.value = props.expense;
//debugger;
console.log(`taxiExpense: ${props.expense}`);
</script>

<template>
  <q-item-label caption> Taxi Line Name </q-item-label>
  <q-item-label class="q-mb-sm">
    {{ taxiExpense?.taxiLineName }}
  </q-item-label>
  <q-item-label caption> City </q-item-label>
  <q-item-label class="q-mb-sm">
    {{ taxiExpense?.city }}
  </q-item-label>
</template>
