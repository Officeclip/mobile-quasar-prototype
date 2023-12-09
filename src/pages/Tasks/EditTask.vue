<!-- Cleaned up using Google Bard -->
<script lang="ts" setup>
import { computed, ComputedRef, onMounted, ref, Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TasksForm from 'components/tasks/tasksFormCtrl.vue';
import { useTaskDetailsStore } from 'stores/task/taskDetailsStore';
import { taskDetails } from 'src/models/task/taskDetails';
import { useTaskSummaryStore } from 'stores/task/taskSummaryStore';

const tasksDetailStore = useTaskDetailsStore();
const taskSummaryStore = useTaskSummaryStore();


const route = useRoute();
const router = useRouter();

const id = ref<string | string[]>(route.params.id);

const task: Ref<taskDetails> = computed(() => {
  return tasksDetailStore.TaskDetail;
});

onMounted(() => {
  tasksDetailStore.getTask((id.value.toString()));
});

function onSubmit(e: any) {
  e.preventDefault();
  const formData = new FormData(e.target);
  console.log(`onSubmit Task Value: ${task.value}`);

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

  tasksDetailStore.editTask(newTask);
  // taskSummaryStore.editTask(newTask);
  //router.push(`/taskDetails/${task.value?.id}`);
  router.go(-2)
}
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn color="white" dense flat icon="arrow_back" round @click="$router.go(-1)" />
        <q-toolbar-title>Edit Task</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form class="q-gutter-md" @submit="onSubmit">
        <div>
          <TasksForm :task-from-parent="task" />
          <q-btn class="q-ml-md q-mb-md" color="primary" label="Submit" type="submit" />
        </div>
      </q-form>
    </q-page-container>
  </q-layout>
</template>
