<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useTimeOffStore } from 'src/stores/timeOff/timeOffStore';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import drawer from '../../components/drawer.vue';

const timeOffStore = useTimeOffStore();
const router = useRouter();
const $q = useQuasar();
const myDrawer = ref();
const isLoading = ref<boolean>(true);

const tab = ref('mylist'); // Default tab
const title = computed(() =>
  tab.value === 'mylist'
    ? 'My Requests'
    : tab.value === 'inbox'
    ? 'Inbox'
    : 'Archived'
);
const timeOffSummaries = computed(() => timeOffStore.TimeOffSummaries);

const columns = [
  {
    name: 'createdBy',
    required: true,
    label: 'Created By',
    align: 'left' as const,
    field: 'createdByUserName',
    sortable: true,
  },
  {
    name: 'dateRange',
    label: 'Date Range',
    align: 'left' as const,
    field: (row) => `${row.fromDate} - ${row.toDate}`,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'totalHours',
    label: 'Total Hrs',
    align: 'left',
    field: 'totalHours',
  },
  // {
  //   name: 'payrollName',
  //   label: 'Payroll Name',
  //   align: 'left',
  //   field: 'payrollName',
  // },
  { name: 'status', label: 'Status', align: 'left', field: 'status' },
];

const loadTimeOffSummaries = async (tabValue: string) => {
  timeOffStore.resetTimeOffSummaryList(); // Clear previous data
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
    isLoading.value = false;
  }
};

onMounted(async () => {
  await loadTimeOffSummaries(tab.value);
});

const handleTabClick = (tabValue: string) => {
  tab.value = tabValue;
  loadTimeOffSummaries(tabValue);
};

const toggleLeftDrawer = () => {
  if (myDrawer.value == null) return;
  myDrawer.value.toggleLeftDrawer();
};

const viewDetails = (row) => {
  // router.push({ path: `/timeOffDetails/${row.id}` });
  // alert(`View details clicked${row.id}`);
  router.push({
    path: `/timeOffDetails/${row.id}/${row.status}/${row.stageId}/${row.employeeId}`,
  });
};
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
        <q-toolbar-title>Time Off: {{ title }}</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <drawer ref="myDrawer" />
    <q-page-container>
      <q-page v-if="isLoading" class="flex flex-center text-center">
        <div>
          <q-spinner color="primary" size="3em" />
          <p class="q-mt-md q-ml-sm">Loading data...</p>
        </div></q-page
      >
      <q-page v-else>
        <q-tabs
          v-model="tab"
          @update:model-value="handleTabClick"
          no-caps
          inline-label
          align="justify"
          active-color="primary"
          class="bg-grey-4"
        >
          <q-tab name="mylist" label="My Requests" icon="outbox" />
          <q-tab name="inbox" label="Inbox" icon="inbox" />
          <q-tab name="archived" label="Archived" icon="archive" />
        </q-tabs>
        <q-table
          :rows="timeOffSummaries"
          :columns="columns"
          row-key="id"
          flat
          bordered
          separator="horizontal"
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
              <!-- <td key="payrollName" :props="props">
                <q-item-section>{{ props.row.payrollName }}</q-item-section>
              </td> -->
              <td key="status" :props="props">
                <q-item-section>
                  <q-chip dense>{{ props.row.status }}</q-chip>
                </q-item-section>
              </td>
            </q-tr>
          </template>
        </q-table>
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
    </q-page-container>
  </q-layout>
</template>
