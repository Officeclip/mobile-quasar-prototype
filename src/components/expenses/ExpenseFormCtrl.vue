<!-- eslint-disable vue/no-mutating-props -->
<script setup>
import { defineProps, ref, onMounted, computed, watch } from 'vue';
import { useExpenseListsStore } from '../../stores/expense/expenseListsStore';
import airTravelExpenseForm from '../expenses/expenseTypes/airTravelExpenseForm.vue';
import autoRentalExpenseForm from '../expenses/expenseTypes/autoRentalExpenseForm.vue';

const props = defineProps(['expenseDetail', 'period']);

// const expenseTypeName = ref('')
// watch(
//   () => props.expenseDetail,
//   (newVal) => {
//     if (newVal) {
//       expenseTypeName.value = props.expenseDetail.expenseTypeName;
//     }
//   }
// );

const expenseTypeName = computed(() => {
  return props.expenseDetail.expenseTypeName;
});

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
  return expenseListsStore.getDatesBetweenStartEnd(period.value);
});

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

const isDetailRequired = ref(false);

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
  isDetailRequired.value = expenseType.isDetailsRequired;
  console.log('Testing is detail required -', isDetailRequired.value)
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
// const storeDate = ref(props.expenseDetail.expenseDate);
// const formattedStoreDate = ref('');
// if (storeDate.value) {
//   formattedStoreDate.value = storeDate.value.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });
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
        <q-select label="Expense Date" v-model="expenseDetail.expenseDate" :options="datesList" map-options
          option-value="value" option-label="label" emit-value />

        <q-select label="Customer: Project" v-model="expenseDetail.projectName" :options="customerProjectOptions"
          option-label="name" option-value="name" map-options emit-value />

        <q-select label="Expense Type" v-model="expenseDetail.expenseTypeName" :options="expenseTypeOptions"
          :rules="[(val) => val !== expenseTypeDefault || 'Please select expense type..']"
          @update:model-value="getExpenseTypeDetail" option-label="expenseName" emit-value option-value="expenseTypeName"
          map-options />
        <airTravelExpenseForm
          :airTravel="props.expenseDetail.airTravelExpense == null ? props.expenseDetail.airTravelExpense = airTravel : props.expenseDetail.airTravelExpense"
          :isDetailRequired="isDetailRequired" v-if="expenseDetail.expenseTypeName == 'AIRFARE'" />

        <autoRentalExpenseForm
          :autoRental="props.expenseDetail.autoRentalExpense == null ? props.expenseDetail.autoRentalExpense = autoRental : props.expenseDetail.autoRentalExpense"
          :isDetailRequired="isDetailRequired" v-if="expenseDetail.expenseTypeName == 'AUTORENTAL'" />

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
