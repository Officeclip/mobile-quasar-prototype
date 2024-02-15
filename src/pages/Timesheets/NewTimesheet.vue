<script setup lang="ts">
import TimesheetForm from '../../components/Timesheets/TimesheetFormCtrl.vue';
import { TimesheetDetails } from 'src/models/Timesheet/timesheetDetails';
// import { useTimesheetListStore } from '../../stores/timesheet/TimesheetListStore';
// import dateTimeHelper from 'src/helpers/dateTimeHelper';
import { useRouter, useRoute } from 'vue-router';
import { ref } from 'vue';
import { useTimesheetsStore } from 'src/stores/timesheet/TimesheetsStore';

const router = useRouter();
const route = useRoute();
const periodName = route.params.periodName;
console.log('Sending the period option from new==> new', periodName);
// const startDate = periods.value.start
const timesheetStore = useTimesheetsStore();
// const timesheetListStore = useTimesheetListStore();
// const selectedPeriod = computed(() => {
//   return timesheetListStore.SelectedPeriod;
// });
const timesheetDetails: TimesheetDetails = ref({
  id: '',
  timesheetSid: '',
  timeDuration: Number(),
  isBillable: true,
  accountName: '',
  accountSid: '',
  breakTime: '',
  checkInTime: '',
  checkOutTime: '',
  createdDate: '',
  createdUserSid: '',
  description: '',
  modifiedDate: '',
  modifiedUserSid: '',
  payrollName: '',
  payrollSid: '',
  projectName: '',
  projectSid: '',
  serviceItemName: '',
  serviceItemSid: '',
  taskDate: '',
});
function onSubmit(e: any) {
  e.preventDefault();
  const newTimesheet = ref(timesheetDetails);
  timesheetStore.addTimesheetDetails(newTimesheet.value);
  // router.push('-1');
  router.go(-2);
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
        <q-toolbar-title> New Timesheet</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page>
        <q-list>
          <q-form @submit="onSubmit" class="q-gutter-md">
            <TimesheetForm
              v-if="timesheetDetails"
              :timesheet="timesheetDetails"
              :periodName="periodName"
            />
            <q-btn label="Save" type="submit" color="primary"></q-btn>
            <q-btn
              label="Reset"
              type="reset"
              color="primary"
              flat
              class="q-ml-sm"
            ></q-btn>
          </q-form>
        </q-list>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped></style>
