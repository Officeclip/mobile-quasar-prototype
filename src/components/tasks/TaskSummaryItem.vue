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
  background-color: #D83F31;
}

.Medium {
  background-color: #EE9322;
}

.Low {
  background-color: #F4E869;
}
</style>
<template>
  <q-item
    v-ripple
    :class="getTaskPriority(task.taskPriorityId)"
    :to="{ name: 'taskDetails', params: { id: task.id }}"
    clickable>
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
    <q-item-section side>
      <q-icon color="primary" name="chevron_right"/>
    </q-item-section>
  </q-item>


  <!--  <q-separator/>-->
  <!--  <pre>{{ task }}</pre>-->
</template>
