<!-- eslint-disable vue/no-setup-props-destructure -->
<!-- eslint-disable vue/no-mutating-props -->
<script setup>
import { defineProps, ref, onMounted, computed, watch } from 'vue';
import dateTimeHelper from '../../helpers/dateTimeHelper';
import { useTimesheetListStore } from '../../stores/timesheet/TimesheetListStore';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import util from 'src/helpers/util';
import logger from 'src/helpers/logger';

const props = defineProps(['timesheet', 'timesheetDCAA', 'fromDate', 'toDate']);
const $q = useQuasar();
const router = useRouter();
const date = ref('');
const customerProjectModel = ref('');
const serviceItemModel = ref('');

const serviceItemsOptions = ref('');

const timesheetListStore = useTimesheetListStore();

const isBillableModify = ref(false);

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

  const custProjId =
    props.timesheet?.accountSid +
    (props.timesheet?.projectSid ? ':' + props.timesheet?.projectSid : '');

  customerProjectModel.value = customerProjectOptions.value.find(
    (x) => x.id === custProjId
  )
    ? custProjId
    : '';

  // customerProjectModel.value =
  //   props.timesheet?.accountSid +
  //   (props.timesheet?.projectSid ? ':' + props.timesheet?.projectSid : '');

  serviceItemModel.value = customerProjectModel.value
    ? props.timesheet?.serviceItemSid
    : '';
});

let errorMessage = '';
let isCommentsRequired = false;

// const selectedPeriod = computed(() => {
//   return timesheetListStore.PeriodList.find((x) => x.name === props.periodName);
// });

const selectedPeriod = computed(() => {
  const fromDate = dateTimeHelper.formatDateTimeFromRestAPIForUI(
    props?.fromDate,
    true
  );
  const toDate = dateTimeHelper.formatDateTimeFromRestAPIForUI(
    props?.toDate,
    true
  );
  //logger.log(`TimesheetFormCtrl: selectedPeriod: fromDate: ${fromDate}`);
  const formattedDt = `${fromDate} - ${toDate}`;
  return formattedDt;
});

const dateOptions = computed(() => {
  return dateTimeHelper.populateDates(props?.fromDate, props?.toDate);
});

const customerProjectOptions = computed(() => {
  return timesheetListStore.CustomerProjectsList;
});

function handleServiceItems() {
  watch(customerProjectModel, (newCustomerProjectModel) => {
    if (newCustomerProjectModel) {
      serviceItemModel.value = '';
    }
  });
  return null;
}

//make sure to select the customer project first then only select service items
function checkCustomerProject() {
  if (!customerProjectModel.value) {
    alert('Select the Customer:Project first');
  }
}

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

    const serviceItem = serviceItemsOptions.value.find(
      (x) => x.id === serviceItemModel.value
    );

    if (!serviceItem) return;
    if (serviceItem != null) {
      isBillableModify.value = serviceItem.isBillableModify;
      props.timesheet.isBillable = serviceItem.isBillable;
    }
  }
);

const dateRef = ref(null);
const durationRef = ref(null);

const isDateValid = () => {
  const condition = date.value != '';
  return condition ? true : 'Please select date';
};

const isDurationEmpty = (val) => {
  //debugger;
  const condition = val && val > 0;
  return condition ? true : 'This field is required';
};

const isDurationValid = (val) => {
  //debugger;
  const condition = util.isDurationValid(val);
  return condition ? true : 'Please enter a valid duration';
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

function onDurationBlur(event) {
  // debugger;
  const val = event.target.value;
  console.log(
    `TimesheetFormCtrl:onDurationBlur val=${val}, current.value=${props.timesheet.timeDuration}`
  );
  if (val.includes(':')) {
    console.log(`onDurationBlur - val changed to ${val}`);
    props.timesheet.timeDuration = util.colonToDecimal(val);
  }
}
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
        fill-input
        option-label="name"
        option-value="id"
        map-options
        emit-value
        hide-dropdown-icon
        @click="handleServiceItems()"
      >
        <template v-slot:append>
          <q-icon
            name="arrow_drop_down"
            class="cursor-pointer"
            @click="handleServiceItems()"
          />
        </template>
      </q-select>
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
      <!-- <q-select
        label="Billable"
        v-model="timesheet.isBillable"
        :options="billableOptions"
        map-options
        emit-value
      /> -->

      <q-toggle
        label="Billable"
        :false-value="false"
        :true-value="true"
        :disable="!isBillableModify"
        color="primary"
        keep-color
        v-model="timesheet.isBillable"
        option-value="name"
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
      <q-input
        label="Duration"
        v-model="timesheet.timeDuration"
        placeholder="enter duration in decimal or colon (hh:mm)"
        :rules="[isDurationEmpty, isDurationValid]"
        ref="durationRef"
        @blur="onDurationBlur"
      />
      <q-input
        label="Description"
        v-model="timesheet.description"
        placeholder="enter here..."
      />
      <q-input
        label=""
        v-model="timesheet.comments"
        :label-color="isCommentsRequired ? 'red' : ''"
        :rules="[
          (val) =>
            (val && val.length > 0) || !isCommentsRequired || errorMessage,
        ]"
      >
        <template v-slot:label>
          <div class="row items-center all-pointer-events">
            Comments (for the entire timesheet)
            <q-icon class="q-mr-xs" size="20px" name="help" />
            <q-tooltip
              class="bg-grey-8"
              anchor="top left"
              self="bottom left"
              :offset="[0, 8]"
              >Use this field to write a comment when submitting
              timesheet</q-tooltip
            >
          </div>
        </template>
      </q-input>
    </div>
  </div>
</template>
<style scoped>
/* .q-icon {
  display: none;
} */
</style>
