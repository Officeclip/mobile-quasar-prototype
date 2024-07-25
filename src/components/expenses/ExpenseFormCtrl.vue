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
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const props = defineProps(['expenseDetail', 'period']);

const expenseListsStore = useExpenseListsStore();
const router = useRouter();
const $q = useQuasar();
const date = ref('');
const customerProjectModel = ref('');
onMounted(async () => {
  try {
    await expenseListsStore.getExpensesList();
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error,
    }).onOk(async () => {
      await router.push({ path: '/expensesAll' });
    });
  }
  date.value = props.expenseDetail?.expenseDate;

  customerProjectModel.value =
    props.expenseDetail?.accountSid +
    (props.expenseDetail?.projectSid
      ? ':' + props.expenseDetail?.projectSid
      : '');
});

const customerProjectOptions = computed(() => {
  return expenseListsStore.CustomerProjectsList;
});

// function handleServiceItems() {
//   return (serviceItemModel.value = '');
// }

//make sure to select the customer project first then only select service items
// function checkCustomerProject() {
//   if (!customerProjectModel.value) {
//     alert('Select the Customer:Project first');
//   }
// }

const expenseTypeOptions = computed(() => {
  return expenseListsStore.ExpenseTypes;
});

const paymentTypeOptions = computed(() => {
  return expenseListsStore.PaymentTypes;
});

const period = computed(() => {
  return expenseListsStore.PeriodList.find((x) => x.name === props.period);
});

const dateOptions = computed(() => {
  return dateTimeHelper.populateDates(period.value?.start, period.value?.end);
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
  mileage: '',
});

const taxi = ref({
  city: '',
  taxiLineName: '',
});

const telephone = ref({
  phoneNumber: '',
  city: '',
});

const isBillableModify = ref(false);

const expenseTypeDefault = 'Select Expense Type';

const isDetailRequired = ref(false);

if (props.expenseDetail.expenseTypeSid == '') {
  props.expenseDetail.expenseTypeSid = expenseTypeDefault;
  isBillableModify.value = true;
}

watch([expenseTypeOptions], () => {
  getExpenseTypeDetail(props.expenseDetail.expenseTypeSid);
});
watch(date, (newDate) => {
  props.expenseDetail.expenseDate = newDate;
});

watch([customerProjectModel], ([newCustomerProjectModel]) => {
  const customerProjectArray = newCustomerProjectModel.split(':');
  props.expenseDetail.accountSid = customerProjectArray[0];
  props.expenseDetail.projectSid =
    customerProjectArray.length > 1 ? customerProjectArray[1] : '';
  // props.timesheet.serviceItemSid = newServiceItemModel;

  //update the service item options each time when customer project get changed
  // serviceItemsOptions.value =
  //   timesheetListStore.getServiceItemsBycustomerProjectId(
  //     newCustomerProjectModel
  //   );
});

