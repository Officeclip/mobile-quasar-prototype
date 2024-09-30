<script setup>
import { ref, defineProps } from 'vue';

const props = defineProps(['newIssue']);

const issueStatus = ref(null);
const title2 = ref('');
const statusOptions = ['Opne', 'Closed', 'Reopened', 'Resolved'];
</script>
<template>
  <pre>{{ props.newIssue }}</pre>
  <q-item>
    <q-item-section>
      <q-item-label>
        <q-input label="Title" v-model="title2" />
      </q-item-label>
      <q-item-label>
        <q-input label="Description" v-model="title2" />
      </q-item-label>
      <q-item-label>
        <q-select
          label="Status"
          v-model="issueStatus"
          :options="statusOptions"
        />
      </q-item-label>
      <q-item-label>
        <q-select
          label="Category"
          v-model="issueStatus"
          :options="statusOptions"
        />
      </q-item-label>
      <q-item-label>
        <q-select
          label="Assigned To"
          v-model="issueStatus"
          :options="statusOptions"
        />
      </q-item-label>
      <q-item-label>
        <q-select
          label="Severity"
          v-model="issueStatus"
          :options="statusOptions"
        />
      </q-item-label> </q-item-section
  ></q-item>
</template>
