<script setup lang="ts">
import TimesheetForm from '../../components/Timesheets/TimesheetFormCtrl.vue';
import { TimesheetDetails } from 'src/models/Timesheet/timesheetDetails';
import { useRouter, useRoute } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
import { useTimesheetsStore } from 'src/stores/timesheet/TimesheetsStore';
import { useTECommentsStore } from '../../stores/TECommentsStore';
import { useQuasar } from 'quasar';
import OCSaveButton from '../../components/OCcomponents/OC-SaveButton.vue';

const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const periodName = route.params.periodName;
const timesheetStore = useTimesheetsStore();
const timesheetCommentsStore = useTECommentsStore();

onMounted(async () => {
  try {
    await timesheetCommentsStore.getTimesheetGroupProfile();
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      await router.push({ path: '/timesheetsAll' });
    });
  }
});

const timesheetSid = computed(() => {
  return route.params.timesheetSid;
});

const timesheetDCAA = computed(() => {
  return timesheetCommentsStore.timesheetDCAA;
});

console.log('New timesheet DCAA: ', timesheetDCAA.value);

const timesheetDetails: TimesheetDetails = ref({
  id: '',
  timesheetSid: timesheetSid.value
    ? timesheetSid.value !== '0'
      ? timesheetSid.value
      : ''
    : '',
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
  security: [],
  comments: '',
});

const childComponent = ref(null);

async function onSubmit() {
  // e.preventDefault();
  try {
    if (!childComponent.value.validateAll()) return;
    const newTimesheet = ref(timesheetDetails);
    await timesheetStore.addTimesheetDetails(newTimesheet.value);
    router.go(-2);
  } catch (error) {
    console.log(`*** NewTimesheet:onSubmit(...):catch: ${error} ***`);
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      console.log('*** NewTimesheet:onSubmit(...):onOK ***');
    });
  }
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
        <OCSaveButton @handleClick="onSubmit"></OCSaveButton>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page>
        <q-list>
          <q-form @submit="onSubmit" class="q-gutter-md">
            <TimesheetForm
              v-if="timesheetDetails && timesheetDCAA"
              :timesheet="timesheetDetails"
              :timesheetDCAA="timesheetDCAA"
              :periodName="periodName"
              ref="childComponent"
            />
            <!-- <q-btn label="Save" type="submit" color="primary"></q-btn> -->
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
