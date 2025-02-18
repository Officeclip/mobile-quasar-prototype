<script lang="ts" setup>
import { ref } from 'vue';
import { useReminderDataStore } from 'stores/reminder/reminderData';

const props = defineProps(['remindTo', 'reminderValue']);

const reminderDataStore = useReminderDataStore();
reminderDataStore.getReminderObject();

const reminderOptions = reminderDataStore.ReminderOptions;
const reminderTimes = reminderDataStore.ReminderTimes;
const selectedReminderOption = ref(
  props?.remindTo ? props.remindTo : 'Remind Me'
);
const selectedReminderTime = ref(
  props?.reminderValue ? props.reminderValue : 60
);
const emit = defineEmits([
  'reminder-data-generated',
  'reminder-text-generated',
]);

function generateReminder() {
  // Find the selected reminder option and time based on refs
  const selectedOption = reminderOptions.find(
    (option: any) => option.value === selectedReminderOption.value
  );
  const selectedTime = reminderTimes.find(
    (time: any) => time.value === selectedReminderTime.value
  );

  if (selectedOption && selectedTime) {
    // Create the reminder string with values only
    const reminderData = [selectedOption.value, selectedTime.value];

    // Create the human-readable string
    const humanReadableString = `${selectedOption.label} ${selectedTime.label} before`;

    // Emit the reminder and human-readable strings
    emit('reminder-data-generated', reminderData);
    emit('reminder-text-generated', humanReadableString);
  }
}
</script>

<template>
  <!-- <q-card>
    <div class="q-pa-lg row flex-center">
      <q-item-label>Reminders:</q-item-label>
      <q-select
        v-model="selectedReminderOption"
        :options="reminderOptions"
        class="select-spacing"
        emit-value
        map-options
        standout
      />

      <q-select
        v-model="selectedReminderTime"
        :options="reminderTimes"
        class="select-spacing"
        emit-value
        map-options
        standout
      />
      <q-item-label>before it is due</q-item-label>
    </div>
    <q-card-actions>
      <q-btn
        v-close-popup
        color="primary"
        label="Save"
        @click="generateReminder"
      />
    </q-card-actions>
  </q-card> -->
  <q-card style="width: 80%">
    <q-toolbar>
      <q-avatar>
        <q-icon color="primary" name="alarm" size="md" />
      </q-avatar>

      <q-toolbar-title
        ><span v-if="!props?.remindTo" class="text-subtitle1 q-mr-sm">Set</span
        ><span class="text-h6">Reminder:</span></q-toolbar-title
      >

      <q-btn flat round dense icon="close" v-close-popup></q-btn>
    </q-toolbar>
    <q-separator />

    <q-card-section>
      <q-item-label>
        <q-select
          v-model="selectedReminderOption"
          :options="reminderOptions"
          emit-value
          map-options
          standout
      /></q-item-label>
      <q-item-label>
        <q-select
          v-model="selectedReminderTime"
          :options="reminderTimes"
          class="select-spacing"
          emit-value
          map-options
          standout
      /></q-item-label>
      <q-item-label class="q-ml-xs">before it is due</q-item-label>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn
        flat
        v-close-popup
        color="primary"
        label="Save"
        @click="generateReminder"
      >
        <template #default></template>
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<style scoped></style>
