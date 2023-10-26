<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useTimesheetsStore } from '../../stores/TimesheetsStore';
import dateTimeHelper from '../../helpers/dateTimeHelper';

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
    icon: 'inbox',
    text: 'text-orange',
  },
  {
    id: 2,
    name: 'Outbox',
    status: 'Outbox',
    icon: 'outbox',
    text: 'text-cyan',
  },
  {
    id: 3,
    name: 'Archived',
    status: 'Archived',
    icon: 'archive',
    text: 'text-red',
  },
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
        class="bg-grey-9"
        dense
        align="justify"
        switch-indicator
      >
        <q-tab
          v-for="item in tabs"
          :name="item.name"
          :key="item.id"
          :label="item.status"
          :icon="item.icon"
          :class="item.text"
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
              <q-item-label caption>
                {{
                  item.fromDate
                    ? dateTimeHelper.extractDateFromUtc(item.fromDate)
                    : 'No Specific Date'
                }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label caption class="bg-teal-3 q-pa-xs">{{
                item.status
              }}</q-item-label>
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
