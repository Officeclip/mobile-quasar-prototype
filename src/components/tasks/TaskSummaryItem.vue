<script lang="ts" setup>
import {taskSummary} from "src/models/task/taskSummary";
import {useTaskListsStore} from "stores/task/taskListsStore";
import {onBeforeMount} from 'vue';

const taskListStore = useTaskListsStore();

const props = defineProps<{
  task: taskSummary
}>();

onBeforeMount(() => {
  taskListStore.getTaskLists();
})

function getTaskStatusIcon(status: string) {
  switch (status) {
    case 'Open':
      return 'lock_open';
    case 'In Progress':
      return 'autorenew';
    case 'Pending':
      return 'hourglass_empty';
    case 'Completed':
      return 'check';
    default:
      return '';
  }
}

</script>

<style>
.TaskCard {
  background-color: #f4f4fa;
  border-radius: 10px;
  padding: 10px;
  margin: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.TaskCard:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  scale: 1.015;
}

.TaskTitle {
  font-size: 18px;
  font-weight: 600;
}

.DueDate {
  display: flex;
  align-items: center;
}

.DueIcon {
  margin-right: 5px;
}

.StatusAndPriority {
  display: flex;
  align-items: center;
}

.StatusLabel, .PriorityLabel {
  margin-right: 15px;
  display: flex;
  align-items: center;
}

.StatusIcon, .PriorityCircle {
  margin-left: 5px;
}

.PriorityCircle {
  border-radius: 50%;
  width: 15px;
  height: 15px;
  display: inline-block;
}

.High {
  background-color: #d85c5c;
}

.Medium {
  background-color: #ea9a49;
}

.Low {
  background-color: #85e56a;
}

.TaskDetails > * {
  margin-bottom: 5px;
}

.TaskDetails > :last-child {
  margin-bottom: 0;
}

</style>

<template>
  <q-item
    v-ripple
    :to="{ name: 'taskDetails', params: { id: task.id }}"
    class="TaskCard"
    clickable>

    <q-item-section class="TaskDetails">
      <q-item-label class="TaskTitle">
        {{ task.subject }}
      </q-item-label>

      <div class="DueDate">
        <q-icon class="DueIcon" name="event"/>
        <q-item-label>
          Due: {{ new Date(task.dueDate).toLocaleDateString() }}
        </q-item-label>
      </div>

      <div class="StatusAndPriority">
        <q-item-label class="StatusLabel">
          {{ task.taskStatusName }}
          <q-icon :name="getTaskStatusIcon(task.taskStatusName)" class="StatusIcon"/>
        </q-item-label>

        <q-item-label class="PriorityLabel">
          {{ task.taskPriorityName }}
          <div :class="[task.taskPriorityName] + ' PriorityCircle'"></div>
        </q-item-label>

      </div>
    </q-item-section>
  </q-item>
</template>

