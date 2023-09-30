<script lang="ts" setup>
import TasksForm from '../../components/Tasks/TasksFormCtrl.vue';
import {useTasksStore} from 'stores/TasksStore';
import {ref} from 'vue'
import {useRoute, useRouter} from 'vue-router';
// import { TaskList } from '../models/taskList';

const router = useRouter();
const route = useRoute();
const parentObjectId = route.params.id
// const parentObjectServiceType = route.params.parentObjectServiceType

console.log('ParentObject as contact Id:', parentObjectId)
const tasksStore = useTasksStore()
const task = ref({
  subject: '',
  description: '',
  taskTypeName: '',
  taskPriorityName: '',
  taskStatusName: '',
  isPrivate: '',
  taskOwnerName: ''
});

function onSubmit(e: any) {
  e.preventDefault()
  const formData = new FormData(e.target);
  const newDueDate = formData.get('dueDate');
  const newStartDate = formData.get('startDate')

  // note.value.isPrivate = (note.value.isPrivate === 'Yes')

  const newTask = {
    id: Number(),
    subject: task.value.subject,
    description: task.value.description,
    taskTypeName: task.value.taskTypeName,
    taskPriorityName: task.value.taskPriorityName,
    startDate: newStartDate,
    dueDate: newDueDate,
    taskStatusName: task.value.taskStatusName,
    isPrivate: task.value.isPrivate === 'Yes',
    taskOwnerName: task.value.taskOwnerName,
    parentObjectServiceType: 14,
    parentObjectId: (Number(parentObjectId)),
  }
  // event.value.isAllDayEvent= newEvent.isAllDayEvent

  console.log('new task form values: ', newTask)
  tasksStore.addTask(newTask);
  router.push('/')
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
          <TasksForm :task="task"/>
          <q-btn class="q-ml-md q-mb-md q-mt-md" color="primary" label="Submit" type="submit"/>
          <q-btn class="q-ml-sm" color="primary" flat label="Reset" type="reset"/>
        </div>
      </q-form>
    </q-page-container>
  </q-layout>
</template>

<style scoped></style>
