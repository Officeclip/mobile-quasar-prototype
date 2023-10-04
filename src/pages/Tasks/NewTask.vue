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
  const newDueDate = formData.get('dueDate');
  const newStartDate = formData.get('startDate')

  // note.value.isPrivate = (note.value.isPrivate === 'Yes')

  const newTask: taskDetails = {
    id: Number(),
    subject: task.value.subject,
    description: task.value.description,
    taskTypeId: task.value.taskTypeId,
    taskPriorityId: task.value.taskPriorityId,
    taskStatusId: task.value.taskStatusId,
    isPrivate: task.value.isPrivate,
    taskOwner: task.value.taskOwner,
    parentObjectServiceType: 14,
    parentObjectId: (Number(parentObjectId)),
    startDate: newStartDate?.toString(),
    dueDate: newDueDate?.toString(),
    createdDate: Date.now().toLocaleString(),
    regardingType: task.value.regardingType,
    regardingValue: task.value.regardingValue,
    assignee: task.value.assignee,
    taskOwnerSid: task.value.taskOwnerSid,
    remindTo: task.value.remindTo,
    remindBeforeMinutes: task.value.remindBeforeMinutes,
    repeatInfoText: task.value.repeatInfoText,
    recurrenceRule: task.value.recurrenceRule,
    tags: task.value.tags,
    subtasks: task.value.subtasks
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
