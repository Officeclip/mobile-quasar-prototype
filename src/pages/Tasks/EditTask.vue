<!-- Cleaned up using Google Bard -->
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useTasksStore } from '../../stores/TasksStore';
import { useRouter, useRoute } from 'vue-router';
import TasksForm from 'components/tasks/tasksFormCtrl.vue';

const tasksStore = useTasksStore();

const route = useRoute();
const router = useRouter();
console.log('EditTask Started');

const id = ref<string | string[]>(route.params.id);

const task = computed(() => {
  return tasksStore.Task;
});

onMounted(() => {
  tasksStore.getTask(Number(id.value));
});

function onSubmit(e: any) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const newDueDate = formData.get('dueDate');
  const newStartDate = formData.get('startDate')
  console.log(`onSubmit Task Value: ${task.value}`);

  const newtask = {
    id: task.value?.id,
    subject: task.value?.subject,
    description: task.value?.description,
    startDate: newStartDate,
    dueDate: newDueDate,
    taskTypeName: task.value?.taskTypeName,
    taskPriorityName: task.value?.taskPriorityName,
    taskStatusName: task.value?.taskStatusName,
    isPrivate: task.value?.isPrivate,
    taskOwnerName: task.value?.taskOwnerName,
    parentObjectServiceType: task.value?.parentObjectServiceType,
    parentObjectId: task.value?.parentObjectId,

  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  // tasksStore.editTask(task.value!);
  tasksStore.editTask<any>(newtask);
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
