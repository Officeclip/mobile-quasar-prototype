<script setup>
import {ref} from 'vue';
import {RRule} from 'rrule'

const emit = defineEmits(['rrule-string-generated', 'rrule-text-generated'])

const selectedOption = ref('daily');

const recurrenceOptions = [
  {label: 'Daily', value: 'daily'},
  {label: 'Weekly', value: 'weekly'},
  {label: 'Monthly', value: 'monthly'},
  {label: 'Yearly', value: 'yearly'}
]
const weekdays = [
  {label: 'Monday', value: 0},
  {label: 'Tuesday', value: 1},
  {label: 'Wednesday', value: 2},
  {label: 'Thursday', value: 3},
  {label: 'Friday', value: 4},
  {label: 'Saturday', value: 5},
  {label: 'Sunday', value: 6},
];

const monthsOfYear = [
  {label: 'January', value: 1},
  {label: 'February', value: 2},
  {label: 'March', value: 3},
  {label: 'April', value: 4},
  {label: 'May', value: 5},
  {label: 'June', value: 6},
  {label: 'July', value: 7},
  {label: 'August', value: 8},
  {label: 'September', value: 9},
  {label: 'October', value: 10},
  {label: 'November', value: 11},
  {label: 'December', value: 12},
];

const numberOfDaysOfMonth = Array.from({length: 31}, (_, index) => {
  const day = index + 1; // Parse as an integer

  // Determine the suffix based on the last digit of the day
  let suffix = 'th';
  if (day < 11 || day > 13) {
    const lastDigit = day % 10;
    if (lastDigit === 1) {
      suffix = 'st';
    } else if (lastDigit === 2) {
      suffix = 'nd';
    } else if (lastDigit === 3) {
      suffix = 'rd';
    }
  }
  const label = `${day}${suffix}`;
  return {label, value: day};
});

const numberOfMonthsOfYear = Array.from({length: 12}, (_, index) => {
  const month = index + 1; // Parse as an integer
  return {label: month.toString(), value: month};
});

// const numberOfDaysOfMonth = ref(Array.from({length: 31}, (_, index) => {
//   const day = index + 1; // Parse as an integer
//   return {label: day.toString(), value: day};
// }));

// const numberOfMonthsOfYear = ref(Array.from({length: 12}, (_, index) => {
//   const month = index + 1;
//
//   // Determine the suffix based on the month
//   let suffix = 'th';
//   if (month === 1) {
//     suffix = 'st';
//   } else if (month === 2) {
//     suffix = 'nd';
//   } else if (month === 3) {
//     suffix = 'rd';
//   }
//
//   // Generate the label with the correct suffix
//   const label = `${month}${suffix} month`;
//   return {label, value: month};
// }));


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
const weeklyChosenDays = ref([0, 2]);

const monthlyDayNumber = ref(1);
const monthlyMonthNumber = ref(1);
const monthlyOccurrence = ref(1);
const monthlyWeekDay = ref(0);
const monthlyMonthNumber2 = ref(1);
const monthlyChoice = ref('monthly-option1');

const yearlyMonth = ref(1);
const yearlyDay = ref(0);
const yearlyChoice = ref('yearly-option1');

const yearlyOccurrence = ref(1);
const yearlyWeekday = ref(0);
const yearlyMonth2 = ref(1);

