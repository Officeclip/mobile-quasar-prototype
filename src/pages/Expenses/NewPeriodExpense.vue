<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useExpenseListsStore } from '../../stores/expense/expenseListsStore';
import { useRouter } from 'vue-router';

const expenseListsStore = useExpenseListsStore();

onMounted(() => {
  expenseListsStore.getExpensesList();
});

const periodOptions = computed(() => {
  return expenseListsStore.PeriodList;
});

console.log('Period Options', periodOptions.value)

const period = ref('');
const date = ref('');


function validatePeriod(event: string) {
  console.log('Selected period', period.value)
  if (event == '') {
    'Please select period..';
  }
}
const datesList = ref<Array<{ label: string; value: string; }>>([]);

const getDatesBetween = (startDate: any, endDate: any) => {
  const dates = [];

  const startDateUnix = new Date(startDate).getTime();
  const endDateUnix = new Date(endDate).getTime();

  // Calculate the difference between the start and end dates in days
  const dayDifference = (endDateUnix - startDateUnix) / (1000 * 60 * 60 * 24);

  // Iterate over the days and add them to the array
  for (let i = 0; i <= dayDifference; i++) {
    const date = new Date(startDateUnix + (i * 1000 * 60 * 60 * 24));
    dates.push(date);
  }

  const formattedDates = dates.map((date) => {
    return {
      label: `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}(${date.toLocaleDateString('en-US', { weekday: 'short' })})`,
      value: date.toISOString(),
    };
  });

  datesList.value = formattedDates;

  console.log('testing dates', formattedDates)

  // Return the array of dates
  return formattedDates;
};

const startDate = ref('2023-10-25');
const endDate = ref('2023-10-27');

const getDatesBetweenStartEnd = () => {

  const expensePeriod = periodOptions.value.find(
    (x) => x.name === period.value
  );

  const dateStart = expensePeriod?.start;
  const dateEnd = expensePeriod?.end;

  console.log('Dates between start and end', dateStart, dateEnd)

  getDatesBetween(dateStart, dateEnd);

}

// Call the getDatesBetween function when the start or end date changes
watch([startDate, endDate], () => {
  // Get the dates between the start date and end date
  const newDates = getDatesBetween(startDate.value, endDate.value);

  // Update the dates ref with the new array of dates
  datesList.value = newDates;
  console.log('testing dates value - ', newDates)
});
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn @click="$router.go(-1)" flat round dense color="white" icon="arrow_back">
        </q-btn>
        <q-toolbar-title> New Expense</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <div>
        <div class="q-pa-md">
          <div class="q-gutter-y-md column">
            <pre>{{ period }}</pre>
            <q-select label="Period" v-model="period" :options="periodOptions" map-options option-value="name"
              @update:model-value="getDatesBetweenStartEnd()" option-label="name" emit-value />
          </div>
          <div class="q-gutter-y-md column">
            <q-select label="Dates" v-model="date" :options="datesList" map-options option-value="value"
              option-label="label" emit-value />
          </div>
        </div>
        <q-btn class="q-ml-md q-mb-md q-mt-md" label="Next" color="primary" :to="{
          name: 'newExpense',
          params: {
            period: period,
            //datesList: JSON.stringify(datesList)
          },
        }" @click="validatePeriod(period)"></q-btn>
        <!-- <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm"></q-btn> -->
      </div>
    </q-page-container>
  </q-layout>
</template>

<style scoped></style>
