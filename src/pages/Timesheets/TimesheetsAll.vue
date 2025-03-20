<script setup lang="ts">
import { ref, computed, watch, capitalize, onMounted } from 'vue';
import { useTimesheetsStore } from '../../stores/timesheet/TimesheetsStore';
import dateTimeHelper from '../../helpers/dateTimeHelper';
import { getExpenseOrTimesheetStatusColor } from 'src/helpers/colorIconHelper';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { isAllowed } from 'src/helpers/security';
import { useTECommentsStore } from 'src/stores/TECommentsStore';
import drawer from '../../components/drawer.vue';

const timesheetStatus = ref('inbox');
const title = ref(capitalize(timesheetStatus.value));
const $q = useQuasar();
const router = useRouter();
const teCommentsStore = useTECommentsStore();
const myDrawer = ref();

const timesheetsStore = useTimesheetsStore();

const loadTimesheets = async (tabValue: string) => {
  $q.loading.show();
  try {
    await teCommentsStore.getTimesheetGroupProfile();
    await timesheetsStore.getTimesheetsByStatus(tabValue);
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      await router.push({ path: '/homePage' });
      router.go(0);
    });
  } finally {
    $q.loading.hide();
  }
};

onMounted(async () => {
  await loadTimesheets(timesheetStatus.value);
});

const timesheetsAll = computed(() => {
  return timesheetsStore.Timesheets;
});
const timesheetDCAA = computed(() => {
  return teCommentsStore.TimesheetDCAA;
});

const errorMsg = computed(() => {
  return timesheetsStore.errorMsg;
});

watch(timesheetStatus, async (newModel) => {
  await loadTimesheets(newModel);
  title.value = capitalize(newModel);
});

const isAllow = isAllowed({ roleAccess: 'TimeExpensesCreateTimeSheet' });
const showWarningMsg = () => {
  alert(
    'Add new time entry is not available in mobile app for Check-in, Check-out mode, please visit the web app to add the new timesheet'
  );
};

function toggleLeftDrawer() {
  if (myDrawer.value == null) return;
  myDrawer.value.toggleLeftDrawer();
}
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar>
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
        <q-toolbar-title>Timesheets ({{ title }})</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <drawer ref="myDrawer" />
    <q-footer elevated>
      <q-tabs
        v-model="timesheetStatus"
        class="bg-primary text-white shadow-2"
        align="justify"
        switch-indicator
        narrow-indicator
        dense
      >
        <q-tab name="inbox" label="Inbox" icon="inbox" />
        <q-tab name="outbox" label="Outbox" icon="outbox" />
        <q-tab name="archived" label="Archived" icon="archive" />
      </q-tabs>
    </q-footer>
    <q-page-container>
      <q-page>
        <div v-if="timesheetsAll">
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
              <q-item-section>
                <q-item-label>
                  {{ item.createdByUserName }}
                </q-item-label>
                <q-item-label caption class="text-grey-8">
                  {{
                    item.fromDate
                      ? dateTimeHelper.formatDateTimeFromRestAPIForUI(
                          item.fromDate,
                          true
                        )
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
        </div>
        <div v-else>
          <div v-if="title === 'Inbox'">
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label v-if="errorMsg !== ''" class="text-h6 q-py-md">
                    {{ errorMsg }}
                  </q-item-label>
                  <q-item-label class="text-h6 q-py-sm">
                    Create your first Timesheet
                  </q-item-label>
                  <q-item-label>
                    A timesheet is used to track employee's time spent on
                    projects and tasks.
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <div v-else>
            <q-list>
              <q-item>
                <q-item-section class="text-h6 q-py-sm">
                  <q-item-label> No Items Found </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
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
