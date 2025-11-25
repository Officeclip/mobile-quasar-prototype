<script setup lang="ts">
import { ref, Ref } from 'vue';
import { telephoneExpense } from '../../../models/expense/expenseDetails';

const props = defineProps(['expense']);
const telephone: Ref<telephoneExpense | undefined> = ref();

telephone.value = props.expense;
</script>

<template>
  <q-item-label caption> Phone Number </q-item-label>
  <q-item-label class="q-mb-sm">
    {{ telephone?.phoneNumber }}
  </q-item-label>
  <q-item-label caption> City </q-item-label>
  <q-item-label class="q-mb-sm">
    {{ telephone?.city }}
  </q-item-label>
</template>
