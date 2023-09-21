<script setup>
import { defineProps, ref, onMounted, onUpdated } from 'vue';
import dateTimeHelper from '../../helpers/dateTimeHelper';
import { useExpenseListStore } from '../../stores/ExpenseListStore';
import ExpenseForm from '../../models/Expense/expenseDetail';
import AirTravelExpense from '../../components/Expenses/AirTravelFormCtrl.vue';

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
  'Aug 01(Fri)',
  'Aug 02(Sat)',
];

const sampleModel = ref(null);
const sampleModel2 = ref(null);

const expenseListStore = useExpenseListStore();

onMounted(() => {
  expenseListStore.getExpenseListAll();
});

onUpdated(() => {
  const selectedValue = sampleModel.value.id;
  console.log('getting the id from option:', selectedValue);
});

const periodOptions = ref('');
periodOptions.value = expenseListStore.periodList;

const customerProjectOptions = ref('');
customerProjectOptions.value = expenseListStore.CustomerProjectsList;

const billableOptions = ref([]);
billableOptions.value = [
  {
    label: 'Yes',
    value: true,
  },
  {
    label: 'No',
    value: false,
  },
];

const paymentMethod = ref([]);
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
];

const props = defineProps(['expense']);

const expenseDate = ref('');
expenseDate.value = dateTimeHelper.extractDateFromUtc(
  props.expense.expenseDate
);

const taskDate = ref('');
taskDate.value = 'July 20(Thu)';

const airTravel = ref({
  arrivalAirport: '',
  arrivalDate: '',
  departureAirport: '',
  departureDate: '',
});
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <div>
    <div class="q-pa-md">
      <div class="q-gutter-y-md column">
        <q-select
          name="newcreatedDate"
          label="Period"
          v-model="expenseDate"
          :options="periodOptions"
          map-options
          option-label="name"
          emit-label
        />

        <q-select
          name="newtaskDate"
          label="Expense Date"
          v-model="taskDate"
          :options="dateOptions"
          map-options
          emit-label
        />
        <pre>{{ sampleModel }}</pre>
        <q-select
          label="Customer: Project"
          v-model="sampleModel"
          :options="customerProjectOptions"
          option-label="name"
          option-value="id"
          map-options
          @update:model-value="handleSelectChange"
        />

        <!-- <AirTravelExpense :air-travel="airTravel" /> -->

        <q-select
          label="Payment Method"
          v-model="props.expense.paymentMethod"
          :options="paymentMethod"
          map-options
        />

        <q-select
          label="Billable"
          v-model="props.expense.isBillable"
          :options="billableOptions"
          map-options
          emit-value
        />
        <q-input
          label="Amount"
          v-model="props.expense.totalAmount"
          placeholder="enter here..."
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        >
        </q-input>

        <q-input
          label="Tax"
          v-model="props.expense.tax"
          placeholder="enter here..."
        >
        </q-input>

        <q-input
          label="Description"
          v-model="props.expense.description"
          placeholder="enter here..."
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        >
        </q-input>

        <q-input
          label="Comments"
          v-model="props.expense.comments"
          placeholder="enter here..."
        >
        </q-input>
      </div>
    </div>
  </div>
</template>
<style></style>
../../models/expense/expenseDetail ../../models/expense/expenseDetails
../../stores/expense/ExpenseListStore
