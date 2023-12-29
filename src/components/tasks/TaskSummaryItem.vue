<script lang="ts" setup>
import {onBeforeMount, ref} from 'vue';
import {taskSummary} from "src/models/task/taskSummary";
import {getPriorityColor, getPriorityIcon, getTaskStatusColor, getTaskStatusIcon} from "src/helpers/colorIconHelper"
import {useTaskSummaryStore} from "stores/task/taskSummaryStore";

const props = defineProps<{
  task: taskSummary
}>();

const taskSummaryStore = useTaskSummaryStore();

const isCompleted = props.task.taskStatusCategory==='Completed'


const taskDone = ref(false);
onBeforeMount(() => {
    taskDone.value = props.task.taskStatusName === 'Completed';
  }
);

function markTaskAsCompleted() {
  let completedTask: taskSummary = props.task;
  completedTask.taskStatusName = 'Completed';
  taskSummaryStore.editTask(completedTask);
}

function markTaskAsOpen() {
  let openTask: taskSummary = props.task;
  openTask.taskStatusName = 'Open';
  taskSummaryStore.editTask(openTask);
}

function toggleTaskStatus() {
  if (taskDone.value) {
    markTaskAsOpen();
  } else {
    markTaskAsCompleted();
  }
}

</script>

<template>
  <q-item
    v-ripple
    :to="{ name: 'taskDetails', params: { id: task.id }}"
    class="TaskCard"
  >
    <q-item-section class="TaskDetails">
      <q-item-label class="TaskTitle" :class="{ 'StrikeThrough' : task.taskStatusName === 'Completed'}">
        {{ task.subject }}
      </q-item-label>

      <div class="DueDate">
        <q-icon class="DueIcon" name="event"/>
        <q-item-label>
          Due: {{ new Date(task.dueDate).toLocaleDateString() }}
        </q-item-label>
      </div>

      <div class="StatusAndPriority ">
        <q-chip
          :color="getTaskStatusColor(task.taskStatusCategory)"
          :icon-right="getTaskStatusIcon(task.taskStatusCategory)"
          square text-color="white">
          {{ task.taskStatusName }}
        </q-chip>

        <q-chip
          :color="getPriorityColor(task.taskPriorityName)"
          :icon-right="getPriorityIcon(task.taskPriorityName)"
          square text-color="white">
          {{ task.taskPriorityName }}
        </q-chip>
      </div>
    </q-item-section>

    <q-item-section class="col-auto">
      <q-checkbox
        v-model="taskDone"
        @update:model-value="toggleTaskStatus"
      />
    </q-item-section>

    <q-item-section side>
      <q-icon color="primary" name="chevron_right"/>
    </q-item-section>
  </q-item>
</template>

<style>
.TaskCard {
  background-color: #f4f4fa;
  border-radius: 10px;
  padding: 10px;
  margin: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}


.TaskTitle {
  font-size: 18px;
  font-weight: 600;
}

.StrikeThrough{
  text-decoration: line-through;
}

.DueDate {
  display: flex;
  align-items: center;
}

.DueIcon {
  margin-right: 5px;
}

.TaskDetails > * {
  margin-bottom: 5px;
}

.TaskDetails > :last-child {
  margin-bottom: 0;
}

</style>
