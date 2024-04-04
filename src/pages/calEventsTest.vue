<script setup>
import { ref, computed } from 'vue';

const selectedDate = ref(null); // Initially null to avoid filtering on mount

const eventSummary = [
  // Your event summary data here...
];

const filteredEvents = computed(() => {
  if (!selectedDate.value) return [];

  const currentMonth = selectedDate.value.getMonth() + 1;
  return eventSummary.filter((event) => {
    const eventMonth = new Date(event.startDateTime).getMonth() + 1;
    return eventMonth === currentMonth;
  });
});

const handleDateChange = (newDate) => {
  console.log('Testing the Events sample program::', newDate);
  selectedDate.value = newDate;
};
</script>

<template>
  <div>
    <q-date
      v-model="selectedDate"
      :events="filteredEvents"
      @navigation="handleDateChange"
    />
  </div>
</template>

<style></style>
