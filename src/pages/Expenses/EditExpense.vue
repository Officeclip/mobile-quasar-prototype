<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<!-- Cleaned up using Google Bard -->
<script setup lang="ts">
import { onMounted, computed, onBeforeMount } from 'vue';
import { useExpenseDetailsStore } from '../../stores/expense/expenseDetailsStore';
import { useRouter, useRoute } from 'vue-router';
import {
  airTravelExpense,
  autoRentalExpense,
  hotelExpense,
  mileageExpense,
  taxiExpense,
  telephoneExpense,
  expenseDetails
} from '../../models/expense/expenseDetails';
import ExpenseForm from '../../components/expenses/ExpenseFormCtrl.vue';

const expenseDetailsStore = useExpenseDetailsStore();

const router = useRouter();
const route = useRoute();

onMounted(async () => {
  console.log('Edit Expense Id from route', route.params.id)
  await expenseDetailsStore.getExpenseDetailById('GJJBNHFCCCVEWCA3AZGYY69S5GFB669SF4TM6LQ1');
});

const expenseDetail = computed(() => {
  console.log('Edit expense details', expenseDetailsStore.ExpenseDetails)
  return expenseDetailsStore.ExpenseDetails;
});

function onSubmit(e: any) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const expenseDate = formData.get('newcreatedDate');
  const taskDate = formData.get('newtaskDate');

  const editExpense: expenseDetails = {

    accountName: expenseDetail.value?.accountName as string,
    id: expenseDetail.value?.id as string,
    amount: expenseDetail.value?.amount as number,
    billable: expenseDetail.value?.billable as boolean,
    comments: expenseDetail.value?.comments as string,
    description: expenseDetail.value?.description as string,
    employeeFullName: expenseDetail.value?.employeeFullName as string,
    employeeSid: expenseDetail.value?.employeeSid as string,
    expenseDate: expenseDetail.value?.expenseDate as string,
    expenseDetailSid: expenseDetail.value?.expenseDetailSid as string,
    expenseSid: expenseDetail.value?.expenseSid as string,
    expenseTypeName: expenseDetail.value?.expenseTypeName as string,
    expenseCategoryName: expenseDetail.value?.expenseCategoryName as string,
    expenseTypeSid: expenseDetail.value?.expenseTypeSid as string,
    projectName: expenseDetail.value?.projectName as string,
    projectSid: expenseDetail.value?.projectSid as string,
    tax: expenseDetail.value?.tax as number,
    paymentType: expenseDetail.value?.paymentType as string,
    autoRentalExpense: expenseDetail.value?.autoRentalExpense as autoRentalExpense,
    airTravelExpense: expenseDetail.value?.airTravelExpense as airTravelExpense,
    hotelExpense: expenseDetail.value?.hotelExpense as hotelExpense,
    mileageExpense: expenseDetail.value?.mileageExpense as mileageExpense,
    telephoneExpense: expenseDetail.value?.telephoneExpense as telephoneExpense,
    taxiExpense: expenseDetail.value?.taxiExpense as taxiExpense
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
          <ExpenseForm :expenseDetail="expenseDetail" />
          <q-btn class="q-ml-md q-mb-md" label="Submit" type="submit" color="primary">
          </q-btn>
        </div>
      </q-form>
    </q-page-container>
  </q-layout>
</template>

<style></style>
