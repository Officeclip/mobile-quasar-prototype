<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useExpenseDetailsStore } from '../../stores/expense/expenseDetailsStore';
import dateTimeHelper from '../../helpers/dateTimeHelper';
import { getExpenseOrTimesheetStatusColor } from 'src/helpers/colorIconHelper';

const expensesDetailsStore = useExpenseDetailsStore();
const expenseStatus = ref('inbox');
const title = ref(expenseStatus.value);

onMounted(() => {
  expensesDetailsStore.getExpensesByStatus(String(expenseStatus.value));
});

const allExpenses = computed(() => {
  console.log('Expenses All', expensesDetailsStore.expenseSummary);
  return expensesDetailsStore.ExpenseSummary;
});

watch([expenseStatus], ([newModel]) => {
  expensesDetailsStore.getExpensesByStatus(String(newModel));
  title.value = newModel;
});

// function getStatusColor(status: string) {
//   if (status == 'Approved') {
//     return 'status-approved'
//   }
//   if (status == 'Pending') {
//     return 'status-pending'
//   }
//   if (status == 'Rejected') {
//     return 'status-rejected'
//   }
// }

const tabs = [
  {
    id: 1,
    name: 'inbox',
    status: 'inbox',
  },
  {
    id: 2,
    name: 'outbox',
    status: 'outbox',
  },
  {
    id: 3,
    name: 'archived',
    status: 'archived',
  },
];

// const allExpenses = [
//   {
//     id: 1,
//     icon: 'schedule',
//     color: 'black',
//     status: 'Saved',
//     description: 'Expense(s) saved but not yet submitted'
//   },
//   {
//     id: 2,
//     icon: 'schedule',
//     color: 'secondary',
//     status: 'Pending',
//     description: 'Your Expense(s) submitted for approval'
//   },
//   {
//     id: 3,
//     icon: 'schedule',
//     color: 'teal',
//     status: 'Submitted',
//     description: 'Expense(s) submitted to you for approval'
//   },
//   {
//     id: 4,
//     icon: 'schedule',
//     color: 'primary',
//     status: 'Approved',
//     description: 'All your approval Expense(s)'
//   },
//   {
//     id: 5,
//     icon: 'schedule',
//     color: 'red',
//     status: 'Rejected',
//     description: 'All your rejected Expense(s)'
//   }
// ]
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar class="glossy">
        <q-btn @click="$router.go(-1)" flat round dense color="white" icon="arrow_back">
        </q-btn>
        <q-toolbar-title>{{ title }} Expenses </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-footer elevated>
      <q-tabs v-model="expenseStatus" no-caps inline-label class="bg-primary text-white shadow-2" align="justify">
        <q-tab v-for="item in tabs" :name="item.name" :key="item.id" :label="item.status" />
      </q-tabs>
    </q-footer>
    <q-page-container>
      <q-page>
        <q-list v-for="expense in allExpenses" :key="expense.id">
          <q-item :to="{
            name: 'expenseDetails',
            params: {
              id: expense.id,
              fromDate: expense.fromDate,
            },
          }" clickable v-ripple>
            <q-item-section>
              <q-item-label>
                {{ expense.createdByUserName }}
              </q-item-label>
              <q-item-label caption>{{
                expense.fromDate
                ? dateTimeHelper.extractDateFromUtc(expense.fromDate)
                : 'No Specific Date'
              }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-chip square :color="getExpenseOrTimesheetStatusColor(expense.status)">{{ expense.status }}</q-chip>
              <!-- <q-item-label caption class="bg-teal-3 q-pa-xs">{{
                expense.status
              }}</q-item-label> -->
            </q-item-section>
            <q-item-section side>
              <q-icon color="primary" name="chevron_right" />
            </q-item-section>
          </q-item>
          <q-separator></q-separator>
        </q-list>
      </q-page>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn :to="{
          name: 'newPeriodExpense',
        }" fab icon="add" color="accent" padding="sm">
        </q-btn>
      </q-page-sticky>
    </q-page-container>
  </q-layout>
</template>
<!-- <style lang="scss">
@import '../../css/status.scss'
</style> -->

<style scoped>
.q-router-link--active {
  color: black;
}

.q-list:nth-child(odd) {
  background: rgb(238, 238, 238);
}
</style>
