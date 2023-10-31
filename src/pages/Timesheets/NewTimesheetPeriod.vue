<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useTimesheetListStore } from '../../stores/timesheet/TimesheetListStore';
import dateTimeHelper from 'src/helpers/dateTimeHelper';

const periodModel: any = ref('');
const dateModel: any = ref('');
const datesList: any = ref([]);

const periodsList = computed(() => {
  return timesheetListStore.PeriodList;
});
const timesheetListStore = useTimesheetListStore();
onMounted(() => {
  timesheetListStore.getTimesheetListAll();
});

watch([periodModel, datesList], () => {
  dateModel.value = '';
  const startDate = periodModel.value.start;
  const endDate = periodModel.value.end;
  datesList.value = dateTimeHelper.populateDates(startDate, endDate);
});
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
        <pre>{{ periodModel }}</pre>
        <q-select
          label="Period"
          v-model="periodModel"
          :options="periodsList"
          map-options
          option-label="name"
        />
        <pre>{{ dateModel }}</pre>
        <q-select
          label="Dates"
          v-model="dateModel"
          :options="datesList"
          map-options
          option-label="label"
        />
        <q-btn
          class="q-ml-md q-mb-md q-mt-md"
          label="Next"
          color="primary"
          :to="{
            name: 'newExpense',
            params: {},
          }"
        ></q-btn>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped></style>
