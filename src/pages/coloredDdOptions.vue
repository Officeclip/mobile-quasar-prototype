<script lang="ts" setup>
import dateTimeHelper from 'src/helpers/dateTimeHelper';

/* const eventSummary = [
  {
    startDateTime: '2024-07-05T00:00:00Z',
    isAllDayEvent: true,
  },
  {
    startDateTime: '2024-07-10T00:00:00Z',
    isAllDayEvent: false,
  },
  {
    startDateTime: '2024-07-15T00:00:00Z',
    isAllDayEvent: true,
  },
]; */

/* function getEventSummaryDates() {
  if (eventSummary) {
    const dates = eventSummary.map(function (data) {
      if (data.isAllDayEvent) {
        const helper = dateTimeHelper.extractDateFromUtc(data.startDateTime);
        return helper?.replace(/-/g, '/');
      } else {
        const date = new Date(data.startDateTime);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Pad month with leading zero
        const day = String(date.getDate()).padStart(2, '0'); // Pad day with leading zero
        return `${year}/${month}/${day}`;
      }
    });
    return dates;
  }
  return [];
} */

const sampleData = [
  {
    startDateTime: '2024-07-05T00:00:00Z',
    isAllDayEvent: true,
  },
  {
    startDateTime: '2024-07-10T01:00:00Z',
    isAllDayEvent: false,
  },
  {
    startDateTime: '2024-07-15T00:00:00Z',
    isAllDayEvent: true,
  },
];

function convertStartDateTimeToDateObject(data) {
  // Loop through each object in the data
  for (let i = 0; i < data.length; i++) {
    data[i].startDateTime = dateTimeHelper.newExtractDateFromUtc(
      data[i].startDateTime,
      data[i].isAllDayEvent
    );
    // Check if isAllDayEvent is true
    // if (!data[i].isAllDayEvent) {
    //   // Create a new Date object from the startDateTime string
    //   data[i].startDateTime = new Date(data[i].startDateTime);
    // } else {
    //   data[i].startDateTime = new Date(
    //     dateTimeHelper.extractDateFromUtc(data[i].startDateTime)
    //   );
    // }
  }
  console.log('XXXXXXXXXXXXXXXXXX', data);
  return data; // Return the modified data array
}

const dataWithDateObjects = convertStartDateTimeToDateObject(sampleData);
// console.log(dataWithDateObjects);
</script>

<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column">
      <q-list>
        <q-list-item>{{ dataWithDateObjects }}</q-list-item>
      </q-list>
    </div>
  </div>
</template>
<style></style>
