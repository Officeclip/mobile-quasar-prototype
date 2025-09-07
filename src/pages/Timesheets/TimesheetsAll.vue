<script setup lang="ts">
import { ref, computed, watch, capitalize, onMounted, nextTick } from 'vue';
import { useTimesheetsStore } from '../../stores/timesheet/TimesheetsStore';
import dateTimeHelper from '../../helpers/dateTimeHelper';
import { getExpenseOrTimesheetStatusColor } from 'src/helpers/colorIconHelper';
import { QInfiniteScroll, useQuasar } from 'quasar';
import { isAllowed } from 'src/helpers/security';
import { useTECommentsStore } from 'src/stores/TECommentsStore';
import drawer from 'src/components/drawer.vue';
import OC_Header from 'src/components/OCcomponents/OC_Header.vue';
import OC_Loader from 'src/components/general/OC_Loader.vue';

const timesheetsStore = useTimesheetsStore();
const teCommentsStore = useTECommentsStore();
const $q = useQuasar();

const tab = ref(timesheetsStore.selectedTab);
const title = ref(capitalize(tab.value));
const loading = ref(false); // <-- Change this from 'true' to 'false'
let reachedEnd = ref(false);
const myDrawer = ref();
const infiniteScrollRef = ref<QInfiniteScroll | null>(null); // <-- Add ref for the component

// --- Computed Properties ---
const timesheetsAll = computed(() => timesheetsStore.Timesheets);
const timesheetDCAA = computed(() => teCommentsStore.TimesheetDCAA);
const errorMsg = computed(() => timesheetsStore.errorMsg);

const loadTEGroupProfile = async () => {
  await teCommentsStore.getTimesheetGroupProfile();
};
const loadMore = async (index: number, done: () => void) => {
  loading.value = true;
  try {
    // Fetch more timesheets for the current tab
    reachedEnd.value = await timesheetsStore.fetchMoreTimesheets(tab.value);
    if (reachedEnd.value) {
      infiniteScrollRef.value?.stop(); // Stop infinite scroll if all data is loaded
    }
    done();
  } catch (error) {
    reachedEnd.value = true; // Stop on error
    done();
    $q.dialog({
      title: 'Alert',
      message: error as string,
    });
  } finally {
    loading.value = false;
  }
};

// --- Watcher ---
// This is the key fix: watching the tab to reset state and trigger a new load.
watch(tab, async (newTab) => {
  timesheetsStore.selectedTab = newTab;
  title.value = capitalize(newTab); // 1. Reset the store's list and pagination state

  await timesheetsStore.resetTimesheets(); // 2. Reset the component's own "end reached" flag

  reachedEnd.value = false; // 3. Reset the q-infinite-scroll and EXPLICITLY trigger a new load.

  // Simply calling .reset() is not reliably triggering the load in this scenario.
  // Calling .trigger() right after ensures the fetch for the new tab happens.
  if (infiniteScrollRef.value) {
    infiniteScrollRef.value.reset();
    infiniteScrollRef.value.trigger();
  }
});

// --- Lifecycle Hook ---
onMounted(async () => {
  // Clear any stale data from previous sessions on component mount
  await timesheetsStore.resetTimesheets();
  await loadTEGroupProfile();
  // q-infinite-scroll will automatically call `loadMore` on mount.

  // Wait for the DOM to update after the reset.
  await nextTick();
  // Now that the component is mounted and the list is empty,
  // explicitly trigger the infinite scroll to fetch the first page.
  if (infiniteScrollRef.value) {
    infiniteScrollRef.value.trigger();
  }
});

const isAllow = isAllowed({ roleAccess: 'TimeExpensesCreateTimeSheet' });
const showWarningMsg = () => {
  alert(
    'Add new time entry is not available in mobile app for Check-in, Check-out mode, please visit the web app to add the new timesheet',
  );
};

function toggleLeftDrawer() {
  if (myDrawer.value == null) return;
  myDrawer.value.toggleLeftDrawer();
}
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <OC_Header
      :title="`Timesheets: ${title}`"
      back-button-to="/homepage"
      :show-menu-button="true"
      @toggle-drawer="toggleLeftDrawer"
    ></OC_Header>
    <drawer ref="myDrawer" />
    <q-footer bordered class="bg-grey-3">
      <q-tabs
        v-model="tab"
        active-color="primary"
        align="justify"
        dense
        class="text-grey-8"
        indicator-color="transparent"
      >
        <q-tab name="inbox" label="Inbox" icon="inbox" />
        <q-tab name="outbox" label="Outbox" icon="outbox" />
        <q-tab name="archived" label="Archived" icon="archive" />
      </q-tabs>
    </q-footer>
    <q-page-container>
      <q-page>
        <div v-if="errorMsg !== ''">
          <q-list class="flex flex-center">
            <q-item v-if="title === 'Inbox'">
              <q-item-section>
                <q-item-label class="text-h6 q-py-md">
                  {{ errorMsg }}
                </q-item-label>
                <q-item-label class="text-h6 q-py-sm">
                  Create your first Timesheet
                </q-item-label>
                <q-item-label>
                  A timesheet is used to track employee's time spent on projects
                  and tasks.
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-else>
              <q-item-section>
                <q-item-label class="text-h6 q-py-md">
                  {{ errorMsg }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <OC_Loader :visible="loading" />
        <q-infinite-scroll
          ref="infiniteScrollRef"
          :disable="reachedEnd"
          @load="loadMore"
        >
          <q-list v-for="item in timesheetsAll" :key="item.id">
            <q-item
              :to="{
                name: 'timesheetDetails',
                params: {
                  id: item.id,
                  employeeId: item.employeeId,
                  fromDate: item.fromDate,
                  toDate: item.toDate,
                  stageId: item.stageId,
                  status: item.status,
                  mode: item.mode,
                },
              }"
              clickable
              v-ripple
            >
              <q-item-section class="col-grow q-mr-lg">
                <q-item-label>
                  {{ item.createdByUserName }}
                </q-item-label>
                <q-item-label caption class="text-grey-8">
                  {{
                    item.fromDate
                      ? dateTimeHelper.formatDateForTE(item.fromDate)
                      : 'No Specific Date'
                  }}
                </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  {{ item.totalHours }}
                  <span class="text-caption q-pl-xs">hrs</span>
                </q-item-label>
              </q-item-section>
              <q-item-section style="align-items: end">
                <q-chip
                  dense
                  :class="getExpenseOrTimesheetStatusColor(item.status)"
                >
                  <q-item-label caption class="q-px-sm">{{
                    item.status
                  }}</q-item-label>
                </q-chip>
              </q-item-section>
              <q-item-section side>
                <q-icon color="primary" name="chevron_right" />
              </q-item-section>
            </q-item>
            <q-separator></q-separator>
          </q-list>
          <template v-slot:loading>
            <q-spinner-dots color="primary" size="40px"></q-spinner-dots>
          </template>
        </q-infinite-scroll>

        <q-page-sticky position="bottom-right" :offset="[18, 18]">
          <q-btn
            v-if="isAllow && timesheetDCAA.mode === 'PERIODIC'"
            :to="{
              name: 'newTimesheetPeriod',
            }"
            fab
            icon="add"
            color="accent"
            padding="md"
          >
          </q-btn>
          <q-btn
            v-else
            fab
            icon="add"
            color="accent"
            padding="md"
            @click="showWarningMsg"
          >
          </q-btn>
        </q-page-sticky>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<style lang="scss">
@import '../../css/status.scss';
.q-tab__indicator {
  height: 6px !important;
}
</style>
