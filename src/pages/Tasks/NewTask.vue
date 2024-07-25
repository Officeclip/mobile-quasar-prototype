<script lang="ts" setup>
import TasksForm from 'components/tasks/tasksFormCtrl.vue';
import { ref, Ref } from 'vue';
import { useRouter } from 'vue-router';
import { taskDetails } from 'src/models/task/taskDetails';
import { taskSummary } from 'src/models/task/taskSummary';
import { useTaskSummaryStore } from 'stores/task/taskSummaryStore';
import { useTaskDetailsStore } from 'stores/task/taskDetailsStore';
import { useQuasar } from 'quasar';
import { formatDistanceStrictWithOptions } from 'date-fns/fp';
import format from 'date-fns/format';
import OCSaveButton from 'src/components/OCcomponents/OC-SaveButton.vue';

const $q = useQuasar();

const router = useRouter();

const taskSummaryStore = useTaskSummaryStore();
const taskDetailsStore = useTaskDetailsStore();

//TODO: CR: 2024-05-17: nk: Fix the below type error?
const task: Ref<taskDetails> = ref({
  actualDuration: 0.0,
  completionDate: '',
  description: '',
  dueDate: '',
  estimatedDuration: 0.0,
  isLock: false,
  isPrivate: false,
  parent: {
    type: {
      id: '',
      name: '',
    },
    value: {
      id: '',
      name: '',
    },
  },
  id: '',
  startDate: '',
  subject: '',
  taskOwnerName: '',
  taskOwnerSid: '0',
  taskPriorityName: '',
  taskPriorityId: 0,
  taskStatusName: '',
  taskStatusCategory: '',
  taskStatusId: 0,
  taskTypeName: '',
  taskTypeId: 0,
  assignees: [],
  tags: [],
  createdByUserSid: '0',
  createdDate: '',
  modifiedByUserSid: '0',
  modifiedDate: '',
  subTasks: [],
  security: {
    read: true,
    write: true,
    append: false,
    delete: true,
  },
  reminder: {
    to: '',
    beforeMinutes: 0,
  },
  recurrence: {
    text: '',
    rule: '',
  },
});

function receiveTask(receivedTask: taskDetails) {
  task.value = receivedTask;
}

async function onSubmit(e: any) {
  // e.preventDefault();
  console.log('*** NewTask:onSubmit(...): ***');

  try {
    const formData = new FormData(e.target);
    //const newDueDate = formData.get('dueDate')?.toString() ?? '';

    const newTask: taskDetails = {
      id: task.value.id,
      subject: task.value.subject,
      description: task.value.description,
      actualDuration: task.value.actualDuration,
      completionDate: task.value.completionDate,
      dueDate: format(new Date(task.value.dueDate), 'yyyy-MM-dd'),
      estimatedDuration: task.value.estimatedDuration,
      isLock: task.value.isLock,
      isPrivate: task.value.isPrivate,
      parent: task.value.parent,
      startDate: format(new Date(task.value.startDate), 'yyyy-MM-dd'),
      taskOwnerName: task.value.taskOwnerName,
      taskOwnerSid: task.value.taskOwnerSid,
      taskPriorityName: task.value.taskPriorityName,
      taskPriorityId: task.value.taskPriorityId,
      taskStatusName: task.value.taskStatusName,
      taskStatusId: task.value.taskStatusId,
      taskTypeName: task.value.taskTypeName,
      taskTypeId: task.value.taskTypeId,
      assignees: task.value.assignees,
      tags: task.value.tags,
      createdByUserSid: task.value.createdByUserSid,
      createdDate: task.value.createdDate,
      modifiedByUserSid: task.value.modifiedByUserSid,
      modifiedDate: task.value.modifiedDate,
      subTasks: task.value.subTasks,
      security: task.value.security,
      reminder: task.value.reminder,
      recurrence: task.value.recurrence,
      taskStatusCategory: task.value.taskStatusCategory,
    };
    console.log(`***New Task*** ${newTask.startDate}`);
    // const newTaskSummary: taskSummary = {
    //   id: task.value.id,
    //   subject: task.value.subject,
    //   taskStatusName: task.value.taskStatusName,
    //   isPrivate: task.value.isPrivate,
    //   dueDate: newDueDate,
    //   taskPriorityName: task.value.taskPriorityName,
    //   taskStatusCategory: task.value.taskStatusCategory
    // }
    //taskSummaryStore.addTask(newTaskSummary);
    await taskDetailsStore.addTask(newTask);
    router.go(-1);
  } catch (error) {
    console.log(`*** NewTask:onSubmit(...):catch: ${error} ***`);
    console.log(`---------${error}---------`);
    // $q.notify({
    //   message: error as string,
    //   color: 'red',
    // });
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      console.log('*** NewTask:onSubmit(...):onOK ***');
      // await router.push({ path: '/homePage' });
      // router.go(0);
    });
  }
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
          @click="$router.go(-1)"
        >
        </q-btn>
        <q-toolbar-title> New Task</q-toolbar-title>
        <OCSaveButton @handleClick="onSubmit"></OCSaveButton>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form class="q-gutter-md" @submit="onSubmit">
        <div>
          <TasksForm :task-from-parent="task" @emit-task="receiveTask" />
          <!-- <q-btn
            class="q-ml-md q-mb-md q-mt-md"
            color="primary"
            label="Submit"
            type="submit"
          /> -->
          <q-btn
            class="q-ml-sm"
            color="primary"
            flat
            label="Reset"
            type="reset"
          />
        </div>
      </q-form>
    </q-page-container>
  </q-layout>
</template>
