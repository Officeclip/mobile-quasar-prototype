<!-- eslint-disable vue/no-setup-props-destructure -->
<!-- eslint-disable vue/no-mutating-props -->
<script setup>
import { defineProps, ref, onBeforeMount, computed, watch } from 'vue';
import dateTimeHelper from '../../helpers/dateTimeHelper';
import { useTimesheetListStore } from '../../stores/timesheet/TimesheetListStore';

const props = defineProps(['timesheet', 'periodName']);

const accountName = props.timesheet?.accountName;
const projectName = props.timesheet?.projectName;
const selectedCustomerProject = ref(
  accountName ? `${accountName}:${projectName}` : ''
);

const customerProjectModel = ref('');
const taskDate = ref('');
taskDate.value = props.timesheet?.taskDate
  ? props.timesheet?.taskDate
  : new Date();

// format the taskDate and show for user interface like Nov 02(Fri)
const formattedTaskDate = ref(
  `${new Date(taskDate.value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
  })}(${new Date(taskDate.value).toLocaleString('en-US', {
    weekday: 'short',
  })})`
);

const timesheetListStore = useTimesheetListStore();
onBeforeMount(() => {
  timesheetListStore.getTimesheetListAll();
});
const selectedPeriod = computed(() => {
  return timesheetListStore.PeriodList.find((x) => x.name === props.periodName);
});
// const periodOptions = timesheetListStore.PeriodList;
const dateOptions = computed(() => {
  return dateTimeHelper.populateDates(
    selectedPeriod.value?.start,
    selectedPeriod.value?.end
  );
});

const customerProjectOptions = computed(() => {
  return timesheetListStore.CustomerProjectsList;
});

const accountSid = props.timesheet?.accountSid;
const projectSid = props.timesheet?.projectSid;
const customerProjectId = ref(accountSid ? `${accountSid}:${projectSid}` : '');

// const serviceItemsOptions = computed(() => {
//   return customerProjectId.value
//     ? timesheetListStore.getServiceItemsBycustomerProjectId(
//         customerProjectId.value
//       )
//     : '';
// });
const serviceItemsOptions = ref('');
// customerProjectId.value != ''
//   ? computed(() => {
//       return timesheetListStore.getServiceItemsBycustomerProjectId(
//         customerProjectId.value
//       );
//     })
//   : watch([customerProjectModel], ([newCustomerProjectModel]) => {
//       timesheetListStore.getServiceItemsBycustomerProjectId(
//         newCustomerProjectModel.id
//       );
//     });

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

watch([taskDate], ([newTaskDate]) => {
  formattedTaskDate.value = newTaskDate;
  props.timesheet.taskDate = newTaskDate;
});
watch([customerProjectModel], ([newCustomerProjectModel]) => {
  selectedCustomerProject.value = newCustomerProjectModel;
  const names = newCustomerProjectModel.name.split(':');
  const ids = newCustomerProjectModel.id.split(':');
  props.timesheet.accountName = names[0];
  props.timesheet.projectName = names[1];
  props.timesheet.accountSid = ids[0];
  props.timesheet.projectSid = ids[1];
  serviceItemsOptions.value = newCustomerProjectModel.id
    ? timesheetListStore.getServiceItemsBycustomerProjectId(
        newCustomerProjectModel.id
      )
    : computed(() => {
        return timesheetListStore.getServiceItemsBycustomerProjectId(
          customerProjectId.value
        );
      });
});
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <div class="q-ma-lg">
    <div class="q-ml-sm">
      <q-item-label caption>Period</q-item-label>
      <q-item-label v-if="selectedPeriod">{{
        selectedPeriod.name
      }}</q-item-label>
      <q-select
        label="Date"
        :model-value="formattedTaskDate"
        @update:model-value="(newValue) => (taskDate = newValue)"
        :options="dateOptions"
        map-options
        emit-label
      />
      <!-- <pre>customer:project={{ selectedCustomerProject }}</pre> -->
      <!-- <pre>cpModel:{{ customerProjectModel }}</pre> -->
      <!-- <pre>Account:  {{ props.timesheet.accountName }}</pre> -->
      <!-- <pre>ServiceItem:  {{ props.timesheet.serviceItemName }}</pre> -->
      <q-select
        label="Customer: Project"
        :model-value="selectedCustomerProject"
        @update:model-value="(newValue) => (customerProjectModel = newValue)"
        :options="customerProjectOptions"
        option-label="name"
        option-value="id"
        map-options
      />
      <pre>{{ props.timesheet.serviceItemName }}</pre>
      <q-select
        label="ServiceItems"
        v-model="props.timesheet.serviceItemName"
        :options="serviceItemsOptions"
        option-label="name"
        map-options
      />

      <q-select
        label="Billable"
        v-model="props.timesheet.isBillable"
        :options="billableOptions"
        map-options
        emit-value
      />
      <q-input
        label="Duration"
        v-model="props.timesheet.timeDuration"
        placeholder="enter here..."
      >
      </q-input>

      <q-input
        label="Description"
        v-model="props.timesheet.description"
        placeholder="enter here..."
      >
      </q-input>

      <q-input
        label="Comments"
        v-model="props.timesheet.description"
        placeholder="enter here..."
      >
      </q-input>
    </div>
  </div>
</template>
<style></style>
