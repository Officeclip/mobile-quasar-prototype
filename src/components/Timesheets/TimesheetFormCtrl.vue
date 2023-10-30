<script setup>
import { defineProps, ref, onBeforeMount, computed } from 'vue';
import dateTimeHelper from '../../helpers/dateTimeHelper';
import { useTimesheetListStore } from '../../stores/timesheet/TimesheetListStore';

const props = defineProps(['timesheet']);

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
// const sampleModel2 = ref('');

const timesheetListStore = useTimesheetListStore();

onBeforeMount(() => {
  timesheetListStore.getTimesheetListAll();
});

const periodOptions = timesheetListStore.PeriodList;

const customerProjectOptions = ref('');
customerProjectOptions.value = timesheetListStore.CustomerProjectsList;

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

const createdDate = dateTimeHelper.extractDateFromUtc(
  props.timesheet.createdDate
);

const newData = computed(() => {
  return dateTimeHelper.extractDateFromUtc(props.timesheet.createdDate);
});
const taskDate = ref('');
taskDate.value = 'July 20(Thu)';
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <div>
    <div class="q-pa-md">
      <div class="q-gutter-y-md column">
        <q-select
          label="Period"
          :model-value="newData"
          :options="periodOptions"
          map-options
          option-label="name"
          option-value="start"
          emit-value
        />

        <q-select
          label="Date"
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
  </div>
</template>
<style></style>
