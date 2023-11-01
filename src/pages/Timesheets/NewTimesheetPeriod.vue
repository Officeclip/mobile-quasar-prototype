<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useTimesheetListStore } from '../../stores/timesheet/TimesheetListStore';

const periodModel: any = ref('');
// const periodModel1 = {
//   end: '2023-12-16T00:00:00+05:30',
//   name: 'Dec 03, 2023 - Dec 16, 2023',
//   start: '2023-12-03T00:00:00+05:30',
// };
const periodsList = computed(() => {
  return timesheetListStore.PeriodList;
});
const timesheetListStore = useTimesheetListStore();
onMounted(() => {
  timesheetListStore.getTimesheetListAll();
});

// timesheetListStore.selectedPeriod = computed(() => {
//   return periodModel.value != '' ? periodModel.value : 'ERROR';
// });

// watch([periodModel, datesList], () => {
//   dateModel.value = '';
//   const startDate = periodModel.value.start;
//   const endDate = periodModel.value.end;
//   datesList.value = dateTimeHelper.populateDates(startDate, endDate);
//   showDatesWarning.value = false;
// });
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn
          @click="$router.go(-1)"
          flat
          round
          dense
          color="white"
          icon="arrow_back"
        >
        </q-btn>
        <q-toolbar-title> New Timesheet</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page>
        <q-list>
          <pre>{{ periodModel }}</pre>
          <q-item>
            <q-select
              class="full-width"
              label="Period"
              v-model="periodModel"
              :options="periodsList"
              map-options
              option-label="name"
          /></q-item>
          <q-list>
            <q-btn
              class="q-ma-md"
              label="Next"
              color="primary"
              :to="{
                name: 'newTimesheet',
                params: {
                  periodName: periodModel.name,
                },
              }"
            ></q-btn></q-list
        ></q-list>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
