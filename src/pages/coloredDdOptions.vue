<script setup>
const items = [
  { id: '1', name: 'Contacts', icon: 'person' },
  { id: '2', name: 'Calendar', icon: 'calendar_month' },
  { id: '3', name: 'Accounts', icon: 'person' },
  { id: '4', name: 'Timesheet', icon: 'schedule' },
  { id: '5', name: 'Expenses', icon: 'card_travel' },
  { id: '6', name: 'Notes', icon: 'subject' },
  { id: '7', name: 'Tasks', icon: 'checklist' },
  { id: '8', name: 'IssueTracker', icon: 'bug_report' },
];
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page>
        <div class="row">
          <div v-for="item in items" :key="item.name">item.name</div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
