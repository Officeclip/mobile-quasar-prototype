<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<!-- Cleaned up using Google Bard -->
<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useTimesheetsStore } from '../../stores/timesheet/TimesheetsStore';
import { useTimesheetListStore } from '../../stores/timesheet/TimesheetListStore';
import { useRouter, useRoute } from 'vue-router';
import TimesheetForm from '../../components/Timesheets/TimesheetFormCtrl.vue';
import { useTECommentsStore } from '../../stores/TECommentsStore';
import { useQuasar } from 'quasar';
import OCSaveButton from 'src/components/OCcomponents/OC-SaveButton.vue';

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const timesheetsStore = useTimesheetsStore();
const timesheetListStore = useTimesheetListStore();
const timesheetCommentsStore = useTECommentsStore();

const timesheetDetailSid = route.params.id;
const fromDate: any = route.params.fromDate;

const periodName = computed(() => {
  return timesheetListStore.PeriodList.find((x) => x.start === fromDate);
});

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

async function onSubmit() {
  // e.preventDefault();
  try {
    const editTimesheet = ref(timesheet);
    await timesheetsStore.editTimesheet(editTimesheet.value);
    router.go(-1);
  } catch (error) {
    console.log(`*** Edit Timesheet:onSubmit(...):catch: ${error} ***`);
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      console.log('*** Edit Timesheet:onSubmit(...):onOK ***');
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
        <q-toolbar-title> Edit Timesheet</q-toolbar-title>
        <!-- <q-btn
          class="q-px-md"
          dense
          label="Save"
          no-caps
          outline
          rounded
          type="submit"
          @click="onSubmit"
        /> -->
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
            :periodName="periodName?.name"
          />
          <!-- <q-btn
            class="q-ml-md q-mb-md"
            label="Submit"
            type="submit"
            color="primary"
          >
          </q-btn> -->
        </div>
      </q-form>
    </q-page-container>
  </q-layout>
</template>

<style></style>
