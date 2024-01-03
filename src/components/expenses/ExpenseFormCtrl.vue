<!-- eslint-disable vue/no-mutating-props -->
<script setup>
import { defineProps, ref, onMounted, computed, watch } from 'vue';
import dateTimeHelper from '../../helpers/dateTimeHelper';
import { useExpenseListsStore } from '../../stores/expense/expenseListsStore';
import airTravelExpenseForm from '../expenses/expenseTypes/airTravelExpenseForm.vue';
import autoRentalExpenseForm from '../expenses/expenseTypes/autoRentalExpenseForm.vue';
import hotelExpenseForm from '../expenses/expenseTypes/hotelExpenseForm.vue';
import mileageExpenseForm from '../expenses/expenseTypes/mileageExpenseForm.vue';
import taxiExpenseForm from '../expenses/expenseTypes/taxiExpenseForm.vue';
import telephoneExpenseForm from '../expenses/expenseTypes/telephoneExpenseForm.vue';

const props = defineProps(['expenseDetail', 'period']);

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
  return expenseListsStore.PeriodList.find((x) => x.name === props.period);
});

const datesList = computed(() => {
  return dateTimeHelper.populateDates(
    period.value?.start,
    period.value?.end
  );
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

const hotel = ref({
  hotelName: '',
  city: '',
  fromDate: '',
  toDate: '',
});

const mileage = ref({
  mileage: ''
});

const taxi = ref({
  city: '',
  taxiLineName: ''
});

const telephone = ref({
  phoneNumber: '',
  city: ''
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
    props.expenseDetail.billable = expenseType.isBillable;
    props.expenseDetail.expenseTypeSid = expenseType.id
  }

  switch (expTypeName) {
    case 'AIRFARE':
      props.expenseDetail.autoRentalExpense = null;
      props.expenseDetail.hotelExpense = null;
      props.expenseDetail.mileageExpense = null;
      props.expenseDetail.taxiExpense = null;
      props.expenseDetail.telephoneExpense = null;
      break;
    case 'AUTORENTAL':
      props.expenseDetail.airTravelExpense = null;
      props.expenseDetail.hotelExpense = null;
      props.expenseDetail.mileageExpense = null;
      props.expenseDetail.taxiExpense = null;
      props.expenseDetail.telephoneExpense = null;
      break;
    case 'HOTEL':
      props.expenseDetail.airTravelExpense = null;
      props.expenseDetail.autoRentalExpense = null;
      props.expenseDetail.mileageExpense = null;
      props.expenseDetail.taxiExpense = null;
      props.expenseDetail.telephoneExpense = null;
      break;
    case 'MILEAGE':
      props.expenseDetail.airTravelExpense = null;
      props.expenseDetail.autoRentalExpense = null;
      props.expenseDetail.mileageExpense = null;
      props.expenseDetail.taxiExpense = null;
      props.expenseDetail.telephoneExpense = null;
      break;
    case 'TAXI':
      props.expenseDetail.airTravelExpense = null;
      props.expenseDetail.autoRentalExpense = null;
      props.expenseDetail.hotelExpense = null;
      props.expenseDetail.mileageExpense = null;
      props.expenseDetail.telephoneExpense = null;
      break;
    case 'TELEPHONE':
      props.expenseDetail.airTravelExpense = null;
      props.expenseDetail.autoRentalExpense = null;
      props.expenseDetail.hotelExpense = null;
      props.expenseDetail.mileageExpense = null;
      props.expenseDetail.taxiExpense = null;
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

const customerProjectValue = ref(
  props.expenseDetail.accountName ? `${props.expenseDetail.accountName}:${props.expenseDetail.projectName}` : ''
);

const updateCustomerProject = (newValue) => {
  const names = newValue.name.split(':');
  const ids = newValue.id.split(':');
  props.expenseDetail.accountName = names[0];
  props.expenseDetail.projectName = names[1];
  props.expenseDetail.accountSid = ids[0];
  props.expenseDetail.projectSid = ids[1];
};

</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <div class="q-ma-lg">
    <div class="q-ml-sm">
      <q-item-label caption class="q-pt-md"> Period </q-item-label>
      <q-item-label class="q-mb-sm">
        {{ period?.name }}
      </q-item-label>

      <q-select label="Expense Date" v-model="formattedExpenseDate"
        @update:model-value="(newValue) => (props.expenseDetail.expenseDate = newValue)" :options="datesList"
        option-value="value" option-label="name" emit-value map-options />

      <q-select label="Customer : Project" v-model="customerProjectValue" @update:model-value="updateCustomerProject"
        :options="customerProjectOptions" option-label="name" option-value="id" />

      <q-select label="Expense Type" v-model="expenseDetail.expenseTypeName" :options="expenseTypeOptions" :rules="[
        (val) =>
          val !== expenseTypeDefault || 'Please select expense type..',
      ]" @update:model-value="getExpenseTypeDetail" option-label="expenseName" emit-value
        option-value="expenseTypeName" map-options />

      <q-card class="q-my-md">
        <airTravelExpenseForm :airTravel="props.expenseDetail.airTravelExpense == null
          ? (props.expenseDetail.airTravelExpense = airTravel)
          : props.expenseDetail.airTravelExpense
          " :isDetailRequired="isDetailRequired" v-if="expenseDetail.expenseTypeName == 'AIRFARE'" />

        <autoRentalExpenseForm :autoRental="props.expenseDetail.autoRentalExpense == null
          ? (props.expenseDetail.autoRentalExpense = autoRental)
          : props.expenseDetail.autoRentalExpense
          " :isDetailRequired="isDetailRequired" v-if="expenseDetail.expenseTypeName == 'AUTORENTAL'" />
        <hotelExpenseForm :hotel="props.expenseDetail.hotelExpense == null
          ? (props.expenseDetail.hotelExpense = hotel)
          : props.expenseDetail.hotelExpense
          " :isDetailRequired="isDetailRequired" v-if="expenseDetail.expenseTypeName == 'HOTEL'" />

        <mileageExpenseForm :mileage="props.expenseDetail.mileageExpense == null
          ? (props.expenseDetail.mileageExpense = mileage)
          : props.expenseDetail.mileageExpense
          " :isDetailRequired="isDetailRequired" v-if="expenseDetail.expenseTypeName == 'MILEAGE'" />

        <taxiExpenseForm :taxi="props.expenseDetail.taxiExpense == null
          ? (props.expenseDetail.taxiExpense = taxi)
          : props.expenseDetail.taxiExpense
          " :isDetailRequired="isDetailRequired" v-if="expenseDetail.expenseTypeName == 'TAXI'" />

        <telephoneExpenseForm :telephone="props.expenseDetail.telephoneExpense == null
          ? (props.expenseDetail.telephoneExpense = telephone)
          : props.expenseDetail.telephoneExpense
          " :isDetailRequired="isDetailRequired" v-if="expenseDetail.expenseTypeName == 'TELEPHONE'" />
      </q-card>

      <q-toggle label="Billable" :false-value="false" :true-value="true" :disable="!isBillableModify" color="primary"
        keep-color v-model="expenseDetail.billable" option-value="expenseTypeName" map-options></q-toggle>
      <div v-if="isBillableModify === false" caption class="q-mb-md text-italic">
        <q-icon name="hide_source" /> You do not have permission to edit this item
      </div>

      <q-select label="Payment Method" v-model="expenseDetail.paymentType" :options="paymentTypeOptions" map-options
        emit-value option-value="label" />

      <q-input label="Amount" v-model.number="expenseDetail.amount" placeholder="enter here..." lazy-rules type="number">
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
</template>
<style></style>
