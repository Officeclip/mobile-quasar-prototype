<script lang="ts" setup>
import { computed, onBeforeMount, ref } from 'vue';
import { useTaskSummaryStore } from '../../stores/task/taskSummaryStore';
import TaskSummaryItem from '../../components/tasks/TaskSummaryItem.vue';

const props = defineProps(['parent']);

const emit = defineEmits(['numberOfTasks']);

const taskSummaryStore = useTaskSummaryStore();

const taskSummaries = ref({});

const taskSummariesCount = computed(() => {
  if (taskSummaryStore.taskSummaries == null) return 0;
  return taskSummaryStore.taskSummaries.length;
});

onBeforeMount(async () => {
  await taskSummaryStore.getTasksByParent(props.parent.parentObjectId);
  taskSummaries.value = taskSummaryStore.taskSummaries;
  emit('numberOfTasks', taskSummariesCount.value);
});
</script>

<template>
  <q-item v-for="task in taskSummaries" :key="task.id" class="q-pa-sm">
    <TaskSummaryItem :task="task" class="full-width" />
  </q-item>
</template>
