<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<!-- Cleaned up using Google Bard -->
<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useExpenseDetailsStore } from '../../stores/expense/expenseDetailsStore';
import { useExpenseListsStore } from '../../stores/expense/expenseListsStore';
import { useRouter, useRoute } from 'vue-router';
import {
  airTravelExpense,
  autoRentalExpense,
  hotelExpense,
  mileageExpense,
  taxiExpense,
  telephoneExpense,
  expenseDetails,
  idName,
} from '../../models/expense/expenseDetails';
import ExpenseForm from '../../components/expenses/ExpenseFormCtrl.vue';

const expenseDetailsStore = useExpenseDetailsStore();
const expenseListStore = useExpenseListsStore();

const router = useRouter();
const route = useRoute();

const id = computed(() => {
  return route.params.id;
});

const fromDate = route.params.fromDate;

onMounted(() => {
  expenseDetailsStore.getExpenseDetailById(id.value);
  expenseListStore.getExpensesList();
});

const expenseDetail = computed(() => {
  return expenseDetailsStore.ExpenseDetails;
});

// const customerProject = computed(() => {
//   // return expenseDetailsStore.customerProjectName;
//   return {
//     id: expenseDetailsStore.customerProjectId,
//     name: expenseDetailsStore.customerProjectName,
//   };
// });

const expensePeriod = computed(() => {
  return expenseListStore.PeriodList;
});

const period = computed(() => {
  return expensePeriod.value.find((y) => y.start.toString() === fromDate);
});

console.log('Edit expense get period:', period);

function onSubmit(e: any) {
  e.preventDefault();
  // const formData = new FormData(e.target);
  // const expenseDate = formData.get('newcreatedDate');
  // const taskDate = formData.get('newtaskDate');

  const editExpense: expenseDetails = {
    accountName: expenseDetail.value?.accountName as string,
    accountSid: expenseDetail.value?.accountSid as string,
    amount: Number(expenseDetail.value?.amount),
    billable: expenseDetail.value?.billable as boolean,
    comments: expenseDetail.value?.comments as string,
    description: expenseDetail.value?.description as string,
    employeeFullName: expenseDetail.value?.employeeFullName as string,
    employeeSid: expenseDetail.value?.employeeSid as string,
    expenseDate: expenseDetail.value?.expenseDate as string,
    id: expenseDetail.value?.id as string,
    expenseSid: expenseDetail.value?.expenseSid as string,
    expenseTypeName: expenseDetail.value?.expenseTypeName as string,
    expenseCategoryName: expenseDetail.value?.expenseCategoryName as string,
    expenseTypeSid: expenseDetail.value?.expenseTypeSid as string,
    projectName: expenseDetail.value?.projectName as string,
    projectSid: expenseDetail.value?.projectSid as string,
    tax: Number(expenseDetail.value?.tax),
    paymentType: expenseDetail.value?.paymentType as string,
    autoRentalExpense: expenseDetail.value
      ?.autoRentalExpense as autoRentalExpense,
    airTravelExpense: expenseDetail.value?.airTravelExpense as airTravelExpense,
    hotelExpense: expenseDetail.value?.hotelExpense as hotelExpense,
    mileageExpense: expenseDetail.value?.mileageExpense as mileageExpense,
    telephoneExpense: expenseDetail.value?.telephoneExpense as telephoneExpense,
    taxiExpense: expenseDetail.value?.taxiExpense as taxiExpense,
    accountProjectIdName: expenseDetail.value?.accountProjectIdName as idName,
    //accountProjectName: expenseDetail.value?.accountProjectName as string,
  };
  // debugger;
  // if (expenseDetail.value) {
  //   const lite = expenseDetailsStore.convertExpenseDetailsToLite(
  //     expenseDetail.value
  //   );
  //   console.log(`lite: ${lite}`);
  //}
  // expenseDetailsStore.editExpense(editExpense);
  // router.push('-2');

  // console.log(`customerProject: ${customerProject.value.name}`);

  const str = JSON.stringify(editExpense);
  console.log(`onSubmit Expense Value: ${str}`);
}
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn
          @click="$router.go(-1)"
          flat
          round
          dense
          color="white"
          icon="arrow_back"
        >
        </q-btn>
        <q-toolbar-title>Edit Expense</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form @submit="onSubmit" class="q-gutter-md">
        <div>
          <ExpenseForm
            v-if="expenseDetail"
            :expenseDetail="expenseDetail"
            :period="period?.name"
          />
          <q-btn
            class="q-ml-md q-mb-md"
            label="Submit"
            type="submit"
            color="primary"
          >
          </q-btn>
        </div>
      </q-form>
    </q-page-container>
  </q-layout>
</template>

<style></style>
