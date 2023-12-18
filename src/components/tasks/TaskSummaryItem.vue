<script lang="ts" setup>
import {onBeforeMount, ref} from 'vue';
import {taskSummary} from "src/models/task/taskSummary";
import {getPriorityColor, getPriorityIcon, getTaskStatusColor, getTaskStatusIcon} from "src/helpers/colorIconHelper"
import {useTaskSummaryStore} from "stores/task/taskSummaryStore";

const props = defineProps<{
  task: taskSummary
}>();

const taskSummaryStore = useTaskSummaryStore();


const taskDone = ref(false);
onBeforeMount(() => {
    taskDone.value = props.task.taskStatusName === 'Completed';
  }
);

function markTaskAsCompleted() {
  let completedTask: taskSummary = props.task;
  completedTask.taskStatusName = 'Completed';
  taskSummaryStore.editTask(completedTask);
  console.log(props.task.id + "Task Done")
}

function markTaskAsOpen() {
  let openTask: taskSummary = props.task;
  openTask.taskStatusName = 'Open';
  taskSummaryStore.editTask(openTask);
  console.log(props.task.id + "Task opened")
}

</script>

<template>
  <q-item
    v-ripple
    :to="{ name: 'taskDetails', params: { id: task.id }}"
    class="TaskCard"
  >
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
      <q-chip v-if="task.taskStatusName!='Completed'" clickable label="Mark as done" square
              @click.prevent="markTaskAsCompleted"/>

      <q-chip v-else clickable label="Mark as Open" square
              @click.prevent="markTaskAsOpen"/>

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
