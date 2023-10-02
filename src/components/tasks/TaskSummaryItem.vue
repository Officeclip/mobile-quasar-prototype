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

onBeforeMount(() => {
  taskListStore.getTaskLists();
})
</script>
<style>
.High {
  background-color: red;
}
.Medium{
  background-color: orange;
}
.Low{
  background-color: yellow;
}
</style>
<template>
  <q-item v-ripple :to="{ name: 'taskDetails', params: { id: task.id }}" clickable :class="getTaskPriority(task.taskPriorityId)">
    <q-item-section>
      <q-item-label>
        {{ task.subject }}
      </q-item-label>
      <q-item-label caption>
        Due: {{ new Date(task.dueDate).toLocaleDateString() }}
      </q-item-label>
    </q-item-section>

    <q-item-section>
      <q-item-label> Owner: {{ task.taskOwner }}</q-item-label>
    </q-item-section>
    <q-item-section>
      <q-item-label>Priority: {{ task.taskPriorityId }}</q-item-label>
    </q-item-section>
    <q-item-section side>
      <q-icon color="primary" name="chevron_right"/>
    </q-item-section>
  </q-item>


  <q-separator/>
<!--  <pre>{{ task }}</pre>-->
</template>
