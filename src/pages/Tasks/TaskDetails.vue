<!-- cleaned up with google bard with minor correction -->
<script lang="ts" setup>
import {computed, onMounted, ref, Ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import dateTimeHelper from '../../helpers/dateTimeHelper';
import {useTaskDetailsStore} from "stores/task/taskDetailsStore";
import {taskDetails} from "src/models/task/taskDetails";
import {useTaskListsStore} from "stores/task/taskListsStore";
import {useTaskSummaryStore} from "stores/task/taskSummaryStore";
import AddSubtaskDialog from "components/tasks/addSubtaskDialog.vue";
import {subTask} from "src/models/task/subtask";
import SubtaskItem from "components/tasks/SubtaskItem.vue";

const taskDetailsStore = useTaskDetailsStore();
const taskSummaryStore = useTaskSummaryStore();
const taskListStore = useTaskListsStore();
const isPrivate = ref<string>();
const id = ref<string | string[]>('0');

const taskDetail: Ref<taskDetails | undefined> = computed(() => {
  return taskDetailsStore.TaskDetail;
});

onMounted(() => {
  const route = useRoute();
  console.log('id=', route.params.id);
  id.value = route.params.id;
  taskDetailsStore.getTask(Number(route.params.id));
  taskListStore.getTaskLists();
});

isPrivate.value = taskDetail.value?.isPrivate ? 'Yes' : 'No';

function getTaskPriority() {
  return taskListStore.taskPriorities.find(
    taskPriority => taskPriority.id == taskDetail.value?.taskPriorityId)?.name;
}

function getTaskStatus() {
  return taskListStore.taskStatuses.find(
    status => status.id == taskDetail.value?.taskStatusId)?.name;
}

function getTaskType() {
  return taskListStore.taskTypes.find(
    taskType => taskType.id == taskDetail.value?.taskTypeId)?.name;
}

function deleteTask() {
  let taskId = id.value;
  console.log("ID=" + taskId);
  taskSummaryStore.deleteTask(taskId);
  taskDetailsStore.deleteTask(taskId);
}

const router = useRouter();

const showAddSubtaskDialog = ref(false);

function addSubtask(subtask: subTask) {
  taskDetailsStore.addSubtask(subtask);
}


</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header bordered class="bg-primary text-white" height-hint="98" reveal>
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
        <q-toolbar-title>Task details</q-toolbar-title>

        <q-btn
          :to="{ name: 'editTask', params: { id: id } }"
          color="white"
          dense
          flat
          icon="edit"
          round
        />
        <q-btn
          color="white"
          dense
          flat
          icon="delete"
          round
          @click="deleteTask();  $router.go(-1);"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-card class="relative-position card-example" flat>
        <q-card-section class="q-pb-none">
          <q-list>
            <q-item>
              <q-item-section>

                <q-item-label class="q-mb-sm text-h5">{{ taskDetail?.subject }}</q-item-label>
                <q-item-label class="q-mb-sm">
                  <div v-html="taskDetail?.description"/>
                </q-item-label>
                <div class="row">

                  <div class="col-4">
                    <q-item-label caption>Start Date:</q-item-label>
                    <q-item-label>{{
                        taskDetail?.startDate
                          ? dateTimeHelper.extractDateFromUtc(taskDetail?.startDate)
                          : 'YYYY'
                      }}
                    </q-item-label>
                  </div>

                  <div class="col-4">
                    <q-item-label caption>Due Date:</q-item-label>
                    <q-item-label>{{
                        taskDetail?.dueDate
                          ? dateTimeHelper.extractDateFromUtc(taskDetail?.dueDate)
                          : 'YYYY'
                      }}
                    </q-item-label>
                  </div>

                  <div class="col-4">
                    <q-item-label caption>Private</q-item-label>
                    <q-item-label>{{ isPrivate }}</q-item-label>
                  </div>
                </div>

                <div class="row">
                  <div class="col-4">
                    <q-item-label caption>Task Type</q-item-label>
                    <q-item-label>{{ getTaskType() }}</q-item-label>
                  </div>

                  <div class="col-4">
                    <q-item-label caption>Priority</q-item-label>
                    <q-item-label>{{ getTaskPriority() }}</q-item-label>
                  </div>

                  <div class="col-4">
                    <q-item-label caption>Status</q-item-label>
                    <q-item-label>{{ getTaskStatus() }}</q-item-label>
                  </div>
                </div>

                <div class="row">
                  <div class="col-4">
                    <q-item-label caption>Reminder</q-item-label>
                    <q-item-label>{{ taskDetail?.remindBeforeMinutes }} minutes</q-item-label>
                  </div>

                  <div class="col-4">
                    <q-item-label caption>Repeating</q-item-label>
                    <q-item-label>{{
                        taskDetail?.repeatInfoText || taskDetail?.recurrenceRule || 'None'
                      }}
                    </q-item-label>
                  </div>

                  <div class="col-4">
                    <q-item-label caption>Regarding</q-item-label>
                    <q-item-label>{{ taskDetail?.regardingType }}: {{
                        taskDetail?.regardingValue
                      }}
                    </q-item-label>
                  </div>
                </div>

                <div class="row">
                  <div class="col-8">
                    <q-item-label caption>Assignees</q-item-label>
                    <q-item-label>
                      <q-chip v-for="assignee in taskDetail?.assignee" :key="assignee" dense>{{ assignee }}</q-chip>
                    </q-item-label>
                  </div>

                  <div class="col-4">
                    <q-item-label caption>Owner</q-item-label>
                    <q-chip dense>{{ taskDetail?.taskOwner }}</q-chip>
                  </div>
                </div>

                <q-item-label caption>Tags</q-item-label>
                <q-item-label class="q-mb-sm">
                  <div v-for="tag in taskDetail?.tags" :key="tag">{{ tag }}</div>
                </q-item-label>

                <q-toolbar class="bg-primary text-white shadow-2">
                  <q-toolbar-title>Subtasks</q-toolbar-title>
                  <q-btn dense flat icon="add" round @click="showAddSubtaskDialog=true"/>

                </q-toolbar>
                <q-list bordered class="rounded-borders">
                  <div v-for="subtask in taskDetail?.subtasks" :key="subtask.id">
                    <subtask-item v-if="!subtask.isCompleted" :subtask="subtask"/>
                  </div>
                  <q-separator spaced/>
                  <div v-for="subtask in taskDetail?.subtasks" :key="subtask.id">
                    <subtask-item v-if="subtask.isCompleted" :subtask="subtask"/>
                  </div>
                </q-list>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <q-page-sticky :offset="[18, 18]" position="bottom-right">
        <q-fab color="purple" direction="up" icon="add" vertical-actions-align="right">
          <q-fab-action color="primary" icon="add_task" label="Add subtask" @click="showAddSubtaskDialog=true"/>
          <q-fab-action :to="{
            name: 'newTask',
            params: {
              id: -1,
            },
          }" color="secondary" icon="add" label="Create New Task"/>
        </q-fab>

      </q-page-sticky>


      <q-dialog v-model="showAddSubtaskDialog">
        <add-subtask-dialog @save-subtask="addSubtask"/>
      </q-dialog>


    </q-page-container>
  </q-layout>
</template>
