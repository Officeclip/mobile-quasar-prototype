<!-- Cleaned up using Google Bard -->
<script setup lang="ts">
import { ref, onMounted, computed, ComputedRef, Ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import TasksForm from 'components/tasks/tasksFormCtrl.vue';
import {useTaskDetailsStore} from "stores/task/taskDetailsStore";
import {taskDetails} from "src/models/task/taskDetails";
import {useTaskSummaryStore} from "stores/task/taskSummaryStore";

const tasksDetailStore = useTaskDetailsStore();
const taskSummaryStore = useTaskSummaryStore();

const route = useRoute();
const router = useRouter();
console.log('EditTask Started');

const id = ref<string | string[]>(route.params.id);

const task:ComputedRef<taskDetails> = computed(() => {
  return tasksDetailStore.TaskDetail;
});

onMounted(() => {
  tasksDetailStore.getTask(Number(id.value));
});

function onSubmit(e: any) {
  e.preventDefault();
  const formData = new FormData(e.target);
  console.log(`onSubmit Task Value: ${task.value}`);

  const newTask:taskDetails = {
    // id: task.value.id,
    // subject: task.value?.subject,
    // description: task.value?.description,
    // startDate: newStartDate,
    // dueDate: newDueDate,
    // taskTypeName: task.value?.taskTypeName,
    // taskPriorityName: task.value?.taskPriorityName,
    // taskStatusName: task.value?.taskStatusName,
    // isPrivate: task.value?.isPrivate,
    // taskOwnerName: task.value?.taskOwnerName,
    // parentObjectServiceType: task.value?.parentObjectServiceType,
    // parentObjectId: task.value?.parentObjectId,

    id: task.value.id,
    subject: task.value.subject,
    description: task.value.description,
    taskTypeId: task.value.taskTypeId,
    taskPriorityId: task.value.taskPriorityId,
    taskStatusId: task.value.taskStatusId,
    isPrivate: task.value.isPrivate,
    taskOwner: task.value.taskOwner,
    parentObjectServiceType: task.value.parentObjectServiceType,
    parentObjectId: task.value.parentObjectId,
    startDate: task.value.startDate,
    dueDate: task.value.dueDate,
    createdDate: task.value.createdDate,
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
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  // tasksStore.editTask(task.value!);
  tasksDetailStore.editTask(newTask);
  taskSummaryStore.editTask(newTask);
  router.push(`/taskDetails/${task.value?.id}`);
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
          icon="arrow_back"
        >
        </q-btn>
        <q-toolbar-title> Edit Task</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form @submit="onSubmit" class="q-gutter-md">
        <div>
          <TasksForm :task="task" />
          <q-btn
            class="q-ml-md q-mb-md"
            label="Submit"
            type="submit"
            color="primary"
          >
          </q-btn>
        </div>
      </q-form>
    </q-page-container>
  </q-layout>
</template>

<style></style>
