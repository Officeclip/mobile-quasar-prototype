<script setup lang="ts">
import { defineProps, ref, Ref } from 'vue';
import { taxiExpense } from '../../../models/expense/expenseDetails';

const props = defineProps(['expense']);
const taxi: Ref<taxiExpense | undefined> = ref();
// eslint-disable-next-line vue/no-setup-props-destructure
taxi.value = props.expense;
</script>

<template>
  <q-item-label caption> Taxi Line Name </q-item-label>
  <q-item-label class="q-mb-sm">
    {{ taxi?.taxiLineName }}
  </q-item-label>
  <q-item-label caption> City </q-item-label>
  <q-item-label class="q-mb-sm">
    {{ taxi?.city }}
  </q-item-label>
</template>
