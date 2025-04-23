<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useTimeOffStore } from '../../stores/timeOff/timeOffStore';
import ConfirmDelete from '../../components/general/ConfirmDelete.vue';
import Drawer from '../../components/drawer.vue';
import { isAllowed } from 'src/helpers/security';
import dateTimeHelper from 'src/helpers/dateTimeHelper';
import WorkFlow from '../../components/general/WorkFlow.vue';
import OC_Loader from 'src/components/general/OC_Loader.vue';

const router = useRouter();
const route = useRoute();
const $q = useQuasar();
const timeOffStore = useTimeOffStore();
const myDrawer = ref();
const loading = ref(true);

const id = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;
const status = route.params.status;
const stageId = Number(route.params.stageId);
const employeeId = route.params.employeeId;
const entityType = 'timeOff';

const timeOffDetailSid = ref('');

const loadTimeOffDetails = async (id: string) => {
  loading.value = true;
  try {
    await timeOffStore.getTimeOffDetails(id);
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      await router.push({ path: '/timeOffSummary' });
    });
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await loadTimeOffDetails(id);
});
const timeOffDetails = computed(() => timeOffStore.TimeOffDetail);

const formattedTimeOffDates = computed(() => {
  if (timeOffDetails.value) {
    if (
      timeOffDetails.value.datesRequested &&
      Array.isArray(timeOffDetails.value.datesRequested) &&
      timeOffDetails.value.datesRequested.length > 0
    ) {
      return timeOffDetails.value.datesRequested
        .map((date) => dateTimeHelper.formatDateForTE(date))
        .join(', ');
    }
    const startDate = timeOffDetails.value.startDate
      ? dateTimeHelper.formatDateForTE(timeOffDetails.value.startDate)
      : '';
    const endDate = timeOffDetails.value.endDate
      ? dateTimeHelper.formatDateForTE(timeOffDetails.value.endDate)
      : '';
    return startDate && endDate ? `${startDate} to ${endDate}` : '';
  }
  return '';
});

const isAllowEdit = computed(() =>
  isAllowed({
    security: { write: timeOffDetails.value?.security?.write },
    isTimeExpense: true,
  })
);

const isAllowDelete = computed(() =>
  isAllowed({
    security: { delete: timeOffDetails.value?.security?.delete },
    isTimeExpense: true,
  })
);

const title = ref('Confirm');
const message = ref('Are you sure you want to delete this timeOff?');
const showDeleteTimeOffDetail = ref(false);

const displayShowDeleteTimeOffDetail = (id: string) => {
  timeOffDetailSid.value = id;
  showDeleteTimeOffDetail.value = true;
};

const cancelConfirmation = () => {
  showDeleteTimeOffDetail.value = false;
};

const deleteTimeOffDetail = async (id: string) => {
  try {
    await timeOffStore.deleteTimeOff(id);
    showDeleteTimeOffDetail.value = false;
    router.go(-1);
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(() => {
      showDeleteTimeOffDetail.value = false;
    });
  }
};

const toggleLeftDrawer = () => {
  if (myDrawer.value) {
    myDrawer.value.toggleLeftDrawer();
  }
};

const getDaysOrHrs = () => {
  if (timeOffDetails.value) {
    if (timeOffDetails.value?.totalHours) {
      return `${timeOffDetails.value?.totalHours}${
        timeOffDetails.value?.totalHours === 1 ? ' hr' : ' hrs'
      }`;
    } else {
      if (timeOffDetails.value?.totalDays === 0.5) {
        return 'half day';
      }
      return `${timeOffDetails.value?.totalDays} ${
        timeOffDetails.value?.totalDays === 1 ? ' day' : ' days'
      }`;
    }
  }
  return '';
};
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn
          @click="router.go(-1)"
          flat
          round
          dense
          color="white"
          icon="arrow_back"
        />
        <q-btn
          aria-label="Menu"
          dense
          flat
          icon="menu"
          round
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title>Time Off Details</q-toolbar-title>
        <q-btn
          v-if="isAllowEdit"
          flat
          round
          dense
          color="white"
          icon="edit"
          :to="{ name: 'editTimeOff', params: { id } }"
        />
        <q-btn
          v-if="isAllowDelete"
          flat
          round
          dense
          color="white"
          icon="delete"
          @click="displayShowDeleteTimeOffDetail(timeOffDetails?.id)"
        />
      </q-toolbar>
    </q-header>
    <Drawer ref="myDrawer" />
    <!-- <q-space class="q-mt-sm" /> -->
    <q-page-container class="q-mb-md"
      ><q-page>
        <OC_Loader :visible="loading" />
        <div>
          <!-- <pre>isAllowEdit:{{ isAllowEdit }}</pre>
        <pre>isAllowDelete::{{ isAllowDelete }}</pre>
        <pre>security::{{ timeOffDetails.security }}</pre> -->
          <div v-if="isAllowEdit && isAllowDelete">
            <WorkFlow
              v-if="status != 'Approved' && status != 'Pending'"
              :entityId="id"
              :employeeId="employeeId"
              :entityType="entityType"
              :stageId="stageId"
            />
          </div>
          <!-- <q-card> -->
          <!-- <q-card-section v-if="status != 'Approved' && status != 'Pending'"> -->
          <!-- <WorkFlow
              entityId="Z4NYNZ9SG8GCHCAD449VNTHFBM9CSESDE8JM6LQ"
              employeeId="JZNC3B9D72FYN8QVFC5Q"
              entityType="timesheet"
              stageId="1"
            /> -->
          <!-- <WorkFlow
              entityId="XCBXHGDCSBBTN89VR66WXDJF3CUYNDJC6JJM6LQ"
              employeeId="W4TCSK9V584Z6EJFJC5Q"
              entityType="timesheet"
              stageId="1"
            /> -->
          <!-- </q-card-section> -->
          <!-- <q-card-section> -->
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label caption>Description:</q-item-label>
                <q-item-label class="text-subtitle1">{{
                  timeOffDetails.description
                }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label caption>Requested Dates:</q-item-label>
                <q-item-label class="text-subtitle1">{{
                  formattedTimeOffDates
                }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label caption
                  >{{
                    timeOffDetails.totalHours
                      ? 'Requested Hours'
                      : 'Requested Days'
                  }}
                </q-item-label>
                <q-item-label class="text-subtitle1">{{
                  getDaysOrHrs()
                }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label caption>Category:</q-item-label>
                <q-item-label class="text-subtitle1">{{
                  timeOffDetails.payroll?.name
                }}</q-item-label>
              </q-item-section></q-item
            >

            <q-item>
              <q-item-section>
                <q-item-label caption>Created By:</q-item-label>
                <q-item-label class="text-subtitle1">{{
                  timeOffDetails.createdByUserName
                }}</q-item-label>
              </q-item-section></q-item
            >
          </q-list>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
  <ConfirmDelete
    v-if="showDeleteTimeOffDetail"
    :showConfirmationDialog="showDeleteTimeOffDetail"
    :title="title"
    :message="message"
    @cancel="cancelConfirmation"
    @confirm="deleteTimeOffDetail(timeOffDetailSid)"
  />
</template>

<style scoped>
/* Add any scoped styles here */
</style>
