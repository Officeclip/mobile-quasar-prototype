<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useTimesheetsStore } from '../../stores/TimesheetsStore';

const timesheetStatus = ref('Inbox');
const title = ref(timesheetStatus.value);

const timesheetsStore = useTimesheetsStore();

onMounted(() => {
  timesheetsStore.getTimesheetsByStatus(String(timesheetStatus.value));
});

const timesheetsAll = computed(() => {
  return timesheetsStore.Timesheets;
});
watch([timesheetStatus], ([newModel]) => {
  timesheetsStore.getTimesheetsByStatus(String(newModel));
  title.value = newModel;
});

const tabs = [
  {
    id: 1,
    name: 'Inbox',
    status: 'Inbox',
  },
  {
    id: 2,
    name: 'Outbox',
    status: 'Outbox',
  },
  {
    id: 3,
    name: 'Archived',
    status: 'Archived',
  },
  // {
  //   id: 4,
  //   name: 'Approved',
  //   status: 'Approved',
  // },
  // {
  //   id: 5,
  //   name: 'Rejected',
  //   status: 'Rejected',
  // },
];
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar class="glossy">
        <q-btn
          @click="$router.go(-1)"
          flat
          round
          dense
          color="white"
          icon="arrow_back"
        >
        </q-btn>
        <q-toolbar-title>{{ title }} Timesheets </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-footer elevated>
      <q-tabs
        v-model="timesheetStatus"
        no-caps
        inline-label
        class="bg-primary text-white shadow-2"
        align="justify"
      >
        <q-tab
          v-for="item in tabs"
          :name="item.name"
          :key="item.id"
          :label="item.status"
        />
      </q-tabs>
    </q-footer>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        :to="{
          name: 'newTimesheet',
          params: {
            id: $route.params.id,
          },
        }"
        fab
        icon="add"
        color="accent"
        padding="sm"
      >
      </q-btn>
    </q-page-sticky>
    <q-page-container>
      <q-page>
        <pre>{{ timesheetStatus }}</pre>
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
