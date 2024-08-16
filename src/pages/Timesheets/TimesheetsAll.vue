<script setup lang="ts">
import { ref, computed, onBeforeMount, watch, capitalize } from 'vue';
import { useTimesheetsStore } from '../../stores/timesheet/TimesheetsStore';
import dateTimeHelper from '../../helpers/dateTimeHelper';
import { getExpenseOrTimesheetStatusColor } from 'src/helpers/colorIconHelper';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { isAllowed } from 'src/helpers/security';
import { useTECommentsStore } from 'src/stores/TECommentsStore';
import logger from 'src/helpers/logger';
import drawer from '../../components/drawer.vue';

const timesheetStatus = ref('inbox');
const title = ref(capitalize(timesheetStatus.value));
const $q = useQuasar();
const router = useRouter();
const teCommentsStore = useTECommentsStore();
const myDrawer = ref();

const timesheetsStore = useTimesheetsStore();
onBeforeMount(async () => {
  try {
    await teCommentsStore.getTimesheetGroupProfile();
    await timesheetsStore.getTimesheetsByStatus(String(timesheetStatus.value));
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      logger.log('onBeforeMount OK button pressed');
      await router.push({ path: '/homePage' });
      router.go(0);
    });
  }
});

const timesheetsAll = computed(() => {
  return timesheetsStore.Timesheets;
});
const timesheetDCAA = computed(() => {
  return teCommentsStore.TimesheetDCAA;
});

const isAllow = isAllowed({ roleAccess: 'TimeExpensesCreateTimeSheet' });
const showWarningMsg = () => {
  alert(
    'Add new time entry is not available in mobile app for Check-in, Check-out mode, please visit the web app to add the new timesheet'
  );
};

watch([timesheetStatus], ([newModel]) => {
  timesheetsStore.getTimesheetsByStatus(String(newModel));
  title.value = capitalize(newModel);
});
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
          @click="$router.push({ path: '/homepage' })"
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
        <q-toolbar-title>{{ title }} Timesheets </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <drawer ref="myDrawer" />
    <q-footer elevated>
      <q-tabs
        v-model="timesheetStatus"
        no-caps
        inline-label
        class="bg-primary text-white shadow-2"
        align="justify"
      >
        <q-tab name="inbox" label="Inbox" icon="inbox"> </q-tab>
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
                  isWrite: item.security.write,
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
                      ? dateTimeHelper.extractDateFromUtc(item.fromDate)
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
          <q-list class="flex flex-center">
            <q-item>
              <q-item-section>
                <q-item-label class="text-h6 q-py-md">
                  Create your first Timesheet
                </q-item-label>
                <q-item-label>
                  A timesheet is used to track employee's time spent on projects
                  and tasks.
                </q-item-label>
              </q-item-section>
            </q-item></q-list
          >
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
            padding="sm"
          >
          </q-btn>
          <q-btn
            v-else
            fab
            icon="add"
            color="accent"
            padding="sm"
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
</style>
