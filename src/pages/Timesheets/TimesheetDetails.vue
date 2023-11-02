<!-- cleaned up with google bard with minor correction -->
<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useTimesheetsStore } from '../../stores/timesheet/TimesheetsStore';
import { useRoute } from 'vue-router';
import dateTimeHelper from '../../helpers/dateTimeHelper';
import OCItem from '../../components/OCcomponents/OC-Item.vue';

const route = useRoute();
const id = route.params.id;
const fromDate = route.params.fromDate;
const timesheetsStore = useTimesheetsStore();

onMounted(() => {
  // const route = useRoute();
  console.log('id=', route.params.id);
  timesheetsStore.getTimesheetDetails(Number(id));
});

const timesheetDetails = computed(() => {
  return timesheetsStore.TimesheetDetails;
});
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
        <q-toolbar-title> Timesheet details </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-list
        v-for="timesheetDetail in timesheetDetails"
        :key="timesheetDetail.id"
        class="q-mt-sm bg-grey-3"
      >
        <q-expansion-item expand-separator expand-icon-class="text-primary">
          <template v-slot:header>
            <q-item-section>
              <q-item-label>
                {{ timesheetDetail.accountName }}
              </q-item-label>
              <q-item-label caption>
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
                  timesheetsStore.deleteTimesheet(timesheetDetail?.id);
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
      </q-list>
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
</template>

<style scoped>
.q-btn:hover {
  background-color: #333; /* Change the background color on hover */
  color: #fff; /* Change the text color on hover */
}
</style>
