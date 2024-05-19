<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useTimesheetListStore } from '../../stores/timesheet/TimesheetListStore';

const periodModel: any = ref('');

const errorMsg: any = ref('');
const warningMsg: any = ref('');

const periodsList = computed(() => {
  return timesheetListStore.PeriodList;
});
const timesheetListStore = useTimesheetListStore();
onMounted(() => {
  timesheetListStore.getTimesheetListAll();
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
                  periodName: periodModel.name,
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
