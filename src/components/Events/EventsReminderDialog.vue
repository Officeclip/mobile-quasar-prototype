<script lang="ts" setup>
import {ref} from 'vue';

const reminderOptions = [
  {label: 'Remind Me', value: 'me'},
  {label: 'Remind Everybody', value: 'everyone'}
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

const selectedReminderOption = ref('me');
const selectedReminderTime = ref(60);
const emit = defineEmits(['reminder-data-generated', 'reminder-text-generated'])

function generateReminder(){
  // Find the selected reminder option and time based on refs
  const selectedOption = reminderOptions.find(option => option.value === selectedReminderOption.value);
  const selectedTime = reminderTimes.find(time => time.value === selectedReminderTime.value);

  if (selectedOption && selectedTime) {
    // Create the reminder string with values only
    const reminderData = [selectedOption.value,selectedTime.value];

    // Create the human-readable string
    const humanReadableString = `${selectedOption.label} ${selectedTime.label} before`;

    // Emit the reminder and human-readable strings
    emit('reminder-data-generated', reminderData);
    emit('reminder-text-generated', humanReadableString);
  }
}

</script>

<template>
  <q-card>
    <div class="q-pa-lg row flex-center">
      <q-item-label>Reminders:</q-item-label>
      <q-select v-model="selectedReminderOption"
                :options="reminderOptions"
                class="select-spacing"
                emit-value
                map-options
                standout/>

      <q-select v-model="selectedReminderTime"
                :options="reminderTimes"
                class="select-spacing"
                emit-value
                map-options
                standout/>
      <q-item-label>before it is due</q-item-label>
    </div>
    <q-card-actions>
      <q-btn v-close-popup color="primary" label="Save" @click="generateReminder"/>
    </q-card-actions>
  </q-card>
</template>

<style scoped>
.select-spacing {
  margin: 5px; /* Adjust the margin as needed */
}
</style>
