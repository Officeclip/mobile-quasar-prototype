<script setup>
import { ref, defineProps } from 'vue';

const props = defineProps(['issueObject']);

const issueObjectModel = ref(props.issueObject);

const statusOptions = ['Open', 'Closed', 'Reopened', 'Resolved'];
</script>
<template>
  <q-item>
    <q-item-section>
      <q-item-label>
        <q-input label="Title" v-model="issueObjectModel.title" />
      </q-item-label>
      <q-item-label>
        <q-input label="Description" v-model="issueObjectModel.description" />
      </q-item-label>
      <q-item-label>
        <q-select
          label="Status"
          v-model="issueObjectModel.status"
          :options="statusOptions"
        />
      </q-item-label>
      <q-item-label>
        <q-select
          label="Category"
          v-model="issueObjectModel.category"
          :options="statusOptions"
        />
      </q-item-label>
      <q-item-label>
        <q-select
          label="Assigned To"
          v-model="issueObjectModel.assignedTo"
          :options="statusOptions"
        />
      </q-item-label>
      <q-item-label>
        <q-select
          label="Severity"
          v-model="issueObjectModel.severity"
          :options="statusOptions"
        />
      </q-item-label> </q-item-section
  ></q-item>
</template>
