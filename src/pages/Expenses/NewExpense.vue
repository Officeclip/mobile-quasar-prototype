<script setup lang="ts">
import ExpenseForm from '../../components/Expenses/ExpenseFormCtrl.vue';
// import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();
const route = useRoute();

const expenseId = route.params.id

console.log('expense Id:', expenseId)

// const timesheetStore = useTimesheetsStore()
const expense = ref({
  createdDate: '',
  accountName: '',
  isBillable: true,
  totalAmount: Number(),
  tax: '',
  description: '',
  comments: ''
});

function onSubmit(e: any) {
  e.preventDefault()

  const newExpense = {
    accountName: expense.value.accountName,
    accountId: '',
    createdDate: expense.value.createdDate,
    createdUserId: '',
    description: expense.value.description,
    isBillable: expense.value.isBillable,
    payrollName: '',
    projectName: '',
    projectId: '',
    totalAmount: expense.value.totalAmount

  }
  console.log(`onSubmit Expense Value: ${{ newExpense }}`);

  router.push('/')
}


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
      <q-form @submit="onSubmit" class="q-gutter-md">
        <div>
          <ExpenseForm :expense="expense" />
          <q-btn class="q-ml-md q-mb-md q-mt-md" label="Submit" type="submit" color="primary"></q-btn>
          <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm"></q-btn>
        </div>
      </q-form>
    </q-page-container>
  </q-layout>
</template>

<style scoped></style>
