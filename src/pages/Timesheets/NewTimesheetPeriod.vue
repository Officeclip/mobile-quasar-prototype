<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useTimesheetListStore } from '../../stores/timesheet/TimesheetListStore';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const $q = useQuasar();
const router = useRouter();
const periodModel: any = ref();
const errorMsg: any = ref('');
const warningMsg: any = ref('');

const toDaysDate = new Date().toISOString().split('T')[0];

console.log('startDateOfWeek:::startDateOfWeek', toDaysDate);

const periodsList = computed(() => {
  return timesheetListStore.PeriodList;
});
const timesheetListStore = useTimesheetListStore();

const setModelValue = computed(() => {
  return periodsList.value.find((option) => {
    const start = option.start.toString();
    const end = option.end.toString();
    return toDaysDate >= start && toDaysDate <= end;
  });
});

onMounted(async () => {
  try {
    await timesheetListStore.getTimesheetListAll();
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      await router.push({ path: '/HomePage' });
    });
  }
  periodModel.value = setModelValue.value;
});

watch([periodModel], ([newPeriodModel]) => {
  errorMsg.value = newPeriodModel.error;
  warningMsg.value = newPeriodModel.warning;
});
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
          <q-item v-if="errorMsg || warningMsg">
            <p v-if="errorMsg" class="text-red">{{ errorMsg }}</p>
            <p v-if="warningMsg" class="text-orange">{{ warningMsg }}</p>
          </q-item>
          <pre>periodModel::{{ periodModel }}</pre>
          <q-item>
            <q-select
              class="full-width"
              label="Period"
              v-model="periodModel"
              :options="periodsList"
              map-options
              option-label="name"
          /></q-item>
          <q-list>
            <q-btn
              v-if="periodModel != '' && errorMsg == ''"
              class="q-ma-md"
              label="Next"
              color="primary"
              :to="{
                name: 'newTimesheet',
                params: {
                  fromDate: periodModel?.start,
                  toDate: periodModel?.end,
                  timesheetSid: '0',
                },
              }"
            >
            </q-btn>
          </q-list>
        </q-list>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
