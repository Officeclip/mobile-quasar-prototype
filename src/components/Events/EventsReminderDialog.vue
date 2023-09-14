<script lang="ts" setup>
import {ref} from 'vue';

const reminderOptions = [
  {label: 'Remind Me', value: 'remindMe'},
  {label: 'Remind Everybody', value: 'remindAll'}
];

const reminderTimes = [
  {label: '5 Minutes', value: 5},
  {label: '10 Minutes', value: 10},
  {label: '15 Minutes', value: 15},
  {label: '30 Minutes', value: 30},
  {label: '45 Minutes', value: 45},
  {label: '1 Hour', value: 60},
  {label: '2 Hour', value: 120},
  {label: '3 Hour', value: 180},
  {label: '4 Hour', value: 240},
  {label: '5 Hour', value: 300},
  {label: '6 Hour', value: 360},
  {label: '7 Hour', value: 420},
  {label: '8 Hour', value: 480},
  {label: '9 Hour', value: 540},
  {label: '10 Hour', value: 600},
  {label: '11 Hour', value: 660},
  {label: '12 Hour', value: 720},
  {label: '1 day', value: 1440},
  {label: '2 days', value: 2880},
  {label: '3 days', value: 4320},
  {label: '4 days', value: 5760},
  {label: '5 days', value: 7200},
  {label: '1 week', value: 10080},
  {label: '2 weeks', value: 20160}
];

const selectedReminderOption = ref('remindMe');
const selectedReminderTime = ref(60);
</script>

<template>
  <q-card>
    <div class="q-pa-lg row flex-center">
      <q-item-label>Reminders:</q-item-label>
      <q-select v-model="selectedReminderOption" :options="reminderOptions" emit-value map-options standout class="select-spacing"/>
      <q-select v-model="selectedReminderTime" :options="reminderTimes" emit-value map-options standout class="select-spacing"/>
      <q-item-label>before it is due</q-item-label>
    </div>
  </q-card>
</template>

<style scoped>
.select-spacing {
  margin: 20px; /* Adjust the margin as needed */
}
</style>
