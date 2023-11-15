<!-- cleaned up with google bard with minor correction -->
<script setup lang="ts">
import { ref, Ref, computed, onMounted } from 'vue';
import { useTimesheetsStore } from '../../stores/timesheet/TimesheetsStore';
import { useRoute, useRouter } from 'vue-router';
import dateTimeHelper from '../../helpers/dateTimeHelper';
import OCItem from '../../components/OCcomponents/OC-Item.vue';
import ConfirmDelete from '../../components/general/ConfirmDelete.vue';
import WorkFlow from '../../components/general/WorkFlow.vue';

const router = useRouter();
const route = useRoute();
const id = route.params.id;
const timesheetDetailSid = ref('');
// newId.value = id;
const fromDate = route.params.fromDate;
// made the readOnly params type as boolean, by default always coming as string only
const readOnly = route.params.readOnly === 'true';
const timesheetsStore = useTimesheetsStore();

onMounted(() => {
  timesheetsStore.getTimesheetDetails(id);
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
const deleteTimesheet = (id: string) => {
  {
    timesheetsStore.deleteAllTimesheets(id).then(() => {
      showDeleteTimesheet.value = false;
      router.go(-1);
    });
  }
};
const deleteTimesheetDetail = (id: string) => {
  {
    timesheetsStore.deleteTimesheet(id).then(() => {
      showDeleteTimesheetDetail.value = false;
      router.go(-1);
    });
  }
};
</script>

<template>
  <q-layout view="lHh Lpr lFf">
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
        <WorkFlow />
      </div>
      <q-card
        v-for="timesheetDetail in timesheetDetails"
        :key="timesheetDetail.id"
        class="q-ma-sm bg-grey-3"
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
                  timesheetDetail.createdDate
                    ? dateTimeHelper.extractDateFromUtc(
                        timesheetDetail.createdDate
                      )
                    : 'No Specific Date'
                }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              {{ timesheetDetail.timeDuration }} hrs
            </q-item-section>
            <q-item-section side>
              <q-btn
                v-if="!readOnly"
                :to="{
                  name: 'editTimesheet',
                  params: {
                    id: timesheetDetail?.timesheetDetailSid,
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
                @click="
                  displayShowDeleteTimesheetDetail(
                    timesheetDetail?.timesheetDetailSid
                  )
                "
                size="sm"
                flat
                round
                dense
                icon="delete"
                class="q-btn-hover:hover"
              ></q-btn>
            </q-item-section>
          </template>
          <OCItem title="Project" :value="timesheetDetail.projectName" />
          <OCItem title="Task" :value="timesheetDetail.serviceItemName" />
          <OCItem
            title="Billable"
            :value="timesheetDetail.isBillable ? 'Yes' : 'No'"
          />
          <OCItem title="Description" :value="timesheetDetail.description" />
        </q-expansion-item>
      </q-card>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn
          :to="{
            name: 'newTimesheetPeriod',
          }"
          fab
          icon="add"
          color="accent"
          padding="sm"
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
  background-color: #333; /* Change the background color on hover */
  color: #fff; /* Change the text color on hover */
}
</style>
