<!-- eslint-disable vue/no-mutating-props -->
<script setup>
import { defineProps, ref, onMounted, onUpdated, computed, watch } from 'vue';
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

const props = defineProps(['expenseDetail', 'period']);

const expenseTypeName = ref('')
watch(
  () => props.expenseDetail,
  (newVal) => {
    if (newVal) {
      expenseTypeName.value = props.expenseDetail.expenseTypeName;
    }
  }
);

//const expenseTypeName = ref(props.expenseDetail.expenseTypeName);
//const expenseTypeName = computed(() => {
// debugger;
// const expenseTypeName = props.expenseDetail.expenseTypeName;
// console.log('To test expense name', expenseTypeName)
// const expenseType = expenseTypeOptions.value.find(
//   (x) => x.expenseTypeName === expenseTypeName.value
// );
// console.log('To test expense type', expenseType)
// const isBillableModify = expenseType.isBillableModify;
//return isBillableModify
//console.log('Testing', test.value)
//return test.value;
//});

// watch(expenseTypeName, (newValue, oldValue) => {
//   console.log(`ExpenseType Name changed from ${oldValue} to ${newValue}`)
// });

// const expenseTypeObject = props.expenseDetail.

// const expenseDetailsStore = useExpenseDetailsStore();

// const editExpenseData = expenseDetailsStore.getExpenseDetailById(props.editExpenseId);

// const expenseDetails = computed(() => {
//   return editExpenseData.ExpenseDetails;
// });


// console.log('Edit expense details', expenseDetails.value)



const expenseListsStore = useExpenseListsStore();

onMounted(() => {
  expenseListsStore.getExpensesList();
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

const period = computed(() => {
  return props.period;
});

const datesList = computed(() => {
  return expenseListsStore.getDatesBetweenStartEnd(period);
});

// const expenseTypeOptions1 = computed(() => {
//   const expenseTypeName = 'AIRFARE';
//   const relevantExpenseType = expenseTypeOptions.value.find(
//     (x) => x.expenseTypeName === expenseTypeName
//   );
//   console.log('relevantExpenseType -', relevantExpenseType)
//   const isBillableModify = relevantExpenseType ? relevantExpenseType.isBillableModify : null;

//   console.log('Is billable modify -', isBillableModify)
//   return isBillableModify;
// })

// console.log('Testing is billable modify -', expenseTypeOptions1.value)

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

const airTravel = ref({
  arrivalAirport: '',
  arrivalDate: '',
  departureAirport: '',
  departureDate: '',
});

const autoRental = ref({
  rentalAgency: '',
  city: '',
  fromDate: '',
  toDate: '',
});

const isBillableModify = ref(false);

const expenseTypeDefault = 'Select Expense Type';

if (props.expenseDetail.expenseTypeName == '') {
  props.expenseDetail.expenseTypeName = expenseTypeDefault;
  isBillableModify.value = true;
}

watch([expenseTypeName], ([newTest]) => {
  getExpenseTypeDetail(newTest);
});

function getExpenseTypeDetail(event) {
  if (event == null) {
    event = expenseTypeName.value;
  }
  const expenseType = expenseTypeOptions.value.find(
    (x) => x.expenseTypeName === event
  );

  isBillableModify.value = expenseType.isBillableModify;
  props.expenseDetail.billable = expenseType.isBillable;

  switch (event) {
    case 'AIRFARE':
      props.expenseDetail.autoRentalExpense = null;
      break;
    case 'AUTORENTAL':
      props.expenseDetail.airTravelExpense = null;
      break;
  }
}

const date = ref('');
// const datesList = ref([]);

// const getDatesBetween = (startDate, endDate) => {
//   const dates = [];

//   const startDateUnix = new Date(startDate).getTime();
//   const endDateUnix = new Date(endDate).getTime();

//   // Calculate the difference between the start and end dates in days
//   const dayDifference = (endDateUnix - startDateUnix) / (1000 * 60 * 60 * 24);

//   // Iterate over the days and add them to the array
//   for (let i = 0; i <= dayDifference; i++) {
//     const date = new Date(startDateUnix + (i * 1000 * 60 * 60 * 24));
//     dates.push(date);
//   }

//   const formattedDates = dates.map((date) => {
//     return {
//       label: `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}(${date.toLocaleDateString('en-US', { weekday: 'short' })})`,
//       value: date.toISOString(),
//     };
//   });

//   datesList.value = formattedDates;

//   console.log('testing dates', formattedDates)

//   // Return the array of dates
//   return formattedDates;
// };


// const getDatesBetweenStartEnd = () => {

//   const expensePeriod = periodOptions.value.find(
//     (x) => x.name === props.period.value
//   );

//   const dateStart = expensePeriod?.start;
//   const dateEnd = expensePeriod?.end;

//   console.log('Dates between start and end', dateStart, dateEnd)

//   getDatesBetween(dateStart, dateEnd);

// }
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <div>
    <div class="q-pa-md">
      <div class="q-gutter-y-md column">
        <q-item-label caption class="q-pt-md"> Period </q-item-label>
        <q-item-label class="q-mb-sm">
          {{ period }}
        </q-item-label>
        <q-select label="Dates" v-model="date" :options="datesList" map-options option-value="value" option-label="label"
          emit-value />
        <q-select label="Expense Date" v-model="expenseDetail.expenseDate" :options="dateOptions" map-options
          emit-label />

        <q-select label="Customer: Project" v-model="expenseDetail.projectName" :options="customerProjectOptions"
          option-label="name" option-value="name" map-options emit-value />

        <q-select label="Expense Type" v-model="expenseDetail.expenseTypeName" :options="expenseTypeOptions"
          :rules="[(val) => val !== expenseTypeDefault || 'Please select expense type..']"
          @update:model-value="getExpenseTypeDetail" option-label="expenseName" emit-value option-value="expenseTypeName"
          map-options />
        <airTravelExpenseForm
          :airTravel="props.expenseDetail.airTravelExpense == null ? props.expenseDetail.airTravelExpense = airTravel : props.expenseDetail.airTravelExpense"
          v-if="expenseDetail.expenseTypeName == 'AIRFARE'" />

        <autoRentalExpenseForm
          :autoRental="props.expenseDetail.autoRentalExpense == null ? props.expenseDetail.autoRentalExpense = autoRental : props.expenseDetail.autoRentalExpense"
          v-if="expenseDetail.expenseTypeName == 'AUTORENTAL'" />

        <q-toggle label="Billable" :false-value="false" :true-value="true" :disable="!isBillableModify" color="primary"
          keep-color v-model="expenseDetail.billable" option-value="expenseTypeName" map-options></q-toggle>
        <div v-if="isBillableModify === false" caption class="q-mb-md text-italic">
          <!-- <q-item-label class="q-mb-sm">
              {{ newValue }}
            </q-item-label> -->
          <q-icon name="hide_source" /> You do not permission to edit this item
        </div>

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
