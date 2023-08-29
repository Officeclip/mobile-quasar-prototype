<script setup lang="ts">
import { onMounted } from 'vue';
import { useTimesheetsStore } from '../../stores/TimesheetsStore';

const data = useTimesheetsStore();
const arr = data.timesheets

const allTimesheets =  [
  {
  id: 1,
  icon: 'schedule',
  color: 'black',
  status: 'Saved',
  description: 'Timesheets(s) saved but not yet submitted'
},
{
  id: 2,
  icon: 'schedule',
  color: 'secondary',
  status: 'Pending',
  description: 'Your timesheets(s) submitted for approval'
},
{
  id: 3,
  icon: 'schedule',
  color: 'teal',
  status: 'Submitted',
  description: 'Timesheets(s) submitted to you for approval'
},
{
  id: 4,
  icon: 'schedule',
  color: 'primary',
  status: 'Approved',
  description: 'All your approval timesheets(s)'
},
{
  id: 5,
  icon: 'schedule',
  color: 'red',
  status: 'Rejected',
  description: 'All your rejected timesheets(s)'
}
]

</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar class="glossy">
        <q-btn
         @click="$router.go(-1)"
          flat
          round
          dense
          color="white"
          icon="arrow_back"
        >
        </q-btn>
        <q-toolbar-title> Timesheets </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-space class="q-mt-sm"></q-space>
    <q-page-container>
      <q-page>
        <q-list v-for="timesheet in allTimesheets" :key="timesheet.id">
    <q-item
      :to="{
        name: 'timesheetsList',
        params: {
          id: timesheet.id,
          status: timesheet.status,
        },
      }"
      clickable
      v-ripple
    >

    <q-item-section avatar>
        <q-icon
        :name= 'timesheet.icon'
        :color='timesheet.color'>
        </q-icon>
      </q-item-section>
      <q-item-section>
        <q-item-label>
          {{ timesheet.status }} timesheets
        </q-item-label>
        <q-item-label caption>{{ timesheet.description }}</q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-icon color="primary" name="chevron_right" />
      </q-item-section>
    </q-item>
    <q-separator></q-separator>
  </q-list>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.q-router-link--active {
  color: black
}

.q-list:nth-child(odd) {
  background: rgb(238, 238, 238)
}
</style>
