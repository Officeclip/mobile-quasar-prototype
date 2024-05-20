<script lang="ts" setup>
import { computed } from 'vue';
import { useTaskSummaryStore } from '../../stores/task/taskSummaryStore';
import TaskSummaryItem from '../../components/tasks/TaskSummaryItem.vue';

const props = defineProps(['parent']);

const taskSummaryStore = useTaskSummaryStore();
taskSummaryStore.getTasksByParent(props.parent.parentObjectId);

const taskSummaries = computed(() => {
  return taskSummaryStore.taskSummaries;
});
</script>

<template>
  <q-item v-for="task in taskSummaries" :key="task.id" class="q-pa-sm">
    <TaskSummaryItem :task="task" class="full-width" />
  </q-item>
</template>
