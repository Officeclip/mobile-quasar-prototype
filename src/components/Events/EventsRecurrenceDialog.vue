<script lang="ts" setup>

import {ref} from "vue";

import '@vuepic/vue-datepicker/dist/main.css';
import {RRule} from 'rrule'


const selectedOption = ref('daily');

const recurrenceOptions = ref([
  {label: 'Daily', value: 'daily'},
  {label: 'Weekly', value: 'weekly'},
  {label: 'Monthly', value: 'monthly'},
  {label: 'Yearly', value: 'yearly'}
])
const weekdays = [
  {label: 'Sunday', value: RRule.SU},
  {label: 'Monday', value: RRule.MO},
  {label: 'Tuesday', value: RRule.TU},
  {label: 'Wednesday', value: RRule.WE},
  {label: 'Thursday', value: RRule.TH},
  {label: 'Friday', value: RRule.FR},
  {label: 'Saturday', value: RRule.SA},
];
const monthsOfYear = [
  {label: 'January', value: 'January'},
  {label: 'February', value: 'February'},
  {label: 'March', value: 'March'},
  {label: 'April', value: 'April'},
  {label: 'May', value: 'May'},
  {label: 'June', value: 'June'},
  {label: 'July', value: 'July'},
  {label: 'August', value: 'August'},
  {label: 'September', value: 'September'},
  {label: 'October', value: 'October'},
  {label: 'November', value: 'November'},
  {label: 'December', value: 'December'},
];
const numberOfDaysOfMonth = ref(Array.from({length: 31}, (_, index) => {
  const day = index + 1; // Parse as an integer
  return {label: day.toString(), value: day};
}));
const numberOfMonthsOfYear = ref(Array.from({length: 12}, (_, index) => {
  const month = index + 1; // Parse as an integer
  return {label: month.toString(), value: month};
}));
const occurrences = ref([
  {label: 'First', value: 1},
  {label: 'Second', value: 2},
  {label: 'Third', value: 3},
  {label: 'Fourth', value: 4},
  {label: 'Last', value: -1},
]);


const dailyDays = ref(1);
const dailyChoice = ref('daily-option1');

const weeklyWeeks = ref(1);
const weeklyChosenDays = ref([]);

const monthlyDayNumber = ref(1);
const monthlyMonthNumber = ref(1);
const monthlyOccurrence = ref(1);
const monthlyWeekDay = ref(RRule.MO);
const monthlyMonthNumber2 = ref(1);
const monthlyChoice = ref('monthly-option1');

const yearlyMonth = ref('January');
const yearlyDay = ref(1);
const yearlyChoice = ref('yearly-option1');

const yearlyOccurrence = ref(1);
const yearlyWeekday = ref(RRule.MO);
const yearlyMonth2 = ref('January');

const dateOrCount = ref('count')
const count = ref(1);
const selectedEndDate = ref(null);

const generateRecurrenceRule = () => {
  let ruleOptions = {
    dtstart: new Date(),
    // freq: RRule.DAILY,
    // interval: dailyDays.value,
    // byweekday :weeklyChosenDays.value,
  };

  switch (selectedOption.value) {
    case 'daily':
      if (dailyChoice.value === 'daily-option1') {
        ruleOptions.freq = RRule.DAILY;
        ruleOptions.interval = dailyDays.value;
      } else if (dailyChoice.value === 'daily-option2') {
        ruleOptions.freq = RRule.DAILY;
        ruleOptions.byweekday = [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR];
      }
      break;

    case 'weekly':
      ruleOptions.freq = RRule.WEEKLY;
      ruleOptions.interval = weeklyWeeks.value;
      ruleOptions.byweekday = weeklyChosenDays.value;
      break;

    case 'monthly':
      if (monthlyChoice.value === 'monthly-option1') {
        ruleOptions.freq = RRule.MONTHLY;
        ruleOptions.interval = monthlyMonthNumber.value;
        ruleOptions.bymonthday = monthlyDayNumber.value;
      } else if (monthlyChoice.value === 'monthly-option2') {
        ruleOptions.freq = RRule.MONTHLY;
        ruleOptions.interval = monthlyMonthNumber2.value;
        ruleOptions.byweekday = monthlyWeekDay.value;
        ruleOptions.bysetpos = monthlyOccurrence.value;
      }
      break;

    case 'yearly':
      if (yearlyChoice.value === 'yearly-option1') {
        ruleOptions.freq = RRule.YEARLY;
        ruleOptions.bymonth = yearlyMonth.value;
        ruleOptions.bymonthday = yearlyDay.value;
      } else if (yearlyChoice.value === 'yearly-option2') {
        ruleOptions.freq = RRule.YEARLY;
        ruleOptions.byweekday = yearlyWeekday.value;
        ruleOptions.bysetpos = yearlyOccurrence.value;
        ruleOptions.bymonth = yearlyMonth2.value;
      }
      break;

    default:
      break;
  }

  if (dateOrCount.value === 'count') {
    ruleOptions.count = count.value;
  } else if (dateOrCount.value === 'date') {
    ruleOptions.until = selectedEndDate.value; // Use selectedEndDate as the end date
  }

  const rule = new RRule(ruleOptions);
  console.log(rule.toString());
  generatedRRule.value = rule.toString();

};
const generatedRRule = ref('');
const rruleInput = ref('');

