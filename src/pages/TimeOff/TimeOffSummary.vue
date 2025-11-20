<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useTimeOffStore } from 'src/stores/timeOff/timeOffStore';
import { useRouter } from 'vue-router';
import { QInfiniteScroll, useQuasar } from 'quasar';
import OC_Drawer from 'src/components/OC_Drawer.vue';
import OC_Header from 'src/components/OCcomponents/OC_Header.vue';
import OC_Footer from 'src/components/OCcomponents/OC_Footer.vue';
import { getExpenseOrTimesheetStatusColor } from 'src/helpers/colorIconHelper';
import OC_Loader from 'src/components/general/OC_Loader.vue';
import dateTimeHelper from 'src/helpers/dateTimeHelper';
import { isAllowed } from 'src/helpers/security';
import { storeToRefs } from 'pinia';

const timeOffStore = useTimeOffStore();
const router = useRouter();
const $q = useQuasar();
const myDrawer = ref();
const loading = ref(false); // <-- Change this from 'true' to 'false'
let reachedEnd = ref(false);
const infiniteScrollRef = ref<QInfiniteScroll | null>(null);

const tab = ref(timeOffStore.selectedTab);
const title = computed(() =>
  tab.value === 'mylist'
    ? 'My Requests'
    : tab.value === 'inbox'
      ? 'Inbox'
      : 'Archived',
);

const footerTabs = [
  { name: 'mylist', label: 'My Requests', icon: 'outbox' },
  { name: 'inbox', label: 'Inbox', icon: 'inbox' },
  { name: 'archived', label: 'Archived', icon: 'archive' },
];

const timeOffSummaries = computed(() => timeOffStore.TimeOffSummaries);
const errorMsg = storeToRefs(timeOffStore).errorMsg;

const loadMore = async (index: number, done: () => void) => {
  loading.value = true;
  try {
    reachedEnd.value = await timeOffStore.fetchMoreTimeOffSummaries(tab.value);
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
watch(tab, async (newTab) => {
  timeOffStore.selectedTab = newTab;
  await timeOffStore.resetTimeOffSummaryList(); // Clear previous data
  reachedEnd.value = false; // Reset the q-infinite-scroll and EXPLICITLY trigger a new load.
  if (infiniteScrollRef.value) {
    infiniteScrollRef.value.reset();
  }
  infiniteScrollRef.value?.trigger(); // Now that the component is mounted and the list is empty, explicitly trigger the infinite scroll to fetch the first page.
});

onMounted(async () => {
  await timeOffStore.resetTimeOffSummaryList();
  await nextTick();
  if (infiniteScrollRef.value) {
    infiniteScrollRef.value.trigger();
  }
});

const isAllow = isAllowed({ roleAccess: 'CreateTimeOff' });

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
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <OC_Header
      :title="'Time Off: ' + title"
      back-button-to="/homepage"
      :show-menu-button="true"
      @toggle-drawer="toggleLeftDrawer"
    />
    <OC_Drawer ref="myDrawer" />
    <OC_Footer :tabs="footerTabs" v-model:tab="tab" />
    <q-page-container>
      <q-page>
        <div
          v-if="errorMsg !== ''"
          class="items-center column"
          style="
            position: absolute;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            z-index: 10;
          "
        >
          <q-icon name="error_outline" size="100px" color="grey-5" />
          <div class="text-h6 q-mt-sm q-py-md">{{ errorMsg }}</div>
          <div v-if="title === 'My Requests'" class="text-center">
            <div class="text-body1 text-grey-7">
              A time off request is used to track employee's leave and time off
              from work.
            </div>
          </div>
        </div>

        <OC_Loader :visible="loading" />
        <q-infinite-scroll
          ref="infiniteScrollRef"
          :disable="reachedEnd"
          @load="loadMore"
        >
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
          <template v-slot:loading>
            <q-spinner-dots color="primary" size="40px"></q-spinner-dots>
          </template>
        </q-infinite-scroll>
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
</style>
