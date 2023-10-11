<script setup>
import { defineProps, ref, onMounted, onUpdated, computed } from 'vue';
import { useExpenseListsStore } from '../../stores/expense/expenseListsStore';
import { useExpenseDetailsStore } from '../../stores/expense/expenseDetailsStore';
import airTravelExpenseForm from '../expenses/expenseTypes/airTravelExpenseForm.vue';
import autoRentalExpenseForm from '../expenses/expenseTypes/autoRentalExpenseForm.vue';

// const periodOptions = ref([])
// periodOptions.value = [
//   '2023-07-31',
//   '2023-07-24',
//   '2023-07-17',
//   '2023-07-10',
//   '2023-07-03'
// ]
const dateOptions = ref([]);
dateOptions.value = [
  'Aug 27(Sun)',
  'Aug 28(Mon)',
  'Aug 29(Tue)',
  'Aug 30(Wed)',
  'Aug 31(Thu)',
  'Sep 01(Fri)',
  'Sep 02(Sat)',
];

const sampleModel = ref([]);

const period = ref('');

const props = defineProps(['expenseDetail']);

// const expenseTypeObject = props.expenseDetail.

const expenseDetailsStore = useExpenseDetailsStore();

const editExpenseData = expenseDetailsStore.getExpenseDetailById(props.editExpenseId);

const expenseDetails = computed(() => {
  console.log('Edit expense details', editExpenseData.ExpenseDetails)
  return editExpenseData.ExpenseDetails;
});

const expenseListsStore = useExpenseListsStore();

onMounted(() => {
  expenseListsStore.getExpensesList();
});

onUpdated(() => {
  const selectedValue = sampleModel.value.id;
  console.log('getting the id from option:', selectedValue);
});

const periodOptions = computed(() => {
  return expenseListsStore.PeriodList;
});

const customerProjectOptions = computed(() => {
  return expenseListsStore.CustomerProjectsList;
});

const expenseTypeOptions = computed(() => {
  return expenseListsStore.ExpenseTypes;
});

const paymentTypeOptions = computed(() => {
  return expenseListsStore.PaymentTypes;
});

const expenseTypeOptions1 = computed(() => {
  const expenseTypeName = 'AIRFARE';
  const relevantExpenseType = expenseTypeOptions.value.find(
    (x) => x.expenseTypeName === expenseTypeName
  );
  console.log('relevantExpenseType -', relevantExpenseType)
  const isBillableModify = relevantExpenseType ? relevantExpenseType.isBillableModify : null;

  console.log('Is billable modify -', isBillableModify)
  return isBillableModify;
})

console.log('Testing is billable modify -', expenseTypeOptions1.value)

// function getIsBillableModifyValue(expenseTypeName) {
//   const expenseTypeOption = '';
//   forEach(expenseTypeOption in expenseTypeOptions){

//   };
// }

// const billableOptions = ref([]);
// billableOptions.value = [
//   {
//     label: 'Yes',
//     value: true,
//   },
//   {
//     label: 'No',
//     value: false,
//   },
// ];

/* const paymentMethod = ref([]);
paymentMethod.value = [
  {
    label: 'Personal Cash/Check',
    value: 1,
  },
  {
    label: 'Personal CreditCard',
    value: 2,
  },
  {
    label: 'Company CreditCard',
    value: 3,
  },
]; */

/* const expenseTypes = ref([]);
expenseTypes.value = [
  {
    id: '4A9RY7EVHA8CNSHRJBLNB3HRD6TLYUEXYCYM6LQ',
    name: 'AUTORENTAL',
  },
  {
    id: '4A9RY7EVHA8CNSHRJBLNB3HRD6TLYUEXYCYM6LQ',
    name: 'AIRTRAVEL',
  },
  {
    id: '4A9RY7EVHA8CNSHRJBLNB3HRD6TLYUEXYCYM6LQ',
    name: 'HOTEL',
  },
]; */

// const expenseDate = ref('');
// expenseDate.value = dateTimeHelper.extractDateFromUtc(
//   props.expense.expenseDate
// );

// const taskDate = ref('');
// taskDate.value = 'July 20(Thu)';

const airTravel = ref([{
  arrivalAirport: '',
  arrivalDate: '',
  departureAirport: '',
  departureDate: '',
}]);

// const autoRental = ref([{
//   rentalAgency: 'Sudhakar',
//   city: 'Hyd',
//   fromDate: '',
//   toDate: '',
// }]);

// const autoRental = computed(() => {
//   const data = props.expenseDetail.autoRentalExpense[0];
//   console.log('ExpenseForm - autoRental', data);
//   return data;
// })

//const expenseType = ref('');
// eslint-disable-next-line vue/no-setup-props-destructure
//expenseType.value = props.expenseDetail.expenseTypeName;

// const selectedItem = ref('');
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <div>
    <div class="q-pa-md">
      <div class="q-gutter-y-md column">
        <q-select label="Period" v-model="period" :options="periodOptions" map-options option-label="name" emit-label />

        <q-select label="Expense Date" v-model="expenseDetail.expenseDate" :options="dateOptions" map-options
          emit-label />

        <q-select label="Customer: Project" v-model="expenseDetail.projectName" :options="customerProjectOptions"
          option-label="name" option-value="name" map-options emit-value />

        <q-select label="Expense Type" v-model="expenseDetail.expenseTypeName" :options="expenseTypeOptions"
          option-label="expenseName" emit-value option-value="expenseTypeName" map-options />

        <q-toggle v-if="expenseDetail.isBillable === true" label="Billable" :false-value="false" :true-value="true"
          color="primary" keep-color v-model="newValue" option-value="expenseTypeName" map-options></q-toggle>
        <div v-else caption class="q-mb-md text-italic">
          <q-item-label class="q-mb-sm">
            {{ newValue }}
          </q-item-label>
          <q-icon name="hide_source" /> You do not permission to edit this item
        </div>
        <!-- <pre>{{ airTravel }}</pre> -->
        <!-- <pre>{{ props.expenseDetail.expenseTypeName == '' ? true : false }}</pre> -->
        <airTravelExpenseForm
          :airTravel="props.expenseDetail.airTravelExpense == null ? airTravel : props.expenseDetail.airTravelExpense"
          v-if="expenseDetail.expenseTypeName == 'AIRFARE'" />

        <autoRentalExpenseForm :autoRental="props.expenseDetail.autoRentalExpense"
          v-if="expenseDetail.expenseTypeName == 'AUTORENTAL'" />

        <q-select label="Payment Method" v-model="expenseDetail.paymentType" :options="paymentTypeOptions" map-options
          emit-value option-value="label" />

        <!-- <q-select label="Billable" v-model="expenseDetail.billable" :options="billableOptions" map-options emit-value /> -->
        <q-input label="Amount" v-model="expenseDetail.amount" placeholder="enter here..." lazy-rules type="number"
          :rules="[(val) => (val && val.length > 0) || 'Please type something']">
        </q-input>

        <q-input label="Tax" v-model="expenseDetail.tax" placeholder="enter here...">
        </q-input>

        <q-input label="Description" v-model="expenseDetail.description" placeholder="enter here..." lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please type something']">
        </q-input>

        <q-input label="Comments" v-model="expenseDetail.comments" placeholder="enter here...">
        </q-input>
      </div>
    </div>
  </div>
</template>
<style></style>