const parseRRule = () => {
  try {
    const rule = RRule.fromString(rruleInput.value);
    const options = rule.origOptions;

    // Set the selectedOption based on the parsed rule
    switch (options.freq) {
      case RRule.DAILY:
        selectedOption.value = 'daily';
        dailyChoice.value = options.interval === 1 ? 'daily-option1' : 'daily-option2';
        dailyDays.value = options.interval === 1 ? 1 : options.interval;
        break;
      case RRule.WEEKLY:
        selectedOption.value = 'weekly';
        weeklyWeeks.value = options.interval || 1;
        weeklyChosenDays.value = options.byweekday || [];
        break;
      case RRule.MONTHLY:
        selectedOption.value = 'monthly';
        if (options.bymonthday) {
          monthlyChoice.value = 'monthly-option1';
          monthlyDayNumber.value = options.bymonthday;
          monthlyMonthNumber.value = options.interval || 1;
        } else {
          monthlyChoice.value = 'monthly-option2';
          monthlyOccurrence.value = options.bysetpos;
          monthlyWeekDay.value = options.byweekday[0];
          monthlyMonthNumber2.value = options.interval || 1;
        }
        break;
      case RRule.YEARLY:
        selectedOption.value = 'yearly';
        if (options.bymonthday) {
          yearlyChoice.value = 'yearly-option1';
          yearlyMonth.value = options.bymonth;
          yearlyDay.value = options.bymonthday;
        } else {
          yearlyChoice.value = 'yearly-option2';
          yearlyOccurrence.value = options.bysetpos;
          yearlyWeekday.value = options.byweekday[0];
          yearlyMonth2.value = options.bymonth;
        }
        break;
      default:
        break;
    }
  } catch (error) {
    console.error('Invalid RRule input:', error);
  }
};


</script>

<template>
  <q-card>
    <div class="q-pa-md">
      <q-item class="flex-center q-gutter-md row">
        Frequency:
        <q-select standout v-model="selectedOption" :options="recurrenceOptions" emit-value map-options/>
      </q-item>
      <div v-if="selectedOption === 'daily'" class="column">
        <q-radio v-model="dailyChoice" val="daily-option1">
          <q-item class="flex-center q-gutter-md row">
            Every
            <q-input v-model="dailyDays" type="number"/>
            Days
          </q-item>
        </q-radio>
        <q-radio v-model="dailyChoice" val="daily-option2">Every Weekday</q-radio>
      </div>

      <div v-else-if="selectedOption === 'weekly'">
        <q-item class="flex-center q-gutter-md row">
          Recur every
          <q-input v-model="weeklyWeeks" type="number"/>
          weeks
          <q-select standout v-model="weeklyChosenDays" :options="weekdays" emit-value map-options multiple/>
        </q-item>
      </div>

      <div v-else-if="selectedOption === 'monthly'">
        <div class="q-radio-group">

          <q-radio v-model="monthlyChoice" val="monthly-option1">
            <q-item class="flex-center q-gutter-md row">
              Day
              <q-select standout v-model="monthlyDayNumber" :options="numberOfDaysOfMonth" emit-value map-options/>
              of every
              <q-select standout v-model="monthlyMonthNumber" :options="numberOfMonthsOfYear" emit-value map-options/>
              months
              {{ monthlyMonthNumber }}
            </q-item>
          </q-radio>
          <q-radio v-model="monthlyChoice" val="monthly-option2">
            <q-item class="flex-center q-gutter-md row">

              The
              <q-select standout v-model="monthlyOccurrence" :options="occurrences" emit-value map-options/>
              <q-select standout v-model="monthlyWeekDay" :options="weekdays" emit-value map-options/>
              of every
              <q-select standout v-model="monthlyMonthNumber2" :options="numberOfMonthsOfYear" emit-value map-options/>
              months
            </q-item>
          </q-radio>
        </div>
      </div>

      <div v-else-if="selectedOption === 'yearly'">
        <div class="q-radio-group">
          <q-radio v-model="yearlyChoice" val="yearly-option1">
            <q-item class="flex-center q-gutter-md row">
              Every
              <q-select standout v-model="yearlyMonth" :options="monthsOfYear" emit-value map-options/>
              <q-select standout v-model="yearlyDay" :options="numberOfDaysOfMonth" emit-value map-options/>
            </q-item>
          </q-radio>
          <q-radio v-model="yearlyChoice" val="yearly-option2">
            <q-item class="flex-center q-gutter-md row">

              The
              <q-select standout v-model="yearlyOccurrence" :options="occurrences" emit-value map-options/>
              <q-select standout v-model="yearlyWeekday" :options="weekdays" emit-value map-options/>
              of
              <q-select standout v-model="yearlyMonth2" :options="monthsOfYear" emit-value map-options/>
            </q-item>
          </q-radio>
        </div>
      </div>

      <div class="q-radio-group">
        <q-radio v-model="dateOrCount" val="count">
          <q-item class="flex-center q-gutter-md row">

            End after
            <q-input v-model="count" type="number"/>
            occurrences
          </q-item>
        </q-radio>
        <q-radio v-model="dateOrCount" val="date">
          <q-item class="flex-center q-gutter-md row">

            End by
            <q-date v-model="selectedEndDate"/>
          </q-item>
        </q-radio>
      </div>

      <q-btn color="primary" @click="generateRecurrenceRule">GENERATE</q-btn>
      <div v-if="generatedRRule">
        <code>{{ generatedRRule }}</code>
      </div>
    </div>
  </q-card>
</template>

<style>

</style>
