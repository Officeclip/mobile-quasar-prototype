<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useExpenseListsStore } from '../../stores/expense/expenseListsStore';

const expenseListsStore = useExpenseListsStore();

onMounted(() => {
  expenseListsStore.getExpensesList();
});

const periodOptions = computed(() => {
  return expenseListsStore.PeriodList;
});

const period: any = ref('');
const errorMsg: any = ref('');
const warningMsg: any = ref('');

watch([period], ([newPeriodModel]) => {
  errorMsg.value = newPeriodModel.error;
  warningMsg.value = newPeriodModel.warning;
});

// const errorMessage = ref('');

// const errorMsg = ref('');

// const period = ref('');

// const expensePeriod = periodOptions.value.find((x) => x.name === period.value);
// console.log(expensePeriod);

// function validatePeriod(event: string) {
//   if (event == '') {
//     ('Please select period..');
//   }
// }
// const datesList = ref<Array<{ label: string; value: string }>>([]);

// watch([periodOptions], () => {
//   const expensePeriod = periodOptions.value.find((x) => x.name === period.value);
//   console.log('watch for period option in new period expense', expensePeriod);
// });

// const getDatesBetweenStartEnd = (startDate: any, endDate: any) => {
//   const expensePeriodOption = periodOptions.value.find((x) => x.name === period.value);
//   errorMessage.value = '';
//   errorMsg.value = '';

//   if (expensePeriodOption?.warning !== '') {
//     errorMessage.value = expensePeriodOption?.warning as string;
//   }

//   if (expensePeriodOption?.error !== '') {
//     errorMessage.value = expensePeriodOption?.error as string;
//     errorMsg.value = errorMessage.value;
//     console.log('Expense period error message', errorMsg.value);
//   }

//   const dates = [];
//   const startDateUnix = new Date(startDate).getTime();
//   const endDateUnix = new Date(endDate).getTime();

//   // Calculate the difference between the start and end dates in days
//   const dayDifference = (endDateUnix - startDateUnix) / (1000 * 60 * 60 * 24);

//   // Iterate over the days and add them to the array
//   for (let i = 0; i <= dayDifference; i++) {
//     const date = new Date(startDateUnix + i * 1000 * 60 * 60 * 24);
//     dates.push(date);
//   }

//   const formattedDates = dates.map((date) => {
//     return {
//       label: `${date.toLocaleDateString('en-US', {
//         month: 'short',
//         day: 'numeric',
//       })}(${date.toLocaleDateString('en-US', { weekday: 'short' })})`,
//       value: date.toISOString(),
//     };
//   });

//   datesList.value = formattedDates;

//   // Return the array of dates
//   return formattedDates;
// };
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
      <q-page>
        <q-list>
          <q-item v-if="errorMsg || warningMsg">
            <p v-if="errorMsg" class="text-red">{{ errorMsg }}</p>
            <p v-if="warningMsg" class="text-orange">{{ warningMsg }}</p>
          </q-item>
          <q-item>
            <q-select class="full-width" label="Period" v-model="period" :options="periodOptions" map-options
              option-label="name" /></q-item>
          <q-list>
            <q-btn v-if="period != '' && errorMsg == ''" class="q-ml-md q-mb-md q-mt-md" label="Next" color="primary" :to="{
              name: 'newExpense',
              params: {
                expenseSid: '-1',
                period: period.name
              },
            }"></q-btn>
          </q-list></q-list>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.error-message {
  color: red;
}
</style>
