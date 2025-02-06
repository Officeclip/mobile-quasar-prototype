<script setup lang="ts">
import { ref, computed, watch, capitalize, onMounted } from 'vue';
import { useTimeOffStore } from '../../stores/timeOff/timeOffStore';
// import dateTimeHelper from '../../helpers/dateTimeHelper';
// import { getExpenseOrTimesheetStatusColor } from 'src/helpers/colorIconHelper';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
// import { isAllowed } from 'src/helpers/security';
// import { useTECommentsStore } from 'src/stores/TECommentsStore';
import drawer from '../../components/drawer.vue';
import { TimeOffSummary } from 'src/models/TimeOff/timeOffSummary';

// const timesheetStatus = ref('inbox');
// const title = ref(capitalize(timesheetStatus.value));
const $q = useQuasar();
const router = useRouter();
const tab = ref('my-requests');
const myDrawer = ref();

const timeOffStore = useTimeOffStore();
onMounted(async () => {
  try {
    // await teCommentsStore.getTimesheetGroupProfile();
    await timeOffStore.getTimeOffSummariesFake(tab.value);
    // await timeOffStore.getTimeOffByCategory(tab.value);
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      await router.push({ path: '/homePage' });
      router.go(0);
    });
  }
});

const timeOffSummaries = computed<TimeOffSummary[]>(() => {
  return timeOffStore.TimeOffSummaries as unknown as TimeOffSummary[];
});
// const timesheetDCAA = computed(() => {
//   return teCommentsStore.TimesheetDCAA;
// });

// const errorMsg = computed(() => {
//   return timesheetsStore.errorMsg;
// });

// watch([timesheetStatus], ([newModel]) => {
//   timesheetsStore.getTimesheetsByStatus(String(newModel));
//   title.value = capitalize(newModel);
// });

// const isAllow = isAllowed({ roleAccess: 'TimeExpensesCreateTimeSheet' });
// const showWarningMsg = () => {
//   alert(
//     'Add new time entry is not available in mobile app for Check-in, Check-out mode, please visit the web app to add the new timesheet'
//   );
// };

function toggleLeftDrawer() {
  if (myDrawer.value == null) return;
  myDrawer.value.toggleLeftDrawer();
}
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar class="glossy">
        <q-btn
          @click="router.push({ path: '/homepage' })"
          flat
          round
          dense
          color="white"
          icon="arrow_back"
        >
        </q-btn>
        <q-btn
          aria-label="Menu"
          dense
          flat
          icon="menu"
          round
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title>Time Off({{ tab }})</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <drawer ref="myDrawer" />
    <q-footer elevated>
      <q-tabs
        v-model="tab"
        no-caps
        inline-label
        class="bg-primary text-white shadow-2"
        align="justify"
        narrow-indicator
      >
        <q-tab name="my-requests" label="My Requests" icon="outbox" />
        <q-tab name="inbox" label="Inbox" icon="inbox"> </q-tab>

        <q-tab name="archived" label="Archived" icon="archive" />
      </q-tabs>
    </q-footer>
    <q-page-container>
      <q-page>
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="my-requests">
            <div v-for="request in timeOffSummaries" :key="request.id">
              <q-list>
                <q-item class="q-my-md">
                  <q-item-section class="col-grow q-mr-lg">
                    <q-item-label class="text-h6">{{
                      request.createdByUserName
                    }}</q-item-label>
                    <q-item-label>{{ request.toDate }}</q-item-label>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>
                      Hours
                      <span class="text-caption q-pl-xs">{{
                        request.totalHours
                      }}</span>
                    </q-item-label>
                  </q-item-section>

                  <q-item-section style="align-items: end">
                    <q-chip dense>
                      <q-item-label caption class="q-px-sm">{{
                        request.status
                      }}</q-item-label>
                    </q-chip>
                  </q-item-section>
                  <q-item-section side>
                    <q-icon color="primary" name="chevron_right" />
                  </q-item-section>
                  <!-- <q-item-section class="col-12">
                    <q-item-label>{{ request.description }}</q-item-label>
                  </q-item-section> -->
                </q-item>
                <q-separator></q-separator>
              </q-list>
            </div>
          </q-tab-panel>

          <q-tab-panel name="inbox">
            <div v-for="item in timeOffSummaries" :key="item.id">
              <q-list>
                <q-item class="q-my-md">
                  <q-item-section class="col-grow q-mr-lg">
                    <q-item-label class="text-h6">{{
                      item.createdByUserName
                    }}</q-item-label>
                    <q-item-label>{{ item.fromDate }}</q-item-label>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>
                      {{ item.totalHours }}
                      <span class="text-caption q-pl-xs">hrs</span>
                    </q-item-label>
                  </q-item-section>

                  <q-item-section style="align-items: end">
                    <q-chip dense>
                      <q-item-label caption class="q-px-sm">{{
                        item.status
                      }}</q-item-label>
                    </q-chip>
                  </q-item-section>
                  <q-item-section side>
                    <q-icon color="primary" name="chevron_right" />
                  </q-item-section>
                  <!-- <q-item-section class="col-12">
                    <q-item-label>{{ request.description }}</q-item-label>
                  </q-item-section> -->
                </q-item>
                <q-separator></q-separator>
              </q-list>
            </div>
          </q-tab-panel>

          <q-tab-panel name="archived">
            <div v-for="item in timeOffSummaries" :key="item.id">
              <q-list>
                <q-item class="q-my-md">
                  <q-item-section class="col-grow q-mr-lg">
                    <q-item-label class="text-h6">{{
                      item.createdByUserName
                    }}</q-item-label>
                    <q-item-label>{{ item.fromDate }}</q-item-label>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>
                      {{ item.totalHours }}
                    </q-item-label>
                  </q-item-section>

                  <q-item-section style="align-items: end">
                    <q-chip dense>
                      <q-item-label caption class="q-px-sm">{{
                        item.status
                      }}</q-item-label>
                    </q-chip>
                  </q-item-section>
                  <q-item-section side>
                    <q-icon color="primary" name="chevron_right" />
                  </q-item-section>
                  <!-- <q-item-section class="col-12">
                    <q-item-label>{{ request.description }}</q-item-label>
                  </q-item-section> -->
                </q-item>
                <q-separator></q-separator>
              </q-list>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-page>

      <!-- <q-page>
        <div>
          <q-list>
            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label> createdByUserName </q-item-label>
                <q-item-label caption class="text-grey-8">
                  No Specific Date
                </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label> totalHours</q-item-label>
              </q-item-section>
              <q-item-section style="align-items: end">
                <q-chip dense>
                  <q-item-label caption class="q-px-sm"> status</q-item-label>
                </q-chip>
              </q-item-section>
              <q-item-section side>
                <q-icon color="primary" name="chevron_right" />
              </q-item-section>
            </q-item>
            <q-separator></q-separator>
          </q-list>
        </div>

        <q-page-sticky position="bottom-right" :offset="[18, 18]">
          <q-btn fab icon="add" color="accent" padding="md"> </q-btn>
        </q-page-sticky>
      </q-page> -->
    </q-page-container>
  </q-layout>
</template>
<style lang="scss">
@import '../../css/status.scss';
.q-tab__indicator {
  height: 6px !important;
}
</style>
