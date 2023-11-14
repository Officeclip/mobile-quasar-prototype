<!-- cleaned up with google bard with minor correction -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useTimesheetsStore } from '../../stores/timesheet/TimesheetsStore';
import { useRoute, useRouter } from 'vue-router';
import dateTimeHelper from '../../helpers/dateTimeHelper';
import OCItem from '../../components/OCcomponents/OC-Item.vue';

const router = useRouter();
const route = useRoute();
const id = route.params.id;
const fromDate = route.params.fromDate;
// made the readOnly params type as boolean, by default always coming as string only
const readOnly = route.params.readOnly === 'true';
const timesheetsStore = useTimesheetsStore();

onMounted(() => {
  // const route = useRoute();
  console.log('id=', route.params.id);
  timesheetsStore.getTimesheetDetails(id);
});

const timesheetDetails = computed(() => {
  return timesheetsStore.TimesheetDetails;
});

const showConfirmationDialog = ref(false);
function displayConfirmationDialog() {
  showConfirmationDialog.value = true;
}
function confirmDelete() {
  timesheetsStore.deleteAllTimesheets(id).then(() => {
    showConfirmationDialog.value = false;
    router.go(-1);
  });
}

const workFlowModel = ref('Sk Dutta');
const workFlowOptions = [
  'Sk Dutta',
  'Rao Narsimha',
  'Sudhakar Gundu',
  'Nagesh Kulkarni',
];
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
      <div class="row items-center justify-center q-my-md">
        <q-item-label caption class="q-mr-md"> Submit To: </q-item-label>
        <q-select
          style="min-width: 200px"
          outlined
          dense
          v-model="workFlowModel"
          :options="workFlowOptions"
          map-options
          emit-value
        />
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
                  timesheetsStore.deleteTimesheet(
                    timesheetDetail?.timesheetDetailSid
                  );
                  $router.go(-1);
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

  <q-dialog v-model="showConfirmationDialog">
    <q-card>
      <q-card-section>
        <q-item-label>Confirm</q-item-label>
        <q-item-label>Are you sure you want to delete this event?</q-item-label>
        <q-card-actions align="right">
          <q-btn
            no-caps
            dense
            color="primary"
            label="Cancel"
            @click="showConfirmationDialog = false"
          />
          <q-btn
            no-caps
            dense
            color="negative"
            label="Delete"
            @click="confirmDelete"
          />
        </q-card-actions>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.q-btn:hover {
  background-color: #333; /* Change the background color on hover */
  color: #fff; /* Change the text color on hover */
}
</style>
