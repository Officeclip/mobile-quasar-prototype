<script setup lang="ts">
// import { useRouter } from 'vue-router';
import OC_Header from 'src/components/OCcomponents/OC_Header.vue';

// const router = useRouter();
// TODO: CR: 2024-08-05: Can this be put in the helper as constant?
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
    <OC_Header title="Expenses"></OC_Header>
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
