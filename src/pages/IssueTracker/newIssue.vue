<script setup lang="ts">
import { ref } from 'vue';
import issueTrackerForm from '../../components/IssueTracker/IssueTrackerFormCtrl.vue';

const newIssue = ref({});
</script>
<template>
  <pre>{{ newIssue }}</pre>
  <issueTrackerForm :newIssue="newIssue" />
</template>
