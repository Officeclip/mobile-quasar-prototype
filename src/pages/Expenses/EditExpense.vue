<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<!-- Cleaned up using Google Bard -->
<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useExpenseDetailsStore } from '../../stores/expense/expenseDetailsStore';
import { useRouter, useRoute } from 'vue-router';
import ExpenseForm from '../../components/expenses/ExpenseFormCtrl.vue';
import { expenseDetails } from 'src/models/expense/expenseDetails';

const expenseDetailsStore = useExpenseDetailsStore();

const router = useRouter();
const route = useRoute();

onMounted(() => {
  expenseDetailsStore.getExpenseDetails(route.params.id);
});

const expenseDetails = computed(() => {
  console.log('Edit expense', expenseDetailsStore.ExpenseDetails[0])
  return expenseDetailsStore.ExpenseDetails[0];
});

function onSubmit(e: any) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const expenseDate = formData.get('newcreatedDate');
  const taskDate = formData.get('newtaskDate');

  const editExpense: expenseDetails = {
    expnseSid: expenseDetails.value?.expenseSid,
    accountName: expenseDetails.value?.accountName,
    projectName: expenseDetails.value?.projectName,
    isBillable: expenseDetails.value?.billable,
    description: expenseDetails.value?.description,
    expenseDate: expenseDate,
    taskDate: taskDate,
    totalAmount: expenseDetails.value?.amount,
  };

  expenseDetailsStore.editExpense(editExpense);
  router.push('-2');
}
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn @click="$router.go(-1)" flat round dense color="white" icon="arrow_back">
        </q-btn>
        <q-toolbar-title>Edit Expense</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form @submit="onSubmit" class="q-gutter-md">
        <div>
          <ExpenseForm :expenseDetail="expenseDetails" />
          <q-btn class="q-ml-md q-mb-md" label="Submit" type="submit" color="primary">
          </q-btn>
        </div>
      </q-form>
    </q-page-container>
  </q-layout>
</template>

<style></style>
