<script lang="ts" setup>
import TasksForm from 'components/tasks/tasksFormCtrl.vue';
import {ref, Ref} from 'vue'
import {useRoute, useRouter} from 'vue-router';
import {taskDetails} from "src/models/task/taskDetails";
import {useTaskSummaryStore} from "stores/task/taskSummaryStore";
import {useTaskDetailsStore} from "stores/task/taskDetailsStore";

const router = useRouter();
const route = useRoute();
const parentObjectId = route.params.id
// const parentObjectServiceType = route.params.parentObjectServiceType

console.log('ParentObject as contact Id:', parentObjectId)
const taskSummaryStore = useTaskSummaryStore();
const taskDetailsStore = useTaskDetailsStore();
const task: Ref<taskDetails> = ref({
  subject: '',
  description: '',
  id: 0,
  createdDate: '',
  modifiedDate: '',
  startDate: '',
  dueDate: '',
  regardingType: 0,
  regardingValue: '',
  assignee: [],
  isPrivate: false,
  taskStatusId: '',
  parentObjectId: 0,
  parentObjectServiceType: 0,
  taskOwner: '',
  taskOwnerSid: 0,
  taskPriorityId: '',
  taskTypeId: '',
  remindTo: '',
  remindBeforeMinutes: 0,
  repeatInfoText: '',
  recurrenceRule: '',
  tags: [],
  subtasks: []
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
  const newDueDate = formData.get('dueDate')?.toString()??'';
  const newStartDate = formData.get('startDate')?.toString()??'';

  // note.value.isPrivate = (note.value.isPrivate === 'Yes')

  const newTask: taskDetails = {
    id: task.value.id,
    subject: task.value.subject,
    description: task.value.description,
    taskType: task.value.taskType,
    taskStatus: task.value.taskStatus,
    isPrivate: task.value.isPrivate,
    taskOwner: task.value.taskOwner,
    parentObject: task.value.parentObject,
    startDate: task.value.startDate,
    modifiedDate: new Date().toISOString(),
    dueDate: newDueDate,
    createdDate: newStartDate,
    regardingType: task.value.regardingType,
    regardingValue: task.value.regardingValue,
    assignees: task.value.assignees,
    remindTo: task.value.remindTo,
    remindBeforeMinutes: task.value.remindBeforeMinutes,
    repeatInfoText: task.value.repeatInfoText,
    recurrenceRule: task.value.recurrenceRule,
    tags: task.value.tags,
    subtasks: task.value.subtasks,
    taskPriority: task.value.taskPriority,
  }
  // event.value.isAllDayEvent= newEvent.isAllDayEvent

  console.log('new task form values: ', newTask)
  taskSummaryStore.addTask(newTask);
  taskDetailsStore.addTask(newTask);
  router.push('/tasksList')
}


</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn
          color="white"
          dense
          flat
          icon="arrow_back"
          round
          @click="$router.go(-1)">
        </q-btn>
        <q-toolbar-title> New Task</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form class="q-gutter-md" @submit="onSubmit">
        <div>
          <TasksForm :task="task"
                     @rrule-generated="handleRRule"
                     @rrule-text-generated="handleRRuleText"
                     @reminder-generated="handleReminder"/>
          <q-btn class="q-ml-md q-mb-md q-mt-md" color="primary" label="Submit" type="submit"/>
          <q-btn class="q-ml-sm" color="primary" flat label="Reset" type="reset"/>
        </div>
      </q-form>
    </q-page-container>
  </q-layout>
</template>

<style scoped></style>
