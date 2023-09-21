<script setup lang="ts">
import { useExpenseSummaryStore } from '../../stores/expense/expenseSummaryStore';

const data = useExpenseSummaryStore();
const arr = data.expenseSummary;

const allExpenses = [
  {
    id: 1,
    icon: 'schedule',
    color: 'black',
    status: 'Saved',
    description: 'Expense(s) saved but not yet submitted',
  },
  {
    id: 2,
    icon: 'schedule',
    color: 'secondary',
    status: 'Pending',
    description: 'Your Expense(s) submitted for approval',
  },
  {
    id: 3,
    icon: 'schedule',
    color: 'teal',
    status: 'Submitted',
    description: 'Expense(s) submitted to you for approval',
  },
  {
    id: 4,
    icon: 'schedule',
    color: 'primary',
    status: 'Approved',
    description: 'All your approval Expense(s)',
  },
  {
    id: 5,
    icon: 'schedule',
    color: 'red',
    status: 'Rejected',
    description: 'All your rejected Expense(s)',
  },
];
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar class="glossy">
        <q-btn
          @click="$router.go(-1)"
          flat
          round
          dense
          color="white"
          icon="arrow_back"
        >
        </q-btn>
        <q-toolbar-title> Expenses </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-space class="q-mt-sm"></q-space>
    <q-page-container>
      <q-page>
        <q-list v-for="expense in allExpenses" :key="expense.id">
          <q-item
            :to="{
              name: 'expenseSummaryFiltered',
              params: {
                id: expense.id,
                status: expense.status,
              },
            }"
            clickable
            v-ripple
          >
            <q-item-section avatar>
              <q-icon :name="expense.icon" :color="expense.color"> </q-icon>
            </q-item-section>
            <q-item-section>
              <q-item-label> {{ expense.status }} expenses </q-item-label>
              <q-item-label caption>{{ expense.description }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon color="primary" name="chevron_right" />
            </q-item-section>
          </q-item>
          <q-separator></q-separator>
        </q-list>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.q-router-link--active {
  color: black;
}

.q-list:nth-child(odd) {
  background: rgb(238, 238, 238);
}
</style>
