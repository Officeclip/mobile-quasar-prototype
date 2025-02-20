<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useReminderDataStore } from 'stores/reminder/reminderData';

const props = defineProps(['remindTo', 'reminderValue']);

const label = computed(() => {
  return props?.remindTo ? 'Update' : 'Save';
});

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
  <q-card bordered style="width: 80%; border-color: #ff5722">
    <q-toolbar class="bg-orange text-white">
      <q-avatar>
        <q-icon name="alarm" size="md" />
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
      /></q-item-label>
      <q-item-label>
        <q-select
          v-model="selectedReminderTime"
          :options="reminderTimes"
          class="select-spacing"
          emit-value
          map-options
      /></q-item-label>
      <q-item-label class="q-ml-xs">before it is due</q-item-label>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn
        flat
        no-caps
        v-close-popup
        color="primary"
        :label="label"
        @click="generateReminder"
      >
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<style scoped></style>
