<script lang="ts" setup>
import TasksForm from 'components/tasks/tasksFormCtrl.vue';
import { ref, Ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { taskDetails } from 'src/models/task/taskDetails';
import { useTaskDetailsStore } from 'stores/task/taskDetailsStore';
import { useQuasar } from 'quasar';
import OCSaveButton from 'src/components/OCcomponents/OC-SaveButton.vue';

const $q = useQuasar();

const router = useRouter();
const route = useRoute();

const parentObjectId = route.params.objectId ? route.params.objectId : '';
const parentObjectServiceType = route.params.objectTypeId
  ? route.params.objectTypeId
  : '';
const appName = route.params.appName ? route.params.appName : '';

const taskDetailsStore = useTaskDetailsStore();

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
      id: parentObjectServiceType as string,
      name: '',
    },
    value: {
      id: parentObjectId as string,
      name: '',
    },
  },
  id: '',
  startDate: '',
  subject: '',
  taskOwnerSid: null,
  taskPriorityId: '',
  taskStatusId: '',
  taskTypeId: '',
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

const childComponent = ref();

async function onSubmit(e: any) {
  try {
    if (!childComponent.value.validateAll()) return;
    const newTask = ref(task);
    await taskDetailsStore.addTask(newTask.value);
    router.go(-1);
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
        >
        </q-btn>
        <q-toolbar-title> New Task</q-toolbar-title>
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
