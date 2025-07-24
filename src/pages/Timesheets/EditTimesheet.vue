<script setup lang="ts">
import { onMounted, computed, ref, Ref } from 'vue';
import { useTimesheetsStore } from '../../stores/timesheet/TimesheetsStore';
import { useRouter, useRoute } from 'vue-router';
import TimesheetForm from '../../components/Timesheets/TimesheetFormCtrl.vue';
import { useTECommentsStore } from '../../stores/TECommentsStore';
import { useQuasar } from 'quasar';
import OCSaveButton from 'src/components/OCcomponents/OC-SaveButton.vue';
import { TimesheetDetails } from 'src/models/Timesheet/timesheetDetails';

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const timesheetsStore = useTimesheetsStore();
const timesheetCommentsStore = useTECommentsStore();

const timesheetDetailSid = route.params.id;
const fromDate: any = route.params.fromDate;
const toDate: any = route.params.toDate;

const timesheet: Ref<TimesheetDetails> = ref(null);

onMounted(async () => {
  try {
    await timesheetsStore.getSingleTimesheetDetail(timesheetDetailSid);
    await timesheetCommentsStore.getTimesheetGroupProfile();
    const response = timesheetsStore.TimesheetDetail;
    timesheet.value = response;
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      await router.push({ path: '/timesheetsAll' });
    });
  }
});

const timesheetDCAA = computed(() => {
  return timesheetCommentsStore.timesheetDCAA;
});

const childComponent = ref(null);

async function onSubmit() {
  try {
    if (!childComponent.value.validateAll()) return;
    const editTimesheet = ref(timesheet);
    await timesheetsStore.editTimesheet(editTimesheet.value);
    router.go(-1);
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    });
  }
}
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn
          @click="router.go(-1)"
          flat
          round
          dense
          color="white"
          icon="arrow_back"
        >
        </q-btn>
        <q-toolbar-title> Edit Timesheet</q-toolbar-title>
        <OCSaveButton @handleClick="onSubmit"></OCSaveButton>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form @submit="onSubmit" class="q-gutter-md">
        <div>
          <TimesheetForm
            v-if="timesheet && timesheetDCAA"
            :timesheet="timesheet"
            :timesheetDCAA="timesheetDCAA"
            :fromDate="fromDate"
            :toDate="toDate"
            ref="childComponent"
          />
        </div>
      </q-form>
    </q-page-container>
  </q-layout>
</template>

<style></style>