const dateOrCount = ref('count')
const numberOfOccurrences = ref(10);
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
    ruleOptions.count = numberOfOccurrences.value;
  } else if (dateOrCount.value === 'date') {
    ruleOptions.until = selectedEndDate.value; // Use selectedEndDate as the end date
  }

  const rule = new RRule(ruleOptions);
  generatedRRule.value = rule.toString();
  emit('rrule-string-generated', rule.toString());
  emit('rrule-text-generated', rule.toText());

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
    <div class="q-pa-sm">
      <q-item class="flex-center q-gutter-md row">
        <q-item-label>Frequency:</q-item-label>
        <q-select v-model="selectedOption" :options="recurrenceOptions" emit-value standout/>
      </q-item>

      <div v-if="selectedOption === 'daily'" class="column">
        <q-radio v-model="dailyChoice" val="daily-option1">
          <q-item class="flex-center q-gutter-md row">
            <q-item-label>Repeat once every</q-item-label>
            <q-input v-model="dailyDays" type="number" @click.stop/>
            <q-item-label>day(s)</q-item-label>
          </q-item>
        </q-radio>
        <q-radio v-model="dailyChoice" val="daily-option2">
          <q-item class="flex-center q-gutter-md row">
            <q-item-label>Repeat every weekday</q-item-label>
          </q-item>
        </q-radio>
      </div>

      <div v-else-if="selectedOption === 'weekly'">
        <q-item class="flex-center q-gutter-md row">
          <q-item-label>Recur once every</q-item-label>
          <q-input v-model="weeklyWeeks" type="number" @click.stop/>
          <q-item-label>week(s) on</q-item-label>
          <q-select v-model="weeklyChosenDays" :options="weekdays" clearable emit-value map-options multiple standout/>
        </q-item>
      </div>

      <div v-else-if="selectedOption === 'monthly'">
        <div class="q-radio-group">
          <q-radio v-model="monthlyChoice" val="monthly-option1">
            <q-item class="flex-center q-gutter-md row">
              <q-select v-model="monthlyDayNumber" :options="numberOfDaysOfMonth" emit-value map-options standout/>
              <q-item-label>day of the month after every</q-item-label>
              <q-select v-model="monthlyMonthNumber" :options="numberOfMonthsOfYear" emit-value standout/>
              <q-item-label>month(s)</q-item-label>
            </q-item>
          </q-radio>
          <q-radio v-model="monthlyChoice" val="monthly-option2">
            <q-item class="flex-center q-gutter-md row">
              <q-select v-model="monthlyOccurrence" :options="occurrences" emit-value map-options standout/>
              <q-select v-model="monthlyWeekDay" :options="weekdays" emit-value map-options standout/>
              <q-item-label>after every</q-item-label>
              <q-select v-model="monthlyMonthNumber2" :options="numberOfMonthsOfYear" emit-value map-options standout/>
              <q-item-label>month(s)</q-item-label>
            </q-item>
          </q-radio>
        </div>
      </div>

      <div v-else-if="selectedOption === 'yearly'">
        <div class="q-radio-group">
          <q-radio v-model="yearlyChoice" val="yearly-option1">
            <q-item class="flex-center q-gutter-md row">
              <q-item-label>Every</q-item-label>
              <q-select v-model="yearlyMonth" :options="monthsOfYear" emit-value map-options standout/>
              <q-select v-model="yearlyDay" :options="numberOfDaysOfMonth" emit-value map-options standout/>
            </q-item>
          </q-radio>
          <q-radio v-model="yearlyChoice" val="yearly-option2">
            <q-item class="flex-center q-gutter-md row">
              <q-item-label>The</q-item-label>
              <q-select v-model="yearlyOccurrence" :options="occurrences" emit-value map-options standout/>
              <q-select v-model="yearlyWeekday" :options="weekdays" emit-value map-options standout/>
              <q-item-label>of every</q-item-label>
              <q-select v-model="yearlyMonth2" :options="monthsOfYear" emit-value map-options standout/>
            </q-item>
          </q-radio>
        </div>
      </div>

      <q-separator/>

      <div class="q-radio-group">
        <q-radio v-model="dateOrCount" val="count">
          <q-item class="flex-center q-gutter-md row">
            <q-item-label>End after</q-item-label>
            <q-input v-model="numberOfOccurrences" type="number" @click.stop/>
            <q-item-label>occurrences</q-item-label>
          </q-item>
        </q-radio>

        <q-radio v-model="dateOrCount" val="date">
          <q-item class="flex-center q-gutter-md row">
            <q-item-section>End by</q-item-section>
            <q-input v-model="selectedEndDate" clearable type="date" @click.stop/>
          </q-item>
        </q-radio>
      </div>

      <q-card-actions>
        <q-btn v-close-popup color="primary" label="Save" @click="generateRecurrenceRule"/>
      </q-card-actions>
      <div v-if="generatedRRule">
        <code>{{ generatedRRule }}</code>
      </div>
    </div>
  </q-card>
</template>

<style>

</style>
