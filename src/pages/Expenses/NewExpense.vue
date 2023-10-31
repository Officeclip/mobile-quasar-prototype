<script setup lang="ts">
import ExpenseForm from '../../components/expenses/ExpenseFormCtrl.vue';
import { useRoute, useRouter } from 'vue-router';
import { ref, computed } from 'vue';

const router = useRouter();
const route = useRoute();

const period = computed(() => {
  return route.params.period;
});

const expenseDetail = ref({
  accountName: '',
  id: '',
  amount: '',
  billable: true,
  comments: '',
  description: '',
  employeeFullName: '',
  employeeSid: '',
  expenseDate: '',
  expenseDetailSid: '',
  expenseSid: '',
  expenseTypeName: '',
  expenseCategoryName: '',
  expenseTypeSid: '',
  projectName: '',
  projectSid: '',
  tax: '',
  paymentType: '',
  fromDate: '',
  autoRentalExpense: null,
  airTravelExpense: null,
  hotelExpense: null,
  mileageExpense: null,
  telephoneExpense: null,
  taxiExpense: null
});

function onSubmit(e: any) {
  e.preventDefault();

  const newExpense: any = {
    accountName: expenseDetail.value.accountName,
    id: expenseDetail.value.id,
    amount: expenseDetail.value.amount,
    billable: expenseDetail.value.billable,
    comments: expenseDetail.value.comments,
    description: expenseDetail.value.description,
    employeeFullName: expenseDetail.value.employeeFullName,
    employeeSid: expenseDetail.value.employeeSid,
    expenseDate: expenseDetail.value.expenseDate,
    expenseDetailSid: expenseDetail.value.expenseDetailSid,
    expenseSid: expenseDetail.value.expenseSid,
    expenseTypeName: expenseDetail.value.expenseTypeName,
    expenseCategoryName: expenseDetail.value.expenseCategoryName,
    expenseTypeSid: expenseDetail.value.expenseTypeSid,
    projectName: expenseDetail.value.projectName,
    projectSid: expenseDetail.value.projectSid,
    tax: expenseDetail.value.tax,
    paymentType: expenseDetail.value.paymentType,
    fromDate: expenseDetail.value.fromDate,
    autoRentalExpense: expenseDetail.value.autoRentalExpense,
    airTravelExpense: expenseDetail.value.airTravelExpense,
    hotelExpense: expenseDetail.value.hotelExpense,
    mileageExpense: expenseDetail.value.mileageExpense,
    telephoneExpense: expenseDetail.value.telephoneExpense,
    taxiExpense: expenseDetail.value.taxiExpense
  };
  const str = JSON.stringify(newExpense);
  console.log(`onSubmit Expense Value: ${str}`);

  //expenseDetailsStore.addExpense(newExpense);

  router.push('/');
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
          <ExpenseForm :expenseDetail="expenseDetail" :period="period" />
          <q-btn class="q-ml-md q-mb-md q-mt-md" label="Submit" type="submit" color="primary"></q-btn>
          <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm"></q-btn>
        </div>
      </q-form>
    </q-page-container>
  </q-layout>
</template>

<style scoped></style>
