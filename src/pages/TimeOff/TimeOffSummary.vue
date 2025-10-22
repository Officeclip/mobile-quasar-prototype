<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useTimeOffStore } from 'src/stores/timeOff/timeOffStore';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
// import drawer from '../../components/drawer.vue';
import oc_drawer from 'src/components/oc_drawer.vue';
import NoItemsMsg from 'src/components/general/noItemsMsg.vue';
import OC_Header from 'src/components/OCcomponents/OC_Header.vue';
import { getExpenseOrTimesheetStatusColor } from 'src/helpers/colorIconHelper';
import OC_Loader from 'src/components/general/OC_Loader.vue';
import dateTimeHelper from 'src/helpers/dateTimeHelper';
import { isAllowed } from 'src/helpers/security';

const timeOffStore = useTimeOffStore();
const router = useRouter();
const $q = useQuasar();
const myDrawer = ref();
const loading = ref(true);

const tab = ref(timeOffStore.selectedTab);
watch(tab, (newTab) => {
  timeOffStore.selectedTab = newTab;
});
const title = computed(() =>
  tab.value === 'mylist'
    ? 'My Requests'
    : tab.value === 'inbox'
      ? 'Inbox'
      : 'Archived',
);
const timeOffSummaries = computed(() => timeOffStore.TimeOffSummaries);

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
};

const viewDetails = async (
  id: string,
  status: string,
  stageId: number,
  employeeId: string,
) => {
  await router.push({
    path: `/timeOffDetails/${id}/${status}/${stageId}/${employeeId}`,
  });
};

const formattedTimeOffDates = (item: any) => {
  if (item) {
    if (
      item.datesRequested &&
      Array.isArray(item.datesRequested) &&
      item.datesRequested.length > 0
    ) {
      return item.datesRequested
        .map((date: string) => dateTimeHelper.formatDateForTE(date))
        .join(', ');
    }
    const startDate = item.startDate
      ? dateTimeHelper.formatDateForTE(item.startDate)
      : '';
    const endDate = item.endDate
      ? dateTimeHelper.formatDateForTE(item.endDate)
      : '';
    if (startDate && endDate) {
      return startDate === endDate ? startDate : `${startDate} to ${endDate}`;
    }
    return '';
  }
  return '';
};

const getDaysOrHrs = (item: any) => {
  if (item) {
    if (item.totalHours) {
      return `<span style="font-size: 1.2em;">${item.totalHours}</span> ${
        item.totalHours === 1 ? 'hr' : 'hrs'
      }`;
    }
    if (item.totalDays) {
      if (item.totalDays === 0.5) {
        return 'half day';
      }
      return `<span style="font-size: 1.2em;">${item.totalDays}</span> ${
        item.totalDays === 1 ? 'day' : 'days'
      }`;
    }
    return '';
  }
  return '';
};

const isAllow = isAllowed({ roleAccess: 'CreateTimeOff' });
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <OC_Header
      :title="'Time Off: ' + title"
      back-button-to="/homepage"
      :show-menu-button="true"
      @toggle-drawer="toggleLeftDrawer"
    />
    <oc_drawer ref="myDrawer" />
    <q-footer bordered class="bg-grey-3">
      <q-tabs
        v-model="tab"
        active-color="primary"
        align="justify"
        dense
        class="text-grey-8"
        indicator-color="transparent"
      >
        <q-tab name="mylist" label="My Requests" icon="outbox" />
        <q-tab name="inbox" label="Inbox" icon="inbox" />
        <q-tab name="archived" label="Archived" icon="archive" />
      </q-tabs>
    </q-footer>
    <q-page-container>
      <q-page>
        <div v-if="timeOffSummaries">
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
                  item?.employeeId,
                )
              "
            >
              <q-item-section>
                <q-item-label>{{ item.createdByUserName }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  {{ formattedTimeOffDates(item) }}
                </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label class="q-ml-sm flex items-center">
                  <!-- <q-icon :name="iconName" /> -->
                  <q-icon
                    :name="item?.totalHours ? 'access_time' : 'calendar_today'"
                  />
                  <div class="q-ml-xs" v-html="getDaysOrHrs(item)"></div>
                </q-item-label>
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
        </div>
        <div v-else>
          <NoItemsMsg />
        </div>
        <q-page-sticky
          v-if="isAllow"
          position="bottom-right"
          :offset="[18, 18]"
        >
          <q-btn
            :to="{
              name: 'newTimeOff',
            }"
            fab-mini
            icon="add"
            color="accent"
          >
          </q-btn>
        </q-page-sticky>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<style scopped lang="scss">
@import '../../css/status.scss';

.text-captionm {
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.25rem;
  letter-spacing: 0.03333em;
  color: #616161 !important;
}
</style>
