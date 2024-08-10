<!-- cleaned up with google bard with minor correction -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useTimesheetsStore } from '../../stores/timesheet/TimesheetsStore';
import { useTECommentsStore } from '../../stores/TECommentsStore';
import { useTimesheetListStore } from '../../stores/timesheet/TimesheetListStore';
import { useRoute, useRouter } from 'vue-router';
import OCItem from '../../components/OCcomponents/OC-Item.vue';
import ConfirmDelete from '../../components/general/ConfirmDelete.vue';
import WorkFlow from '../../components/general/WorkFlow.vue';
import { isAllowed } from 'src/helpers/security';
import { useQuasar } from 'quasar';
import logger from 'src/helpers/logger';
import dateTimeHelper from 'src/helpers/dateTimeHelper';

const router = useRouter();
const route = useRoute();
const timesheetsStore = useTimesheetsStore();
const timesheetCommentsStore = useTECommentsStore();
const timesheetListsStore = useTimesheetListStore();
const $q = useQuasar();

const id = route.params.id;
const employeeId = route.params.employeeId;
const entityType = 'timesheet';
const timesheetDetailSid = ref('');
const fromDate = route.params.fromDate;
// const toDate = route.params.toDate;
const toDate = route.params.toDate;
const stageId = Number(route.params.stageId);
const status = route.params.status;
const mode = route.params.mode;

const isLoaded = ref<boolean>(false);
const isAllowedWrite = ref();
const isAllowedDelete = ref();

onMounted(async () => {
  try {
    await timesheetsStore.getTimesheetDetails(id, stageId);
    await timesheetCommentsStore.$reset();
    await timesheetCommentsStore.getTimesheetComments(id);
    await timesheetListsStore.getTimesheetListAll();
  } catch (error) {
    logger.log(`*** timesheetDetails:error:catch(${error}) ***`, 'error');
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      logger.log('*** timesheetDetails:onMounted:onOk ***');
      await router.push({ path: '/timesheetsAll' });
    });
  } finally {
    isLoaded.value = true;
  }

  isAllowedWrite.value = isAllowed({
    security: {
      write: timesheetDetails?.value[0].security.write,
    },
    isTimeExpense: true,
  });
  isAllowedDelete.value = isAllowed({
    security: {
      delete: timesheetDetails?.value[0].security.delete,
    },
    isTimeExpense: true,
  });
});

const timesheetDetails = computed(() => {
  return timesheetsStore.TimesheetDetails;
});

const title = ref('Confirm');
const message = ref('Are you sure you want to delete this timesheet?');

const showDeleteTimesheetDetail = ref(false);
const displayShowDeleteTimesheetDetail = (id: string) => {
  timesheetDetailSid.value = id;
  showDeleteTimesheetDetail.value = true;
};

const showDeleteTimesheet = ref(false);
const displayConfirmationDialog = () => {
  showDeleteTimesheet.value = true;
};
const cancelConfirmation = () => {
  showDeleteTimesheet.value = false;
  showDeleteTimesheetDetail.value = false;
};

const deleteTimesheet = async (id: string) => {
  try {
    await timesheetsStore.deleteAllTimesheets(id);
    showDeleteTimesheet.value = false;
    router.go(-1);
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      console.log('*** Delete timesheet:onSubmit(...):onOK ***');
      showDeleteTimesheet.value = false;
    });
  }
};

const deleteTimesheetDetail = async (id: string) => {
  try {
    await timesheetsStore.deleteTimesheet(id);
    showDeleteTimesheetDetail.value = false;
    router.go(-1);
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      console.log('*** Delete timesheetDetail:onSubmit(...):onOK ***');
      showDeleteTimesheetDetail.value = false;
    });
  }
};
const commentsList = computed(() => {
  return timesheetCommentsStore.commentsList;
});
const listLength = computed(() => {
  return commentsList.value.length;
});

const periodOptions = computed(() => {
  return timesheetListsStore.PeriodList;
});

const timesheetPeriod = computed(() => {
  return periodOptions.value?.find((x) => x.start.toString() === fromDate);
});
const generateTimesheetPeriod = computed(() => {
  const formattedDt = `${dateTimeHelper.formatDateForTE(
    fromDate
  )} - ${dateTimeHelper.formatDateForTE(toDate)}`;
  return formattedDt;
});
const showWarningMsg = () => {
  alert(
    'Add new timesheet details entry is not available in mobile app for Check-in, Check-out mode,please visit the web app to add the new timesheet details'
  );
};
</script>

