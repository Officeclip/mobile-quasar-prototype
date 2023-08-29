<script setup>
import { defineProps, ref, onMounted, onUpdated } from 'vue';
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


const sampleModel = ref(null)
const sampleModel2 = ref('')

const timesheetListStore = useTimesheetListStore();

onMounted(() => {
timesheetListStore.getTimesheetListAll()
})

onUpdated(() =>{
  const selectedValue = sampleModel.value.id
  console.log('getting the id from option:', selectedValue)
})

const customerProjectOptions = ref('')
customerProjectOptions.value = timesheetListStore.CustomerProjectsList;

const serviceItemsOptions = ref('')
// serviceItemsOptions.value = timesheetListStore.ServiceItemsList

const handleSelectChange = (sampleModel) => {
        console.log('Selected value:', sampleModel.id);
        serviceItemsOptions.value = timesheetListStore.getServiceItemsBycustomerProjectId(sampleModel.id)
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
          v-model="sampleModel2"
          :options="serviceItemsOptions"
          option-label="name"
          option-value="id"
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
