<!-- Cleaned up using Google Bard -->
<script lang="ts" setup>
import {computed, ComputedRef, onMounted, ref, Ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import TasksForm from 'components/tasks/tasksFormCtrl.vue';
import {useTaskDetailsStore} from 'stores/task/taskDetailsStore';
import {taskDetails} from 'src/models/task/taskDetails';
import {useTaskSummaryStore} from 'stores/task/taskSummaryStore';

const tasksDetailStore = useTaskDetailsStore();
const taskSummaryStore = useTaskSummaryStore();


const route = useRoute();
const router = useRouter();

const id = ref<string | string[]>(route.params.id);

const task: Ref<taskDetails> = computed(() => {
  return tasksDetailStore.TaskDetail;
});

onMounted(() => {
  tasksDetailStore.getTask(Number(id.value));
});

function onSubmit(e: any) {
  e.preventDefault();
  const formData = new FormData(e.target);
  console.log(`onSubmit Task Value: ${task.value}`);

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
    dueDate: task.value.dueDate,
    createdDate: task.value.createdDate,
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

  tasksDetailStore.editTask(newTask);
  // taskSummaryStore.editTask(newTask);
  router.push(`/taskDetails/${task.value?.id}`);
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
        />
        <q-toolbar-title>Edit Task</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form class="q-gutter-md" @submit="onSubmit">
        <div>
          <TasksForm :task="task"/>
          <q-btn
            class="q-ml-md q-mb-md"
            color="primary"
            label="Submit"
            type="submit"
          />
        </div>
      </q-form>
    </q-page-container>
  </q-layout>
</template>