<template>
  <q-layout view="lHh Lpr lFf" v-if="isLoaded">
    <q-header reveal bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn
          @click="$router.go(-1)"
          flat
          round
          dense
          color="white"
          icon="arrow_back"
        >
        </q-btn>
        <q-toolbar-title> Details </q-toolbar-title>
        <q-btn
          v-if="isAllowedDelete"
          flat
          round
          dense
          color="white"
          icon="delete"
          @click="displayConfirmationDialog"
        >
        </q-btn>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <div>
        <WorkFlow
          v-if="status != 'Approved' && status != 'Pending'"
          :entityId="id"
          :employeeId="employeeId"
          :entityType="entityType"
          :stageId="stageId"
        />
      </div>
      <pre>{{ generateTimesheetPeriod }}</pre>
      <pre>{{ timesheetPeriod?.name }}</pre>
      <q-card
        v-for="timesheetDetail in timesheetDetails"
        :key="timesheetDetail.id"
        class="q-ma-sm bg-grey-2"
      >
        <q-expansion-item
          default-opened
          expand-separator
          expand-icon-class="text-primary"
        >
          <template v-slot:header>
            <q-item-section>
              <q-item-label caption>
                {{ timesheetDetail.accountName }}
              </q-item-label>
              <q-item-label>
                {{
                  timesheetDetail.taskDate
                    ? timesheetDetail.taskDate
                    : 'No Specific Date'
                }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              {{ timesheetDetail.timeDuration }} hrs
            </q-item-section>
            <q-item-section side>
              <q-btn
                v-if="isAllowedWrite && mode === 'PERIODIC'"
                :to="{
                  name: 'editTimesheet',
                  params: {
                    id: timesheetDetail?.id,
                    fromDate: fromDate,
                  },
                }"
                size="sm"
                flat
                round
                dense
                icon="edit"
              >
              </q-btn>
            </q-item-section>
            <q-item-section side>
              <q-btn
                v-if="isAllowedDelete"
                @click="displayShowDeleteTimesheetDetail(timesheetDetail?.id)"
                size="sm"
                flat
                round
                dense
                icon="delete"
                class="q-btn-hover:hover"
              ></q-btn>
            </q-item-section>
          </template>
          <OCItem
            v-if="timesheetDetail?.projectName"
            title="Project"
            :value="timesheetDetail.projectName"
          />
          <OCItem
            v-if="timesheetDetail?.serviceItemName"
            title="Task"
            :value="timesheetDetail.serviceItemName"
          />
          <OCItem
            title="Billable"
            :value="timesheetDetail.isBillable ? 'Yes' : 'No'"
          />
          <OCItem
            v-if="timesheetDetail?.description"
            title="Description"
            :value="timesheetDetail.description"
          />
        </q-expansion-item>
      </q-card>
      <q-card v-if="timesheetDetails.length > 0" class="q-ma-sm bg-grey-4">
        <q-expansion-item
          default-opened
          expand-separator
          expand-icon-class="text-primary"
        >
          <template v-slot:header>
            <q-item-section>
              <q-item-label>Comments: </q-item-label>
            </q-item-section>
          </template>
          <q-list>
            <q-item v-for="comments in commentsList" :key="comments.id">
              <q-item-section style="white-space: pre-wrap"
                >{{ comments.text_comment }}
              </q-item-section>
              <q-item-section style="white-space: pre-wrap">
                by {{ comments.commentedUserName }} on
                {{ comments.commentedDate.split('T')[0] }}
              </q-item-section>
            </q-item>
            <q-item v-if="listLength === 0"> No Comments are present </q-item>
          </q-list>
        </q-expansion-item>
      </q-card>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn
          v-if="isAllowedWrite && mode === 'PERIODIC'"
          :to="{
            name: 'newTimesheet',
            params: {
              periodName: timesheetPeriod?.name,
              timesheetSid: timesheetDetails[0]?.timesheetSid,
            },
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
    </q-page-container>
  </q-layout>

  <ConfirmDelete
    v-if="showDeleteTimesheet"
    :showConfirmationDialog="showDeleteTimesheet"
    :id="id"
    :title="title"
    :message="message"
    @cancel="cancelConfirmation"
    @confirm="deleteTimesheet"
  />
  <ConfirmDelete
    v-if="showDeleteTimesheetDetail"
    :showConfirmationDialog="showDeleteTimesheetDetail"
    :id="timesheetDetailSid"
    :title="title"
    :message="message"
    @cancel="cancelConfirmation"
    @confirm="deleteTimesheetDetail"
  />
</template>

<style scoped>
.q-btn:hover {
  background-color: #333;
  /* Change the background color on hover */
  color: #fff;
  /* Change the text color on hover */
}

.btn-Comment {
  border: 1px solid rgb(15, 86, 110);
  /* Change the text color on hover */
}
</style>
