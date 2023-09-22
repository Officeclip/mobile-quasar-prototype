<script setup lang="ts">
import { defineProps, ref, Ref } from 'vue';
import { telephoneExpense } from '../../../models/expense/expenseDetails';

const props = defineProps(['expense']);
const telephoneExpense: Ref<telephoneExpense | undefined> = ref();
// eslint-disable-next-line vue/no-setup-props-destructure
telephoneExpense.value = props.expense;
//debugger;
console.log(`telephoneExpense: ${props.expense}`);
</script>

<template>
  <q-item-label caption> Phone Number </q-item-label>
  <q-item-label class="q-mb-sm">
    {{ telephoneExpense?.phoneNumber }}
  </q-item-label>
  <q-item-label caption> City </q-item-label>
  <q-item-label class="q-mb-sm">
    {{ telephoneExpense?.city }}
  </q-item-label>
</template>
