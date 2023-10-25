<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useTimesheetsStore } from '../../stores/TimesheetsStore';

const timesheetStatus = ref('Saved');

const timesheetsStore = useTimesheetsStore();

onMounted(() => {
  timesheetsStore.getTimesheetsByStatus(String(timesheetStatus.value));
});

const timesheetsAll = computed(() => {
  return timesheetsStore.Timesheets;
});
watch([timesheetStatus], ([newModel]) => {
  timesheetsStore.getTimesheetsByStatus(String(newModel));
});

const tabs = [
  {
    id: 1,
    status: 'Saved',
  },
  {
    id: 2,
    status: 'Pending',
  },
  {
    id: 3,
    status: 'Submitted',
  },
  {
    id: 4,
    status: 'Approved',
  },
  {
    id: 5,
    status: 'Rejected',
  },
];
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar class="glossy">
        <q-toolbar-title> Timesheets </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-footer elevated>
      <q-tabs
        no-caps
        active-color="primary"
        indicator-color="transparent"
        class="bg-grey-6"
        v-model="timesheetStatus"
      >
        <q-tab
          v-for="item in tabs"
          :name="item.status"
          :key="item.id"
          :label="item.status"
        />
      </q-tabs>
    </q-footer>
    <q-page-container>
      <q-page>
        <q-list v-for="item in timesheetsAll" :key="item.id">
          <q-item
            :to="{
              name: 'timesheetDetails',
              params: {
                id: item.id,
              },
            }"
            clickable
            v-ripple
          >
            <q-item-section>
              <q-item-label>
                {{ item.createdByUserName }}
              </q-item-label>
              <q-item-label caption>{{ item.fromDate }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon color="primary" name="chevron_right" />
            </q-item-section>
          </q-item>
          <q-separator></q-separator>
        </q-list>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
