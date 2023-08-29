<script setup>
import { defineProps, ref, onMounted } from 'vue';
import dateTimeHelper from '../../helpers/dateTimeHelper';
import { useTimesheetListStore } from '../../stores/TimesheetListStore';


const periodOptions = ref([])
periodOptions.value = [
  '2023-07-31',
  '2023-07-24',
  '2023-07-17',
  '2023-07-10',
  '2023-07-03'
]
const dateOptions = ref([]);
dateOptions.value = [
  'July 17(Mon)',
  'July 18(Tue)',
  'July 19(Wed)',
  'July 20(Thu)',
  'July 21(Fri)',
  'July 22(Sat)',
  'July 23(Sun)'
]


const customerProjectOptions = ref('')
const timesheetListStore = useTimesheetListStore();
onMounted(() => {
timesheetListStore.getTimesheetsList('CustomerProjects')
timesheetListStore.getTimesheetsList('ServiceItems')
})

const customerProjectsList = timesheetListStore.CustomerProjectsList
// customerProjectOptions.value = Object.keys(data).map(key => data[key]);
customerProjectOptions.value = customerProjectsList

const taskOptions = ref('')
const serviceItemsList = timesheetListStore.ServiceItemsList
taskOptions.value = serviceItemsList


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
]

const props = defineProps(['timesheet']);

const createdDate = ref('')
createdDate.value = dateTimeHelper.extractDateFromUtc(props.timesheet.createdDate)

const taskDate = ref('')
taskDate.value = 'July 20(Thu)'


</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <div>
    <div class="q-pa-md">
      <div class="q-gutter-y-md column">
        <q-select
          name="newcreatedDate"
          label="Period"
          v-model="createdDate"
          :options="periodOptions"
          map-options
          emit-label
        />

        <q-select
          name="newtaskDate"
          label="Date"
          v-model="taskDate"
          :options="dateOptions"
          map-options
          emit-label
        />
        <pre>{{ props.timesheet.accountName }}</pre>
         <q-select
          label="Customer: Project"
          v-model="props.timesheet.accountName"
          :options="customerProjectOptions"
          option-label="name"
          option-value="id"
          map-options
          emit-label
        />

        <q-select
          label="Task"
          v-model="props.timesheet.serviceItemName"
          :options="taskOptions"
          option-label="name"
          option-value="id"
          map-options
          emit-label
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
          v-model= "props.timesheet.timeDuration"
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
<style>
</style>
