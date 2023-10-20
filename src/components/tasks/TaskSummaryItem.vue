<script lang="ts" setup>
import {taskSummary} from "src/models/task/taskSummary";
import {useTaskListsStore} from "stores/task/taskListsStore";
import {onBeforeMount} from 'vue';

const taskListStore = useTaskListsStore();
const props = defineProps<{
  task: taskSummary
}>();

function getTaskPriority(priorityId: string) {
  return taskListStore.taskPriorities.find(taskPriority => taskPriority.id == priorityId)?.name;
}

function getTaskStatus(statusId: string) {
  return taskListStore.taskStatuses.find(taskStatus => taskStatus.id == statusId)?.name;
}

onBeforeMount(() => {
  taskListStore.getTaskLists();
})

</script>
<style>
.High {
  background-color: #d85c5c;
}

.Medium {
  background-color: #ea9a49;
}

.Low {
  background-color: #85e56a;
}
</style>
<template>
  <q-item
    v-ripple
    :class="getTaskPriority(task.taskPriorityId)"
    :to="{ name: 'taskDetails', params: { id: task.id }}"
    clickable>

    <q-item-section>
      <q-item-label style="font-size: 16px;">
        {{ task.subject }}
      </q-item-label>
      <q-item-label caption> Owner: {{ task.taskOwner }}</q-item-label>


    </q-item-section>

    <q-item-section>
      <q-item-label>
        Due: {{ new Date(task.dueDate).toLocaleDateString() }}
      </q-item-label>
      
    </q-item-section>

    <q-item-section>
      <q-item-label>
        {{ getTaskStatus(task.taskStatusId) }}
      </q-item-label>
    </q-item-section>
  </q-item>

</template>
