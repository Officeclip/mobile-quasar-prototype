<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<!-- Cleaned up using Google Bard -->
<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useTimesheetsStore } from '../../stores/timesheet/TimesheetsStore';
import { useRouter, useRoute } from 'vue-router';
import TimesheetForm from '../../components/Timesheets/TimesheetFormCtrl.vue';
import { useTECommentsStore } from '../../stores/TECommentsStore';
import { useQuasar } from 'quasar';
import OCSaveButton from 'src/components/OCcomponents/OC-SaveButton.vue';

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const timesheetsStore = useTimesheetsStore();
const timesheetCommentsStore = useTECommentsStore();

const timesheetDetailSid = route.params.id;
const fromDate: any = route.params.fromDate;
const toDate: any = route.params.toDate;

onMounted(async () => {
  try {
    await timesheetsStore.getSingleTimesheetDetail(timesheetDetailSid);
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

const timesheetDCAA = computed(() => {
  return timesheetCommentsStore.timesheetDCAA;
});

const timesheet = computed(() => {
  return timesheetsStore.TimesheetDetail;
});

const childComponent = ref(null);

async function onSubmit() {
  // e.preventDefault();
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
