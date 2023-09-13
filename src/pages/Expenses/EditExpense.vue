<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<!-- Cleaned up using Google Bard -->
<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useExpensesStore } from '../../stores/ExpensesStore';
import { useRouter } from 'vue-router';
import ExpenseForm from '../../components/Expenses/ExpenseFormCtrl.vue';

const expensesStore = useExpensesStore();

const router = useRouter();

onMounted(() => {
  expensesStore.getExpenses();
});

const expense = computed(() => {
  return expensesStore.ExpenseDetails[0];
});

function onSubmit(e: any) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const createdDate = formData.get('newcreatedDate');
  const taskDate = formData.get('newtaskDate');

  const newExpense: any = {
    id: expense.value?.id,
    accountName: expense.value?.accountName,
    projectName: expense.value?.projectName,
    isBillable: expense.value?.billable,
    description: expense.value?.description,
    createdDate: createdDate,
    taskDate: taskDate,
    totalAmount: expense.value?.amount
  }

  expensesStore.editExpense(newExpense);
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
          <ExpenseForm :expense="expense" />
          <q-btn class="q-ml-md q-mb-md" label="Submit" type="submit" color="primary">
          </q-btn>
        </div>
      </q-form>
    </q-page-container>
  </q-layout>
</template>

<style></style>
