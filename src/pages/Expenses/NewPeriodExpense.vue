<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useExpenseListsStore } from '../../stores/expense/expenseListsStore';

const expenseListsStore = useExpenseListsStore();

onMounted(() => {
  expenseListsStore.getExpensesList();
});

const periodOptions = computed(() => {
  return expenseListsStore.PeriodList;
});

const period: any = ref('');
const errorMsg: any = ref('');
const warningMsg: any = ref('');

watch([period], ([newPeriodModel]) => {
  errorMsg.value = newPeriodModel.error;
  warningMsg.value = newPeriodModel.warning;
});
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn @click="$router.go(-1)" flat round dense color="white" icon="arrow_back">
        </q-btn>
        <q-toolbar-title> New Expense</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page>
        <q-list>
          <q-item v-if="errorMsg || warningMsg">
            <p v-if="errorMsg" class="text-red">{{ errorMsg }}</p>
            <p v-if="warningMsg" class="text-orange">{{ warningMsg }}</p>
          </q-item>
          <q-item>
            <q-select class="full-width" label="Period" v-model="period" :options="periodOptions" map-options
              option-label="name" /></q-item>
          <q-list>
            <q-btn v-if="period != '' && errorMsg == ''" class="q-ml-md q-mb-md q-mt-md" label="Next" color="primary"
              :to="{
          name: 'newExpense',
          params: {
            period: period.name,
            expenseSid: '0'
          },
        }"></q-btn>
          </q-list></q-list>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.error-message {
  color: red;
}
</style>
