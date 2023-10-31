<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useTimesheetListStore } from '../../stores/timesheet/TimesheetListStore';
import dateTimeHelper from 'src/helpers/dateTimeHelper';

const periodModel: any = ref('');
const dateModel: any = ref('');
const datesList: any = ref([]);
const showDatesWarning = ref(false);

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
  showDatesWarning.value = false;
});
const checkDatesList = () => {
  if (datesList.value.length === 0) {
    showDatesWarning.value = true;
  }
};
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
          <pre>{{ dateModel }}</pre>
          <p
            v-if="showDatesWarning"
            style="color: rgb(255, 149, 0); margin-top: 5px"
          >
            Warning: Please select the period first!
          </p>
          <q-item>
            <q-select
              @focus="checkDatesList"
              class="full-width"
              label="Dates"
              v-model="dateModel"
              :options="datesList"
              map-options
          /></q-item>

          <q-list>
            <q-btn
              class="q-ma-md"
              label="Next"
              color="primary"
              :to="{
                name: 'newTimesheet',
                params: {},
              }"
            ></q-btn></q-list
        ></q-list>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped></style>
