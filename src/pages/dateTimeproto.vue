<script setup>
import { ref, computed, watch } from 'vue';
import { format } from 'date-fns';

const dateTime = ref('2020-03-04T10:30:00Z');
const date = ref('');
const time = ref('');

// Function to extract date and time from dateTime
function extractDateAndTime(dateTimeValue) {
  const dateObj = new Date(dateTimeValue);
  date.value = dateObj.toISOString().split('T')[0]; // Extract date (YYYY-MM-DD)
  time.value = dateObj.toISOString().split('T')[1].split('.')[0]; // Extract time (HH:mm:ss)
}

// Initial extraction
extractDateAndTime(dateTime.value);

watch([date, time], ([newDate, newTime]) => {
  // Watch for changes in dateTime
  // extractDateAndTime(newDateTime);
  // Create Date objects and explicitly set the time zone to UTC
  const utcDate = new Date(`${newDate}T${newTime}Z`);
  dateTime.value = utcDate.toISOString();
});

// Function to format the date and time
function formatDateTime(dateValue = '', timeValue = '', isAllDay = false) {
  // const utcDate = new Date(`${dateValue}T${timeValue}Z`);
  const utcDate =
    dateValue && timeValue
      ? new Date(`${dateValue}T${timeValue}Z`)
      : new Date(`${dateValue}T00:00:00Z`);
  if (isAllDay) {
    return format(utcDate, 'EEE, MMM dd, yyyy');
  }
  return format(utcDate, 'EEE, MMM dd, yyyy  hh:mm:ss a');
}

const convertedDate = computed(() => {
  return formatDateTime(date.value, time.value);
});
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <div class="q-pa-md">
    <div class="q-gutter-y-md column">
      <q-list>
        <!-- <pre>{{ dateTime }}</pre> -->
        <q-input
          v-model="date"
          :rules="[(val) => !!val || 'Start Date is required']"
          label="Starts*"
          name="startDate"
          :model-value="convertedDate"
        >
          <template v-slot:prepend>
            <q-icon class="cursor-pointer" name="event">
              <q-popup-proxy
                cover
                transition-hide="scale"
                transition-show="scale"
              >
                <q-date v-model="date" mask="YYYY-MM-DD">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup color="primary" flat label="Close" />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
          <template v-slot:append>
            <q-icon class="cursor-pointer" name="access_time">
              <q-popup-proxy
                cover
                transition-hide="scale"
                transition-show="scale"
              >
                <q-time v-model="time" mask="HH:mm">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup color="primary" flat label="Close" />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-list>
    </div>
  </div>
</template>
