<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<!-- Cleaned up using Google Bard -->
<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useTimesheetsStore } from '../../stores/TimesheetsStore';
import { useRouter } from 'vue-router';
import TimesheetForm from '../../components/Timesheets/TimesheetFormCtrl.vue';
// import dateTimeHelper from '../../helpers/dateTimeHelper';

const timesheetsStore = useTimesheetsStore();

// const route = useRoute();
const router = useRouter();
console.log('Edit Timesheet Started');

// const id = ref<string | string[]>(route.params.id);


onMounted(() => {
  timesheetsStore.getTimesheets();
});

const timesheet = computed(() => {
  return timesheetsStore.TimesheetDetails[0];
});

function onSubmit(e: any) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const createdDate = formData.get('newcreatedDate');
  const taskDate = formData.get('newtaskDate')
  console.log(`onSubmit Task Value: ${timesheet.value}`);

  const newTimesheet: any = {
    id: timesheet.value?.id,
    accountName: timesheet.value?.accountName,
    projectName: timesheet.value?.projectName,
    serviceItemName: timesheet.value?.serviceItemName,
    isBillable: timesheet.value?.isBillable,
    description: timesheet.value?.description,
    createdDate: createdDate,
    taskDate: taskDate,
    timeDuration: timesheet.value?.timeDuration,


  }
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
        <q-toolbar-title> Edit Task</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form @submit="onSubmit" class="q-gutter-md">
        <div>
          <TimesheetForm :timesheet="timesheet" />
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
