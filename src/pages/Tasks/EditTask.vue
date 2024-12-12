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
const task: Ref<taskDetails> = ref(null);

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

const childComponent = ref(null);

async function onSubmit(e: any) {
  try {
    if (!childComponent.value.validateAll()) return;
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
          <!-- <pre>{{ task }}</pre> -->
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
