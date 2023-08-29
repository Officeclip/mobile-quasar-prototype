<script setup lang="ts">
import TasksForm from '../../components/Tasks/TasksFormCtrl.vue';
import { useTasksStore } from '../../stores/TasksStore';
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router';
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
  console.log(`onSubmit Task Value: ${task.value}`);

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
              @click="$router.go(-1)"
              flat
              round
              dense
              color="white"
              icon="arrow_back">
              </q-btn>
              <q-toolbar-title> New Task</q-toolbar-title>
          </q-toolbar>
      </q-header>
      <q-page-container>
          <q-form @submit="onSubmit" class="q-gutter-md">
              <div>
                  <TasksForm :task="task" />
                  <q-btn class="q-ml-md q-mb-md q-mt-md" label="Submit" type="submit" color="primary"></q-btn>
                  <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm"></q-btn>
              </div>
          </q-form>
      </q-page-container>
  </q-layout>
</template>

<style scoped></style>
