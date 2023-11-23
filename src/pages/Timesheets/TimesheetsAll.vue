<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useTimesheetsStore } from '../../stores/timesheet/TimesheetsStore';
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

function getStatusColor(status: string) {
  if (status == 'Approved') {
    return 'status-approved';
  }
  if (status == 'Pending') {
    return 'status-pending';
  }
  if (status == 'Rejected') {
    return 'status-rejected';
  }
}
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
        <q-tab name="Inbox" label="Inbox" icon="inbox" class="text-orange">
          <q-badge color="red" floating>2</q-badge>
        </q-tab>
        <q-tab name="Outbox" label="Outbox" icon="outbox" class="text-cyan" />
        <q-tab
          name="Archived"
          label="Archived"
          icon="archive"
          class="text-red"
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
                fromDate: item.fromDate,
                readOnly: item.readOnly,
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
              <q-chip dense :class="getStatusColor(item.status)">
                <q-item-label caption>{{ item.status }}</q-item-label>
              </q-chip>
            </q-item-section>
            <q-item-section side>
              <q-icon color="primary" name="chevron_right" />
            </q-item-section>
          </q-item>
          <q-separator></q-separator>
        </q-list>
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
          <q-btn
            :to="{
              name: 'newTimesheetPeriod',
            }"
            fab
            icon="add"
            color="accent"
            padding="sm"
          >
          </q-btn>
        </q-page-sticky>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<style lang="scss">
@import '../../css/status.scss';
</style>
