<!-- cleaned up with google bard with minor correction -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useTimesheetsStore } from '../../stores/timesheet/TimesheetsStore';
import { useTECommentsStore } from '../../stores/TECommentsStore';
import { useRoute, useRouter } from 'vue-router';
import OCItem from '../../components/OCcomponents/OC-Item.vue';
import ConfirmDelete from '../../components/general/ConfirmDelete.vue';
import WorkFlow from '../../components/general/WorkFlow.vue';
import { isAllowed } from 'src/helpers/security';
import { useQuasar } from 'quasar';
// import drawer from '../../components/drawer.vue';
import OC_Drawer from 'src/components/OC_Drawer.vue';
import OC_Loader from 'src/components/general/OC_Loader.vue';
import OC_Header from 'src/components/OCcomponents/OC_Header.vue';

const router = useRouter();
const route = useRoute();
const timesheetsStore = useTimesheetsStore();
const teCommentsStore = useTECommentsStore();
const $q = useQuasar();
const myDrawer = ref();
const loading = ref(true);

const id = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;
const employeeId = route.params.employeeId;
const entityType = 'timesheet';
const timesheetDetailSid = ref('');
const fromDate = route.params.fromDate;
const toDate = route.params.toDate;
const stageId = Number(route.params.stageId);
const status = route.params.status;
const mode = route.params.mode;

const loadTimesheetDetails = async (id: string, stageId: number) => {
  loading.value = true;
  try {
    await timesheetsStore.getTimesheetDetails(id, stageId);
    teCommentsStore.$reset();
    await teCommentsStore.getTimesheetComments(id);
    await teCommentsStore.getTimesheetGroupProfile();
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      await router.push({ path: '/timesheetsAll' });
    });
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await loadTimesheetDetails(id, stageId);
});

const timesheetDetails = computed(() => {
  return timesheetsStore.TimesheetDetails;
});

const isAllowDelete = computed(() => {
  const details = timesheetDetails?.value[0];
  return isAllowed({
    security: { delete: details?.security?.delete },
    isTimeExpense: true,
  });
});
const isAllowEdit = computed(() => {
  const details = timesheetDetails?.value[0];
  return isAllowed({
    security: { write: details?.security?.write },
    isTimeExpense: true,
  });
});

//getting the dcaa data from timesheet group profile
const timesheetDCAA = computed(() => {
  return teCommentsStore.DCAA;
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
      showDeleteTimesheet.value = false;
    });
  }
};

const deleteTimesheetDetail = async (id: string) => {
  loading.value = true;
  try {
    await timesheetsStore.deleteTimesheet(id);
    showDeleteTimesheetDetail.value = false;
    router.go(-1);
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      showDeleteTimesheetDetail.value = false;
    });
  } finally {
    loading.value = false;
  }
};
const commentsList = computed(() => {
  return teCommentsStore.commentsList;
});
const listLength = computed(() => {
  return commentsList.value.length;
});
const showWarningMsg = () => {
  alert(
    'Add new timesheet details entry is not available in mobile app for Check-in, Check-out mode,please visit the web app to add the new timesheet details',
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
      title="Details"
      back-button-to="/timesheetsAll"
      :show-menu-button="true"
      @toggle-drawer="toggleLeftDrawer"
      :show-delete-button="isAllowDelete"
      @delete="displayConfirmationDialog"
    >
      <!-- <template #right-actions>
        <q-btn
          v-if="isAllowDelete"
          flat
          round
          dense
          color="white"
          icon="delete"
          @click="displayConfirmationDialog"
        >
        </q-btn>
      </template> -->
    </OC_Header>
    <OC_Drawer ref="myDrawer" />
    <q-page-container>
      <q-page>
        <OC_Loader :visible="loading" />
        <div>
          <WorkFlow
            v-if="status != 'Approved' && status != 'Pending'"
            :entityId="id"
            :employeeId="employeeId"
            :entityType="entityType"
            :stageId="stageId"
            :groupProfileInfo="timesheetDCAA"
          />
        </div>
        <q-card
          v-for="timesheetDetail in timesheetDetails"
          :key="timesheetDetail.id"
          class="q-ma-sm"
        >
          <q-expansion-item expand-separator expand-icon-class="text-primary">
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
                  v-if="isAllowEdit && mode === 'PERIODIC'"
                  :to="{
                    name: 'editTimesheet',
                    params: {
                      id: timesheetDetail?.id,
                      fromDate: fromDate,
                      toDate: toDate,
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
                  v-if="isAllowDelete"
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
        <q-card
          flat
          bordered
          v-if="timesheetDetails.length > 0"
          class="q-ma-sm"
        >
          <q-expansion-item expand-separator expand-icon-class="text-primary">
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
        <q-page-sticky
          position="bottom-right"
          :offset="[18, 18]"
          style="z-index: 1000"
        >
          <q-btn
            v-if="isAllowEdit && mode === 'PERIODIC'"
            :to="{
              name: 'newTimesheet',
              params: {
                timesheetSid: timesheetDetails[0]?.timesheetSid,
                fromDate: fromDate,
                toDate: toDate,
              },
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
          </q-btn> </q-page-sticky
      ></q-page>
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
