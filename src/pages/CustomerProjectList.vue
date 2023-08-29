<script setup>
import { onMounted, onUpdated, ref } from 'vue';
import { useTimesheetListStore } from '../stores/TimesheetListStore';


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

</script>

<template>
  <q-layout>
    <q-page-container>
      <q-page>
      <div class="q-pa-md q-gutter-y-md">
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
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
