<script setup>
import { defineProps, ref, onBeforeMount, computed } from 'vue';
import dateTimeHelper from '../../helpers/dateTimeHelper';
import { useTimesheetListStore } from '../../stores/timesheet/TimesheetListStore';

const props = defineProps(['timesheet', 'periodName']);

const timesheetListStore = useTimesheetListStore();

onBeforeMount(() => {
  timesheetListStore.getTimesheetListAll();
});
// eslint-disable-next-line vue/no-setup-props-destructure
// const selectedPeriod = props.selectedPeriod;
// const selectedPeriod = computed(() => {
//   return timesheetListStore.selectedPeriod;
// });

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
const serviceItemsOptions = ref('');
// serviceItemsOptions.value = timesheetListStore.ServiceItemsList

const handleSelectChange = (sampleModel) => {
  console.log('Selected value:', sampleModel.id);
  serviceItemsOptions.value =
    timesheetListStore.getServiceItemsBycustomerProjectId(sampleModel.id);
};

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
// const createdDate = dateTimeHelper.extractDateFromUtc(
//   props.timesheet.createdDate
// );

// const createdDate = computed(() => {
//   return dateTimeHelper.extractDateFromUtc(props.timesheet.createdDate);
// });
// const taskDate = ref('');
// taskDate.value = 'July 20(Thu)';
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
        v-model="props.timesheet.taskDate"
        :options="dateOptions"
        map-options
        emit-label
      />
      <q-select
        label="Customer: Project"
        v-model="props.timesheet.projectName"
        :options="customerProjectOptions"
        option-label="name"
        option-value="id"
        map-options
        @update:model-value="handleSelectChange"
      />
      <q-select
        label="ServiceItems"
        v-model="props.timesheet.serviceItemName"
        :options="serviceItemsOptions"
        option-label="name"
        option-value="name"
        map-options
        emit-value
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
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      >
      </q-input>

      <q-input
        label="Description"
        v-model="props.timesheet.description"
        placeholder="enter here..."
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      >
      </q-input>

      <q-input
        label="Comments"
        v-model="props.timesheet.description"
        placeholder="enter here..."
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      >
      </q-input>
    </div>
  </div>
</template>
<style></style>
