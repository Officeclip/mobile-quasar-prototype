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
      return 'hourglass_top';
    case 'Completed':
      return 'check';
    default:
      return '';
  }
}

function getPriorityIconAndColor(priority: string) {
  let icon = '';
  let color = '';


  // switch (priority) {
  //   case 'High':
  //     icon = 'arrow_upward';
  //     color = '#d85c5c';
  //     break;
  //   case 'Medium':
  //     icon = 'horizontal_rule';
  //     color = '#ea9a49';
  //     break;
  //   case 'Low':
  //     icon = 'arrow_downward';
  //     color = '#85e56a';
  //     break;
  //   default:
  //     break;
  // }
  // return {icon, color};


  switch (priority) {
    case 'High':
      return { icon: 'error', color: '#FF0000' };
    case 'Medium':
      return { icon: 'error_outline', color: '#FFA500' };
    case 'Low':
      return { icon: 'report_problem', color: '#008000' };
    default:
      return { icon: '', color: '' };
  }

  // switch (priority) {
  //   case 'High':
  //     return { icon: 'star', color: '#FF0000' };
  //   case 'Medium':
  //     return { icon: 'star_half', color: '#FFA500' };
  //   case 'Low':
  //     return { icon: 'star_outline', color: '#008000' };
  //   default:
  //     return { icon: '', color: '' };
  // }

  // switch (priority) {
  //   case 'High':
  //     return { icon: 'fiber_manual_record', color: '#FF0000' };
  //   case 'Medium':
  //     return { icon: 'lens', color: '#FFA500' };
  //   case 'Low':
  //     return { icon: 'radio_button_unchecked', color: '#008000' };
  //   default:
  //     return { icon: '', color: '' };
  // }

  // switch (priority) {
  //   case 'High':
  //     return { icon: 'looks_one', color: '#FF0000' };
  //   case 'Medium':
  //     return { icon: 'looks_two', color: '#FFA500' };
  //   case 'Low':
  //     return { icon: 'looks_3', color: '#008000' };
  //   default:
  //     return { icon: '', color: '' };
  // }


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
          <q-icon
            :name="getPriorityIconAndColor(task.taskPriorityName).icon"
            :style="{ color: getPriorityIconAndColor(task.taskPriorityName).color }"
          />
        </q-item-label>

      </div>
    </q-item-section>
  </q-item>
</template>

