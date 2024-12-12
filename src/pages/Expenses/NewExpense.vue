<script setup lang="ts">
import ExpenseForm from '../../components/expenses/ExpenseFormCtrl.vue';
import { useExpenseDetailsStore } from '../../stores/expense/expenseDetailsStore';
import { useRoute, useRouter } from 'vue-router';
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import OCSaveButton from 'src/components/OCcomponents/OC-SaveButton.vue';

const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const fromDate = route.params.fromDate;
const toDate = route.params.toDate;
const expenseDetailsStore = useExpenseDetailsStore();

const expenseSid = computed(() => {
  return route.params.expenseSid;
});

const expenseDetail = ref({
  accountName: '',
  accountSid: '',
  amount: Number(''),
  billable: true,
  comments: '',
  description: '',
  employeeFullName: '',
  employeeSid: '',
  expenseDate: '',
  id: '',
  expenseSid: expenseSid,
  expenseTypeName: '',
  expenseCategoryName: '',
  expenseTypeSid: '',
  projectName: '',
  projectSid: '',
  tax: Number(''),
  paymentType: '',
  autoRentalExpense: null,
  airTravelExpense: null,
  hotelExpense: null,
  mileageExpense: null,
  telephoneExpense: null,
  taxiExpense: null,
  security: [],
});

const childComponent = ref(null);

async function onSubmit(e: any) {
  try {
    if (!childComponent.value.validateAll()) return;
    const newExpense: any = {
      accountName: expenseDetail.value.accountName,
      accountSid: expenseDetail.value.accountSid,
      amount: expenseDetail.value.amount,
      billable: expenseDetail.value.billable,
      comments: expenseDetail.value.comments,
      description: expenseDetail.value.description,
      employeeFullName: expenseDetail.value.employeeFullName,
      employeeSid: expenseDetail.value.employeeSid,
      expenseDate: expenseDetail.value.expenseDate,
      id: expenseDetail.value.id,
      expenseSid: expenseDetail.value.expenseSid
        ? expenseDetail.value.expenseSid !== '0'
          ? expenseDetail.value.expenseSid
          : ''
        : '',
      expenseTypeName: expenseDetail.value.expenseTypeName,
      expenseCategoryName: expenseDetail.value.expenseCategoryName,
      expenseTypeSid: expenseDetail.value.expenseTypeSid,
      projectName: expenseDetail.value.projectName
        ? expenseDetail.value.projectName
        : '',
      projectSid: expenseDetail.value.projectSid
        ? expenseDetail.value.projectSid
        : '',
      tax: expenseDetail.value.tax,
      paymentType: expenseDetail.value.paymentType,
      autoRentalExpense: expenseDetail.value.autoRentalExpense,
      airTravelExpense: expenseDetail.value.airTravelExpense,
      hotelExpense: expenseDetail.value.hotelExpense,
      mileageExpense: expenseDetail.value.mileageExpense,
      telephoneExpense: expenseDetail.value.telephoneExpense,
      taxiExpense: expenseDetail.value.taxiExpense,
    };
    await expenseDetailsStore.addExpense(newExpense);
    router.go(-2);
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
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
        <q-toolbar-title> New Expense</q-toolbar-title>
        <OCSaveButton @handleClick="onSubmit"></OCSaveButton>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form @submit="onSubmit" class="q-gutter-md">
        <div>
          <ExpenseForm
            v-if="expenseDetail"
            :expenseDetail="expenseDetail"
            :fromDate="fromDate"
            :toDate="toDate"
            ref="childComponent"
          />
          <q-btn
            label="Reset"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          ></q-btn>
        </div>
      </q-form>
    </q-page-container>
  </q-layout>
</template>
