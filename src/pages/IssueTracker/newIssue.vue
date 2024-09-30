<script setup lang="ts">
import { ref } from 'vue';
import issueTrackerForm from '../../components/IssueTracker/IssueTrackerFormCtrl.vue';

const newIssue = ref({
  id: '',
  title: '',
  description: '',
  status: '',
  category: '',
  assignedTo: '',
  Severity: '',
});
</script>
<template>
  <issueTrackerForm :newIssue="newIssue" />
</template>
