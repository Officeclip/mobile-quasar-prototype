<script setup lang="ts">
import TimesheetForm from '../../components/Timesheets/TimesheetFormCtrl.vue';
import { TimesheetDetails } from 'src/models/Timesheet/timesheetDetails';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();

// const timesheetStore = useTimesheetsStore()
const timesheet: TimesheetDetails = ref({
  id: Number(),
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
  timesheetDetailSid: '',
});
// const timesheet = ref({
//   createdDate: '',
//   accountName: '',
//   serviceItemName: '',
//   isBillable: true,
//   timeDuration: Number(),
//   description: '',
// });

function onSubmit(e: any) {
  e.preventDefault();

  const newTimesheet = {
    // accountName: timesheet.value.accountName,
    // accountId: '',
    // createdDate: timesheet.value.createdDate,
    // createdUserId: '',
    // description: timesheet.value.description,
    // isBillable: timesheet.value.isBillable,
    // payrollName: '',
    // projectName: '',
    // projectId: '',
    // serviceItemName: timesheet.value.serviceItemName,
    // timeDuration: timesheet.value.timeDuration,
  };
  console.log(`onSubmit Timesheet Value: ${{ newTimesheet }}`);

  router.push('/');
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
      <q-form @submit="onSubmit" class="q-gutter-md">
        <div>
          <TimesheetForm :timesheet="timesheet" />
          <q-btn
            class="q-ml-md q-mb-md q-mt-md"
            label="Submit"
            type="submit"
            color="primary"
          ></q-btn>
          <q-btn
            label="Reset"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          ></q-btn>
        </div>
      </q-form>
    </q-page-container>
  </q-layout>
</template>

<style scoped></style>
