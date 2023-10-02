<script lang="ts" setup>
import {computed, onBeforeMount} from 'vue';
import {useTaskSummaryStore} from "stores/task/taskSummaryStore";
import {taskSummary} from "src/models/task/taskSummary";
import TaskSummaryItem from "components/tasks/TaskSummaryItem.vue";

const props = defineProps(['params', 'user', 'ownerFilter', 'assigneeFilter']);

const parentObjectId = computed(() => props.params.parentObjectId);
const parentObjectServiceType = computed(
  () => props.params.parentObjectServiceType
);
const taskSummaryStore = useTaskSummaryStore();

const getTasks = computed(() => {
  let filteredTasks = taskSummaryStore.taskSummaries;
  if (props.ownerFilter === true) {
    filteredTasks = filteredTasks.filter((task: taskSummary) => {
      return task.taskOwner === props.user;
    });
  }
  if (props.assigneeFilter === true) {
    filteredTasks = filteredTasks.filter((task: taskSummary) => {
      return task.assignee.includes(props.user);
    });
  }
  return filteredTasks;
});

onBeforeMount(() => {
  taskSummaryStore.getTasks(Number(parentObjectId.value), Number(parentObjectServiceType.value));
});

</script>
<template>
  <q-list v-for="task in getTasks" :key="task.id">
    <taskSummaryItem :task="task"/>
    <q-separator/>
  </q-list>

</template>
