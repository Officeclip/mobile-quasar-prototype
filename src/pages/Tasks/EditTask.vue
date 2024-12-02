<!-- Cleaned up using Google Bard -->
<script lang="ts" setup>
import { onMounted, ref, Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TasksForm from 'components/tasks/tasksFormCtrl.vue';
import { useTaskDetailsStore } from 'stores/task/taskDetailsStore';
import { taskDetails } from 'src/models/task/taskDetails';
import { useQuasar } from 'quasar';
import OCSaveButton from 'src/components/OCcomponents/OC-SaveButton.vue';

const $q = useQuasar();
const tasksDetailStore = useTaskDetailsStore();
const route = useRoute();
const router = useRouter();

const id = ref<string | string[]>(route.params.id);
const appName = route.params.appName;

//TODO: CR: 2024-05-17: nk: Fix the below type error?
const task: Ref<taskDetails> = ref(tasksDetailStore.TaskDetail);

// onMounted(async () => {
//   await tasksDetailStore.getTask(id.value.toString());
// });

onMounted(async () => {
  try {
    await tasksDetailStore.getTask(id.value.toString());
    const response = tasksDetailStore.TaskDetail;
    task.value = response;
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      await router.push({ path: '/tasksList' });
    });
  }
});

// function receiveTask(receivedTask: taskDetails) {
//   task.value = receivedTask;
// }
const childComponent = ref(null);

async function onSubmit(e: any) {
  try {
    if (!childComponent.value.validateAll()) return;
    // const newTask: taskDetails = {
    //   id: task.value.id,
    //   subject: task.value.subject,
    //   description: task.value.description,
    //   actualDuration: task.value.actualDuration,
    //   completionDate: task.value.completionDate,
    //   dueDate: task.value.dueDate,
    //   estimatedDuration: task.value.estimatedDuration,
    //   isLock: task.value.isLock,
    //   isPrivate: task.value.isPrivate,
    //   parent: task.value.parent,
    //   startDate: task.value.startDate,
    //   taskOwnerName: task.value.taskOwnerName,
    //   taskOwnerSid: task.value.taskOwnerSid,
    //   taskPriorityName: task.value.taskPriorityName,
    //   taskPriorityId: task.value.taskPriorityId,
    //   taskStatusName: task.value.taskStatusName,
    //   taskStatusId: task.value.taskStatusId,
    //   taskTypeName: task.value.taskTypeName,
    //   taskTypeId: task.value.taskTypeId,
    //   assignees: task.value.assignees,
    //   tags: task.value.tags,
    //   createdByUserSid: task.value.createdByUserSid,
    //   createdDate: task.value.createdDate,
    //   modifiedByUserSid: task.value.modifiedByUserSid,
    //   modifiedDate: task.value.modifiedDate,
    //   subTasks: [],
    //   security: task.value.security,
    //   reminder: task.value.reminder,
    //   recurrence: task.value.recurrence,
    //   taskStatusCategory: task.value.taskStatusCategory,
    // };

    const newTask = ref(task);
    await tasksDetailStore.editTask(newTask.value);
    router.go(-2);
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
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
          @click="router.go(-1)"
        />
        <q-toolbar-title>Edit Task</q-toolbar-title>
        <OCSaveButton @handleClick="onSubmit"></OCSaveButton>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form class="q-gutter-md" @submit="onSubmit">
        <div>
          <TasksForm
            v-if="task"
            :appName="appName.toString()"
            ref="childComponent"
            :taskFromParent="task"
          />
        </div>
      </q-form>
    </q-page-container>
  </q-layout>
</template>
