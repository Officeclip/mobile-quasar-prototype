<!-- cleaned up with google bard with minor correction -->
<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useTimesheetsStore } from '../../stores/TimesheetsStore';
import { useRoute } from 'vue-router';
import dateTimeHelper from '../../helpers/dateTimeHelper';

const timesheetsStore = useTimesheetsStore();

onMounted(() => {
  const route = useRoute();
  console.log('id=', route.params.id);
  timesheetsStore.getTimesheetDetails(Number(route.params.id))
});

const timesheetDetails = computed(() => {
  return timesheetsStore.TimesheetDetails
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

    <q-page-container class="q-ma-sm">
            <q-list v-for="timesheetDetail in timesheetDetails" :key="timesheetDetail.id"
            class="rounded-borders q-my-md bg-grey-3">
            <q-expansion-item
              expand-separator
              expand-icon-class="text-primary"
            >
              <template v-slot:header>
                <q-item-section>
                <q-item-label>
                    {{ timesheetDetail.accountName }}
                </q-item-label>
                <q-item-label caption>
                 {{ timesheetDetail.createdDate? dateTimeHelper.extractDateFromUtc(timesheetDetail.createdDate): 'No Specific Date' }}
                </q-item-label>
                </q-item-section>

                <q-item-section side flex>
                  <q-item-label caption>
                  {{ timesheetDetail.timeDuration }} hrs

                  <q-btn
                    :to="{
                      name: 'editTimesheet',
                      params: {
                        id: timesheetDetail?.id,
                      },
                    }"
                    size="sm"
                    flat
                    round
                    dense
                    icon="edit"
                    class="q-ml-sm"
                  >
                  </q-btn>
                </q-item-label>
                </q-item-section>
              </template>
              <!-- <q-separator></q-separator> -->
              <q-item-section class="q-ma-md">

                <q-item-label caption>
                  Project
                </q-item-label>
                <q-item-label class="q-mb-sm">
                  {{ timesheetDetail.projectName }}
                </q-item-label>

                <q-item-label caption>
                  Task
                </q-item-label>
                <q-item-label class="q-mb-sm">
                  {{ timesheetDetail.serviceItemName }}
                </q-item-label>

                <q-item-label caption>
                  Billable
                </q-item-label>
                <q-item-label class="q-mb-sm">
                  {{ timesheetDetail.isBillable? 'Yes': 'No' }}
                </q-item-label>

                <q-item-label caption>
                  Description
                </q-item-label>
                <q-item-label >
                  {{ timesheetDetail.description }}
                </q-item-label>
              </q-item-section>
              <q-item-section side flex>
                <q-item-label>
                  <q-btn
                  @click="timesheetsStore.deleteTimesheet(timesheetDetail?.id); $router.go(-1)"
                    size="sm"
                    flat
                    round
                    dense
                    icon="delete"
                    class="q-mr-sm q-mb-sm"
                  ></q-btn>
                </q-item-label>
              </q-item-section>
            </q-expansion-item>
          </q-list>
    </q-page-container>
  </q-layout>
</template>

<style></style>
