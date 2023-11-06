<!-- eslint-disable vue/no-mutating-props -->
<script setup>
import { defineProps, ref, onMounted, computed, watch } from 'vue';
import { useExpenseListsStore } from '../../stores/expense/expenseListsStore';
import airTravelExpenseForm from '../expenses/expenseTypes/airTravelExpenseForm.vue';
import autoRentalExpenseForm from '../expenses/expenseTypes/autoRentalExpenseForm.vue';

const props = defineProps(['expenseDetail', 'period']);
const emits = defineEmits(['onIsDetailRequired']);

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

watch([expenseTypeOptions], () => {
  getExpenseTypeDetail(props.expenseDetail.expenseTypeName);
});

function getExpenseTypeDetail(expTypeName) {
  console.log(`getExpenseTypeDetail( ${expTypeName} )`);
  const expenseType = expenseTypeOptions.value.find(
    (x) => x.expenseTypeName === expTypeName
  );
  if (expenseType != null) {
    isBillableModify.value = expenseType.isBillableModify;
    isDetailRequired.value = expenseType.isDetailsRequired;
    emits('onIsDetailRequired', expenseType.isDetailsRequired);
    props.expenseDetail.billable = expenseType.isBillable;
  }

  switch (expTypeName) {
    case 'AIRFARE':
      props.expenseDetail.autoRentalExpense = null;
      break;
    case 'AUTORENTAL':
      props.expenseDetail.airTravelExpense = null;
      break;
  }
}


const formattedExpenseDate = ref('');
const expenseDateValue = computed({
  get() {
    if (props.expenseDetail.expenseDate == '') {
      return;
    }
    const newExpenseDate = new Date(props.expenseDetail.expenseDate);
    return `${newExpenseDate.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
    })}(${newExpenseDate.toLocaleString('en-US', { weekday: 'short' })})`;
  },
  set(newValue) {
    props.expenseDetail.expenseDate = newValue;
    console.log(
      'Formatted expense date in expense form control',
      props.expenseDetail.expenseDate
    );
  },
});
formattedExpenseDate.value = expenseDateValue.value;
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
        <q-select label="Expense Date" v-model="formattedExpenseDate" :options="datesList" option-value="value"
          option-label="label" emit-value map-options />
        <q-select label="Customer : Project" v-model="expenseDetail.accountProjectIdName"
          :options="customerProjectOptions" option-label="name" option-value="id" />

        <q-select label="Expense Type" v-model="expenseDetail.expenseTypeName" :options="expenseTypeOptions" :rules="[
          (val) =>
            val !== expenseTypeDefault || 'Please select expense type..',
        ]" @update:model-value="getExpenseTypeDetail" option-label="expenseName" emit-value
          option-value="expenseTypeName" map-options />
        <airTravelExpenseForm :airTravel="props.expenseDetail.airTravelExpense == null
          ? (props.expenseDetail.airTravelExpense = airTravel)
          : props.expenseDetail.airTravelExpense
          " :isDetailRequired="isDetailRequired" v-if="expenseDetail.expenseTypeName == 'AIRFARE'" />

        <autoRentalExpenseForm :autoRental="props.expenseDetail.autoRentalExpense == null
          ? (props.expenseDetail.autoRentalExpense = autoRental)
          : props.expenseDetail.autoRentalExpense
          " :isDetailRequired="isDetailRequired" v-if="expenseDetail.expenseTypeName == 'AUTORENTAL'" />

        <q-toggle label="Billable" :false-value="false" :true-value="true" :disable="!isBillableModify" color="primary"
          keep-color v-model="expenseDetail.billable" option-value="expenseTypeName" map-options></q-toggle>
        <div v-if="isBillableModify === false" caption class="q-mb-md text-italic">
          <q-icon name="hide_source" /> You do not have permission to edit this item
        </div>

        <q-select label="Payment Method" v-model="expenseDetail.paymentType" :options="paymentTypeOptions" map-options
          emit-value option-value="label" />

        <q-input label="Amount" v-model.number="expenseDetail.amount" placeholder="enter here..." lazy-rules
          type="number">
        </q-input>

        <q-input label="Tax" v-model.number="expenseDetail.tax" placeholder="enter here..." type="number">
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
