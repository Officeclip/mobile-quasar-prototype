<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useTimeOffStore } from 'src/stores/timeOff/timeOffStore';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import drawer from '../../components/drawer.vue';
import NoItemsMsg from 'src/components/general/noItemsMsg.vue';
import { getExpenseOrTimesheetStatusColor } from 'src/helpers/colorIconHelper';
import OC_Loader from 'src/components/general/OC_Loader.vue';
import toolBar from 'src/components/general/toolBar.vue';

const timeOffStore = useTimeOffStore();
const router = useRouter();
const $q = useQuasar();
const myDrawer = ref();
const loading = ref(true);

const tab = ref(localStorage.getItem('selectedTimeOffTab') || 'inbox'); // Default tab

watch(tab, (newTab) => {
  localStorage.setItem('selectedTimeOffTab', newTab);
});
const title = computed(() =>
  tab.value === 'mylist'
    ? 'My Requests'
    : tab.value === 'inbox'
    ? 'Inbox'
    : 'Archived'
);
const timeOffSummaries = computed(() => timeOffStore.TimeOffSummaries);

// const columns = [
//   {
//     name: 'createdBy',
//     required: true,
//     label: 'Created By',
//     align: 'left' as const,
//     field: 'createdByUserName',
//     sortable: true,
//   },
//   {
//     name: 'dateRange',
//     label: 'Date Range',
//     align: 'left' as const,
//     field: (row) => `${row.fromDate} - ${row.toDate}`,
//     format: (val) => `${val}`,
//     sortable: true,
//   },
//   {
//     name: 'totalHours',
//     label: 'Total Hrs',
//     align: 'left',
//     field: 'totalHours',
//   },
//   {
//     name: 'payrollName',
//     label: 'Payroll Name',
//     align: 'left',
//     field: 'payrollName',
//   },
//   { name: 'status', label: 'Status', align: 'left', field: 'status' },
// ];

const loadTimeOffSummaries = async (tabValue: string) => {
  timeOffStore.resetTimeOffSummaryList(); // Clear previous data
  loading.value = true;
  try {
    await timeOffStore.getTimeOffByCategory(tabValue);
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      await router.push({ path: '/homePage' });
      router.go(0);
    });
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await loadTimeOffSummaries(tab.value);
});

watch(tab, async (newTab) => {
  await loadTimeOffSummaries(newTab);
});

const toggleLeftDrawer = () => {
  if (myDrawer.value == null) return;
  myDrawer.value.toggleLeftDrawer();
  // myDrawer.value = !myDrawer.value;
};

// const viewDetails = (row) => {
//   router.push({
//     path: `/timeOffDetails/${row?.id}/${row?.status}/${row?.stageId}/${row?.employeeId}`,
//   });
// };

const viewDetails = async (
  id: string,
  status: string,
  stageId: number,
  employeeId: string
) => {
  await router.push({
    path: `/timeOffDetails/${id}/${status}/${stageId}/${employeeId}`,
  });
};
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal bordered class="bg-primary text-white" height-hint="98">
      <toolBar
        :title="title"
        :backButton="true"
        :toggleLeftDrawer="toggleLeftDrawer"
        :showLogOutButton="true"
      />

      <!-- <q-toolbar>
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
        <q-toolbar-title>Time Off: {{ title }}</q-toolbar-title>
      </q-toolbar> -->
    </q-header>
    <drawer v-if="myDrawer" />
    <q-footer>
      <q-tabs
        v-model="tab"
        align="justify"
        class="bg-grey-4 text-black"
        switch-indicator
        narrow-indicator
        dense
      >
        <q-tab name="mylist" label="My Requests" icon="outbox" />
        <q-tab name="inbox" label="Inbox" icon="inbox" />
        <q-tab name="archived" label="Archived" icon="archive" />
      </q-tabs>
    </q-footer>
    <q-page-container>
      <div v-if="timeOffSummaries">
        <q-page>
          <OC_Loader :visible="loading" />
          <q-list v-for="item in timeOffSummaries" :key="item.id">
            <q-item
              clickable
              v-ripple
              @click="
                viewDetails(
                  item?.id,
                  item?.status,
                  item?.stageId,
                  item?.employeeId
                )
              "
            >
              <q-item-section class="col-grow q-mr-lg">
                <q-item-label>{{ item.createdByUserName }}</q-item-label>
                <q-item-label caption class="text-grey-8"
                  >{{ item.startDate }} - {{ item.endDate }}</q-item-label
                >
                <q-item-label>
                  <q-icon name="account_balance_wallet" />
                  <span class="q-mx-sm">PayRoll:</span>
                  <span>{{ item.payroll.name }}</span>
                </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label
                  >{{ item.totalHours }}
                  <span class="text-caption q-pl-xs">hrs</span></q-item-label
                >
              </q-item-section>
              <q-item-section style="align-items: end">
                <q-chip
                  dense
                  :class="getExpenseOrTimesheetStatusColor(item?.status)"
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
            <q-separator
              v-if="item !== timeOffSummaries[timeOffSummaries.length - 1]"
            />
          </q-list>
          <!-- <q-table
          :rows="timeOffSummaries"
          :columns="columns"
          row-key="id"
          flat
          bordered
          separator="horizontal"
          rows-per-page-label="Timeoff list"
          :rows-per-page-options="[10, 15, 20]"
        >
          <template v-slot:body="props">
            <q-tr
              :props="props"
              @click="viewDetails(props.row)"
              class="cursor-pointer"
            >
              <q-td key="createdBy" :props="props">
                <q-item-section>
                  <q-item-label class="text-subtitle1">{{
                    props.row.createdByUserName
                  }}</q-item-label>
                </q-item-section>
              </q-td>
              <td key="dateRange" :props="props">
                <q-item-section>
                  {{ props.row.startDate }} - {{ props.row.endDate }}
                </q-item-section>
              </td>
              <td key="totalHours" :props="props">
                <q-item-section>{{ props.row.totalHours }} hrs</q-item-section>
              </td>
              <td key="status" :props="props">
                <q-item-section>
                  <q-chip dense>{{ props.row.status }}</q-chip>
                </q-item-section>
              </td>
            </q-tr>
          </template>
        </q-table> -->
          <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn
              :to="{
                name: 'newTimeOff',
              }"
              fab
              icon="add"
              color="accent"
              padding="md"
            >
            </q-btn>
          </q-page-sticky>
        </q-page>
      </div>
      <div v-else>
        <NoItemsMsg />
      </div>
    </q-page-container>
  </q-layout>
</template>
<style scopped lang="scss">
@import '../../css/status.scss';
</style>
