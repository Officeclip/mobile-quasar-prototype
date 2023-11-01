<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<!-- Cleaned up using Google Bard -->
<script setup lang="ts">
import { onMounted, onBeforeMount, computed } from 'vue';
import { useTimesheetsStore } from '../../stores/timesheet/TimesheetsStore';
import { useRouter, useRoute } from 'vue-router';
import TimesheetForm from '../../components/Timesheets/TimesheetFormCtrl.vue';
import { TimesheetDetails } from '../../models/Timesheet/timesheetDetails';
// import dateTimeHelper from '../../helpers/dateTimeHelper';

const timesheetsStore = useTimesheetsStore();

const route = useRoute();
const router = useRouter();
const timesheetDetailSid = route.params.id;

onBeforeMount(() => {
  timesheetsStore.getSingleTimesheetDetail(timesheetDetailSid);
});

const timesheet = computed(() => {
  return timesheetsStore.TimesheetDetail;
});

function onSubmit(e: any) {
  e.preventDefault();
  const newData: any = timesheet?.value;

  const newTimesheet: TimesheetDetails = {
    id: newData.id,
    timeDuration: newData.timeDuration,
    isBillable: newData.isBillable,
    accountName: newData.accountName,
    accountSid: newData.accountSid,
    breakTime: newData.breakTime,
    checkInTime: newData.checkInTime,
    checkOutTime: newData.checkOutTime,
    createdDate: newData.createdDate,
    createdUserSid: newData.createdUserSid,
    description: newData.description,
    modifiedDate: newData.modifiedDate,
    modifiedUserSid: newData.modifiedUserSid,
    payrollName: newData.payrollName,
    payrollSid: newData.payrollSid,
    projectName: newData.projectName,
    projectSid: newData.projectSid,
    serviceItemName: newData.serviceItemName,
    serviceItemSid: newData.serviceItemSid,
    taskDate: newData.taskDate,
    timesheetDetailSid: newData.timesheetDetailSid,
  };
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  //timesheetsStore.editTimesheet(timesheet.value!);
  timesheetsStore.editTimesheet(newTimesheet);
  router.push('-2');
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
          <TimesheetForm v-if="timesheet" :timesheet="timesheet" />
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
