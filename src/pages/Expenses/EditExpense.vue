<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<!-- Cleaned up using Google Bard -->
<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
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
} from '../../models/expense/expenseDetails';
import ExpenseForm from '../../components/expenses/ExpenseFormCtrl.vue';
import { useQuasar } from 'quasar';
import OCSaveButton from 'src/components/OCcomponents/OC-SaveButton.vue';

const expenseDetailsStore = useExpenseDetailsStore();
const expenseListStore = useExpenseListsStore();

const router = useRouter();
const route = useRoute();
const $q = useQuasar();

const id = computed(() => {
  return route.params.id;
});

const fromDate = route.params.fromDate;

onMounted(async () => {
  try {
    await expenseDetailsStore.getExpenseDetailById(id.value);
    await expenseListStore.getExpensesList();
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      await router.push({ path: '/expensesAll' });
    });
  }
});

const expenseDetail = computed(() => {
  return expenseDetailsStore.ExpenseDetails;
});

const expensePeriod = computed(() => {
  return expenseListStore.PeriodList;
});

const period = computed(() => {
  return expensePeriod.value.find((y) => y.start.toString() === fromDate);
});

const childComponent = ref(null);

async function onSubmit() {
  // e.preventDefault();
  try {
    if (!childComponent.value.validateAll()) return;
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
      airTravelExpense: expenseDetail.value
        ?.airTravelExpense as airTravelExpense,
      hotelExpense: expenseDetail.value?.hotelExpense as hotelExpense,
      mileageExpense: expenseDetail.value?.mileageExpense as mileageExpense,
      telephoneExpense: expenseDetail.value
        ?.telephoneExpense as telephoneExpense,
      taxiExpense: expenseDetail.value?.taxiExpense as taxiExpense,
      currency: '',
      security: [],
    };

    await expenseDetailsStore.editExpense(editExpense);
    router.go(-2);
  } catch (error) {
    console.log(`*** Edit Expense:onSubmit(...):catch: ${error} ***`);
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      console.log('*** Edit Expense:onSubmit(...):onOK ***');
    });
  }
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
        <OCSaveButton @handleClick="onSubmit"></OCSaveButton>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form @submit="onSubmit" class="q-gutter-md">
        <div>
          <ExpenseForm
            ref="childComponent"
            v-if="expenseDetail"
            :expenseDetail="expenseDetail"
            :period="period?.name"
          />
        </div>
      </q-form>
    </q-page-container>
  </q-layout>
</template>

<style></style>