function getExpenseTypeDetail(expTypeId) {
  const expenseType = expenseTypeOptions.value.find(
    (x) => x.expenseTypeSid === expTypeId
  );
  if (expenseType != null) {
    isBillableModify.value = expenseType.isBillableModify;
    isDetailRequired.value = expenseType.isDetailsRequired;
    props.expenseDetail.billable = expenseType.isBillable;
    props.expenseDetail.expenseTypeSid = expenseType.expenseTypeSid;
    props.expenseDetail.expenseTypeName = expenseType.expenseTypeName;
  }

  switch (expenseType.expenseTypeName) {
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

// const formattedExpenseDate = ref('');
// const expenseDateValue = computed({
//   get() {
//     if (props.expenseDetail.expenseDate == '') {
//       return;
//     }
//     const newExpenseDate = new Date(props.expenseDetail.expenseDate);
//     return `${newExpenseDate.toLocaleString('en-US', {
//       month: 'short',
//       day: 'numeric',
//     })}(${newExpenseDate.toLocaleString('en-US', { weekday: 'short' })})`;
//   },
//   set(newValue) {
//     props.expenseDetail.expenseDate = newValue;
//   },
// });
// formattedExpenseDate.value = expenseDateValue.value;

// const customerProjectValue = ref(
//   props.expenseDetail.accountName
//     ? `${props.expenseDetail.accountName}:${props.expenseDetail.projectName}`
//     : ''
// );

// const updateCustomerProject = (newValue) => {
//   const names = newValue.name.split(':');
//   const ids = newValue.id.split(':');
//   props.expenseDetail.accountName = names[0];
//   props.expenseDetail.projectName = names[1];
//   props.expenseDetail.accountSid = ids[0];
//   props.expenseDetail.projectSid = ids[1];
// };
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <div class="q-ma-lg">
    <div class="q-ml-sm">
      <q-item-label caption class="q-pt-md"> Period </q-item-label>
      <q-item-label class="q-mb-sm">
        {{ period?.name }}
      </q-item-label>
      <!-- <pre>{{ expenseDetail }}</pre> -->
      <!-- <pre>{{ dateOptions }}</pre> -->
      <q-select
        label="Date"
        v-model="date"
        :options="dateOptions"
        option-value="startDate"
        option-label="name"
        emit-value
        map-options
        :rules="[(val) => val !== '' || 'Please select date']"
      />
      <!-- <pre>{{ customerProjectModel }}</pre> -->
      <!-- <pre>{{ customerProjectOptions }}</pre> -->
      <q-select
        label="Customer: Project"
        v-model="customerProjectModel"
        :options="customerProjectOptions"
        option-label="name"
        option-value="id"
        map-options
        emit-value
      />
      <!-- <pre>{{ expenseDetail.expenseTypeSid }}</pre> -->
      <!-- <pre>{{ expenseTypeOptions }}</pre> -->
      <q-select
        label="Expense Type"
        v-model="expenseDetail.expenseTypeSid"
        :options="expenseTypeOptions"
        :rules="[
          (val) => val !== expenseTypeDefault || 'Please select expense type..',
        ]"
        @update:model-value="getExpenseTypeDetail"
        option-label="expenseName"
        emit-value
        option-value="expenseTypeSid"
        map-options
      />

      <q-card class="q-my-md">
        <airTravelExpenseForm
          :airTravel="
            props.expenseDetail.airTravelExpense == null
              ? (props.expenseDetail.airTravelExpense = airTravel)
              : props.expenseDetail.airTravelExpense
          "
          :isDetailRequired="isDetailRequired"
          v-if="expenseDetail.expenseTypeName == 'AIRFARE'"
        />

        <autoRentalExpenseForm
          :autoRental="
            props.expenseDetail.autoRentalExpense == null
              ? (props.expenseDetail.autoRentalExpense = autoRental)
              : props.expenseDetail.autoRentalExpense
          "
          :isDetailRequired="isDetailRequired"
          v-if="expenseDetail.expenseTypeName == 'AUTORENTAL'"
        />
        <hotelExpenseForm
          :hotel="
            props.expenseDetail.hotelExpense == null
              ? (props.expenseDetail.hotelExpense = hotel)
              : props.expenseDetail.hotelExpense
          "
          :isDetailRequired="isDetailRequired"
          v-if="expenseDetail.expenseTypeName == 'HOTEL'"
        />

        <mileageExpenseForm
          :mileage="
            props.expenseDetail.mileageExpense == null
              ? (props.expenseDetail.mileageExpense = mileage)
              : props.expenseDetail.mileageExpense
          "
          :isDetailRequired="isDetailRequired"
          v-if="expenseDetail.expenseTypeName == 'MILEAGE'"
        />

        <taxiExpenseForm
          :taxi="
            props.expenseDetail.taxiExpense == null
              ? (props.expenseDetail.taxiExpense = taxi)
              : props.expenseDetail.taxiExpense
          "
          :isDetailRequired="isDetailRequired"
          v-if="expenseDetail.expenseTypeName == 'TAXI'"
        />

        <telephoneExpenseForm
          :telephone="
            props.expenseDetail.telephoneExpense == null
              ? (props.expenseDetail.telephoneExpense = telephone)
              : props.expenseDetail.telephoneExpense
          "
          :isDetailRequired="isDetailRequired"
          v-if="expenseDetail.expenseTypeName == 'TELEPHONE'"
        />
      </q-card>

      <q-toggle
        label="Billable"
        :false-value="false"
        :true-value="true"
        :disable="!isBillableModify"
        color="primary"
        keep-color
        v-model="expenseDetail.billable"
        option-value="expenseTypeName"
        map-options
      ></q-toggle>
      <div
        v-if="isBillableModify === false"
        caption
        class="q-mb-md text-italic"
      >
        <q-icon name="hide_source" /> You do not have permission to edit this
        item
      </div>
      <q-select
        label="Payment Method"
        v-model="expenseDetail.paymentType"
        :options="paymentTypeOptions"
        map-options
        emit-value
        option-label="Name"
        option-value="Id"
      />

      <q-input
        label="Amount"
        v-model.number="expenseDetail.amount"
        placeholder="enter here..."
        type="number"
        :rules="[(val) => (val && val > 0) || 'Please enter duration']"
      >
      </q-input>

      <q-input
        label="Tax"
        v-model.number="expenseDetail.tax"
        placeholder="enter here..."
        type="number"
      >
      </q-input>
      <q-input
        label="Description"
        v-model="expenseDetail.description"
        placeholder="enter here..."
      >
      </q-input>

      <q-input
        label="Comments"
        v-model="expenseDetail.comments"
        placeholder="enter here..."
      >
      </q-input>
    </div>
  </div>
</template>
<style></style>
