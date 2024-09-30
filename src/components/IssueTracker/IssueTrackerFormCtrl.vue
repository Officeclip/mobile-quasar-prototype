<script setup>
import { ref, defineProps } from 'vue';

const props = defineProps(['newIssue']);

const issueModel = ref(props.newIssue);

const statusOptions = ['Opne', 'Closed', 'Reopened', 'Resolved'];
</script>
<template>
  <q-item>
    <q-item-section>
      <q-item-label>
        <q-input label="Title" v-model="issueModel.title" />
      </q-item-label>
      <q-item-label>
        <q-input label="Description" v-model="issueModel.description" />
      </q-item-label>
      <q-item-label>
        <q-select
          label="Status"
          v-model="issueModel.status"
          :options="statusOptions"
        />
      </q-item-label>
      <q-item-label>
        <q-select
          label="Category"
          v-model="issueModel.category"
          :options="statusOptions"
        />
      </q-item-label>
      <q-item-label>
        <q-select
          label="Assigned To"
          v-model="issueModel.assignedTo"
          :options="statusOptions"
        />
      </q-item-label>
      <q-item-label>
        <q-select
          label="Severity"
          v-model="issueModel.severity"
          :options="statusOptions"
        />
      </q-item-label> </q-item-section
  ></q-item>
</template>
