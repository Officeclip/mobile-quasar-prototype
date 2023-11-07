<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<!-- Cleaned up using Google Bard -->
<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useTimesheetsStore } from '../../stores/timesheet/TimesheetsStore';
import { useTimesheetListStore } from '../../stores/timesheet/TimesheetListStore';
import { useRouter, useRoute } from 'vue-router';
import TimesheetForm from '../../components/Timesheets/TimesheetFormCtrl.vue';
import { TimesheetDetails } from '../../models/Timesheet/timesheetDetails';
// import dateTimeHelper from '../../helpers/dateTimeHelper';

const route = useRoute();
const router = useRouter();
const timesheetDetailSid = route.params.id;
const fromDate: any = route.params.fromDate;
const timesheetsStore = useTimesheetsStore();
const timesheetListStore = useTimesheetListStore();
const periodName = computed(() => {
  return timesheetListStore.PeriodList.find((x) => x.start === fromDate);
});
onMounted(() => {
  timesheetsStore.getSingleTimesheetDetail(timesheetDetailSid);
});

const timesheet: Ref<TimesheetDetails> = computed(() => {
  return timesheetsStore.TimesheetDetail;
});

function onSubmit(e: any) {
  e.preventDefault();
  const editTimesheet = ref(timesheet);
  console.log('OOOOOOOOO___+++++++OOOOO', editTimesheet.value);
  timesheetsStore.editTimesheet(editTimesheet.value);
  router.go(-1);
}
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
        <q-toolbar-title> Edit Timesheet</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form @submit="onSubmit" class="q-gutter-md">
        <div>
          <TimesheetForm
            v-if="timesheet"
            :timesheet="timesheet"
            :periodName="periodName?.name"
          />
          <q-btn
            class="q-ml-md q-mb-md"
            label="Submit"
            type="submit"
            color="primary"
          >
          </q-btn>
        </div>
      </q-form>
    </q-page-container>
  </q-layout>
</template>

<style></style>
