<!-- eslint-disable vue/no-setup-props-destructure -->
<!-- eslint-disable vue/no-mutating-props -->
<script setup>
import { defineProps, ref, onMounted, computed, watch } from 'vue';
import dateTimeHelper from '../../helpers/dateTimeHelper';
import { useTimesheetListStore } from '../../stores/timesheet/TimesheetListStore';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const props = defineProps(['timesheet', 'timesheetDCAA', 'fromDate', 'toDate']);
const $q = useQuasar();
const router = useRouter();
const date = ref('');
const customerProjectModel = ref('');
const serviceItemModel = ref('');

const serviceItemsOptions = ref('');

const timesheetListStore = useTimesheetListStore();

onMounted(async () => {
  try {
    await timesheetListStore.getTimesheetListAll();
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error,
    }).onOk(async () => {
      await router.push({ path: '/HomePage' });
    });
  }
  date.value = props.timesheet?.taskDate;

  customerProjectModel.value =
    props.timesheet?.accountSid +
    (props.timesheet?.projectSid ? ':' + props.timesheet?.projectSid : '');

  serviceItemModel.value = props.timesheet?.serviceItemSid;
});

let errorMessage = '';
let isCommentsRequired = false;

// const selectedPeriod = computed(() => {
//   return timesheetListStore.PeriodList.find((x) => x.name === props.periodName);
// });

const selectedPeriod = computed(() => {
  const formattedDt = `${dateTimeHelper.formatDateForTE(
    props?.fromDate
  )} - ${dateTimeHelper.formatDateForTE(props?.toDate)}`;
  return formattedDt;
});

const dateOptions = computed(() => {
  return dateTimeHelper.populateDates(props?.fromDate, props?.toDate);
});

// const dateOptions = computed(() => {
//   return dateTimeHelper.populateDates(
//     selectedPeriod.value?.start,
//     selectedPeriod.value?.end
//   );
// });

const customerProjectOptions = computed(() => {
  return timesheetListStore.CustomerProjectsList;
});

function handleServiceItems() {
  return (serviceItemModel.value = '');
}

//make sure to select the customer project first then only select service items
function checkCustomerProject() {
  if (!customerProjectModel.value) {
    alert('Select the Customer:Project first');
  }
}

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
watch(date, (newDate) => {
  props.timesheet.taskDate = newDate;
});

watch(
  [customerProjectModel, serviceItemModel],
  ([newCustomerProjectModel, newServiceItemModel]) => {
    const customerProjectArray = newCustomerProjectModel.split(':');
    props.timesheet.accountSid = customerProjectArray[0];
    props.timesheet.projectSid =
      customerProjectArray.length > 1 ? customerProjectArray[1] : '';
    props.timesheet.serviceItemSid = newServiceItemModel;

    //update the service item options each time when customer project get changed
    serviceItemsOptions.value =
      timesheetListStore.getServiceItemsBycustomerProjectId(
        newCustomerProjectModel
      );
  }
);

const dateRef = ref(null);
const durationRef = ref(null);

const isDateValid = () => {
  const condition = date.value != '';
  return condition ? true : 'Please select date';
};

const isDurationValid = () => {
  const condition = props.timesheet.timeDuration > 0;
  return condition ? true : 'Please enter duration';
};

const validateAll = () => {
  dateRef.value.validate();
  durationRef.value.validate();

  if (dateRef.value.hasError || durationRef.value.hasError) {
    return false;
  } else {
    return true;
  }
};

defineExpose({
  validateAll,
});
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <div class="q-ma-lg">
    <div class="q-ml-sm">
      <q-item-label caption>Period</q-item-label>
      <q-item-label v-if="selectedPeriod">{{ selectedPeriod }}</q-item-label>
      <q-select
        label="Date"
        v-model="date"
        :options="dateOptions"
        :rules="[isDateValid]"
        ref="dateRef"
        option-label="name"
        option-value="startDate"
        emit-value
        map-options
      />
      <q-select
        label="Customer: Project"
        v-model="customerProjectModel"
        :options="customerProjectOptions"
        option-label="name"
        option-value="id"
        map-options
        emit-value
        @click="handleServiceItems"
      />
      <q-select
        label="Service Items"
        v-model="serviceItemModel"
        :options="serviceItemsOptions"
        option-label="name"
        option-value="id"
        map-options
        emit-value
        @click="checkCustomerProject"
      />
      <q-select
        label="Billable"
        v-model="timesheet.isBillable"
        :options="billableOptions"
        map-options
        emit-value
      />
      <q-input
        label="Duration"
        v-model.number="timesheet.timeDuration"
        placeholder="enter here..."
        type="number"
        :rules="[isDurationValid]"
        ref="durationRef"
      />
      <q-input
        label="Description"
        v-model="timesheet.description"
        placeholder="enter here..."
      />
      <q-input
        label="Comments"
        v-model="timesheet.comments"
        placeholder="enter here..."
        :label-color="isCommentsRequired ? 'red' : ''"
        :rules="[
          (val) =>
            (val && val.length > 0) || !isCommentsRequired || errorMessage,
        ]"
      />
    </div>
  </div>
</template>
<style></style>
