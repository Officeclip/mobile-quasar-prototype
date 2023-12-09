<script lang="ts" setup>
import TasksForm from 'components/tasks/tasksFormCtrl.vue';
import { ref, Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { taskDetails } from 'src/models/task/taskDetails';
import { taskSummary } from 'src/models/task/taskSummary';
import { useTaskSummaryStore } from 'stores/task/taskSummaryStore';
import { useTaskDetailsStore } from 'stores/task/taskDetailsStore';

const router = useRouter();
const route = useRoute();

const parentObjectId = route.params.objectId ? route.params.objectId : -1;
const parentObjectServiceType = route.params.objectTypeId ? route.params.objectTypeId : -1;

console.log('ParentObject as contact Id:', parentObjectId)
const taskSummaryStore = useTaskSummaryStore();
const taskDetailsStore = useTaskDetailsStore();
const task: Ref<taskDetails> = ref({
    actualDuration: 0.0,
    completionDate: null,
    description: "",
    dueDate: "",
    estimatedDuration: 0.0,
    isLock: false,
    isPrivate: false,
    parent: {
      type: {
        id: "",
        name: ""
      },
      value: {
        id: "",
        name: ""
      }
    },
    id: "-1",
    startDate: "",
    subject: "",
    taskOwnerName: "",
    taskOwnerSid: "0",
    taskPriorityName: "",
    taskPriorityId: 0,
    taskStatusName: "",
    taskStatusId: 0,
    taskTypeName: "",
    taskTypeId: 0,
    assignees: [],
    tags: [],
    createdByUserSid: "0",
    createdDate: "",
    modifiedByUserSid: "0",
    modifiedDate: "",
    subTasks: [],
    security: {
      read: false,
      write: false,
      append: false,
      delete: false
    },
    remindTo: "",
    remindBeforeMinutes: 0,
    repeatInfoText: "",
    recurrenceRule: ""
});

function handleRRule(rrule: string) {
  task.value.recurrenceRule = rrule;
}

function handleRRuleText(rruleText: string) {
  task.value.repeatInfoText = rruleText;
}

function handleReminder(reminder: [string, number]) {
  task.value.remindTo = reminder[0];
  task.value.remindBeforeMinutes = reminder[1];
}

function onSubmit(e: any) {
  e.preventDefault()
  const formData = new FormData(e.target);
  const newDueDate = formData.get('dueDate')?.toString() ?? '';
  const newStartDate = formData.get('startDate')?.toString() ?? '';

  const newTask: taskDetails = {
    id: task.value.id,
    subject: task.value.subject,
    description: task.value.description,
    actualDuration: task.value.actualDuration,
    completionDate: task.value.completionDate,
    dueDate: task.value.dueDate,
    estimatedDuration: task.value.estimatedDuration,
    isLock: task.value.isLock,
    isPrivate: task.value.isPrivate,
    parent: task.value.parent,
    startDate:task.value.startDate,
    taskOwnerName:task.value.taskOwnerName,
    taskOwnerSid: task.value.taskOwnerSid,
    taskPriorityName: task.value.taskPriorityName,
    taskPriorityId: task.value.taskPriorityId,
    taskStatusName: task.value.taskStatusName,
    taskStatusId: task.value.taskStatusId,
    taskTypeName: task.value.taskTypeName,
    taskTypeId: task.value.taskTypeId,
    assignees: task.value.assignees,
    tags: task.value.tags, createdByUserSid: task.value.createdByUserSid,
    createdDate: task.value.createdDate,
    modifiedByUserSid: task.value.modifiedByUserSid,
    modifiedDate: task.value.modifiedDate,
    subTasks: task.value.subTasks,
    security: task.value.security,
    remindTo: task.value.remindTo,
    remindBeforeMinutes: task.value.remindBeforeMinutes,
    repeatInfoText: task.value.repeatInfoText,
    recurrenceRule: task.value.recurrenceRule
  }
  const newTaskSummary: taskSummary = {
    id: task.value.id.toString(),
    subject: task.value.subject,
    taskStatusName: task.value.taskStatusName,
    isPrivate: task.value.isPrivate,
    dueDate: newDueDate,
    taskPriorityName: task.value.taskPriorityName,
  }
  // event.value.isAllDayEvent= newEvent.isAllDayEvent

  console.log('new task form values: ', newTask)
  taskSummaryStore.addTask(newTaskSummary);
  taskDetailsStore.addTask(newTask);
  //router.push('/tasksList')
  router.go(-1)
}


</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn color="white" dense flat icon="arrow_back" round @click="$router.go(-1)">
        </q-btn>
        <q-toolbar-title> New Task</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form class="q-gutter-md" @submit="onSubmit">
        <div>
          <TasksForm :task-from-parent="task" @rrule-generated="handleRRule" @rrule-text-generated="handleRRuleText"
            @reminder-generated="handleReminder" />
          <q-btn class="q-ml-md q-mb-md q-mt-md" color="primary" label="Submit" type="submit" />
          <q-btn class="q-ml-sm" color="primary" flat label="Reset" type="reset" />
        </div>
      </q-form>
    </q-page-container>
  </q-layout>
</template>

<style scoped></style>
