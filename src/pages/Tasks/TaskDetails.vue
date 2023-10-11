<!-- cleaned up with google bard with minor correction -->
<script lang="ts" setup>
import {computed, onMounted, ref, Ref} from 'vue';
import {useRoute} from 'vue-router';
import dateTimeHelper from '../../helpers/dateTimeHelper';
import {useTaskDetailsStore} from "stores/task/taskDetailsStore";
import {taskDetails} from "src/models/task/taskDetails";
import {useTaskListsStore} from "stores/task/taskListsStore";
import {useTaskSummaryStore} from "stores/task/taskSummaryStore";

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
        <q-toolbar-title> Task details</q-toolbar-title>

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
          @click="taskSummaryStore.deleteTask(taskDetail?.id);taskDetailsStore.deleteTask(taskDetail?.id); $router.go(-1)"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-card bordered class="relative-position card-example" flat>
        <q-card-section class="q-pb-none">
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label caption>Subject</q-item-label>
                <q-item-label class="q-mb-sm">{{ taskDetail?.subject }}</q-item-label>

                <q-item-label caption>Description</q-item-label>
                <q-item-label class="q-mb-sm">
                  <div v-html="taskDetail?.description"></div>
                </q-item-label>
                <q-item-label caption>Start Date</q-item-label>
                <q-item-label class="q-mb-sm">{{
                    taskDetail?.startDate
                      ? dateTimeHelper.extractDateFromUtc(taskDetail?.startDate)
                      : 'YYYY'
                  }}
                </q-item-label>

                <q-item-label caption>Due Date</q-item-label>
                <q-item-label class="q-mb-sm">{{
                    taskDetail?.dueDate
                      ? dateTimeHelper.extractDateFromUtc(taskDetail?.dueDate)
                      : 'YYYY'
                  }}
                </q-item-label>

                <q-item-label caption>Task Type</q-item-label>
                <q-item-label class="q-mb-sm">{{ getTaskType() }}</q-item-label>

                <q-item-label caption>Priority</q-item-label>
                <q-item-label class="q-mb-sm">{{ getTaskPriority() }}</q-item-label>

                <q-item-label caption>Status</q-item-label>
                <q-item-label class="q-mb-sm">{{ getTaskStatus() }}</q-item-label>

                <q-item-label caption>Private</q-item-label>
                <q-item-label class="q-mb-sm">{{ isPrivate }}</q-item-label>

                <q-item-label caption>Owner</q-item-label>
                <q-item-label class="q-mb-sm">{{ taskDetail?.taskOwner }}</q-item-label>

                <q-item-label caption>Remind Before</q-item-label>
                <q-item-label class="q-mb-sm">{{ taskDetail?.remindBeforeMinutes }} minutes</q-item-label>

                <q-item-label caption>Repeat Information</q-item-label>
                <q-item-label class="q-mb-sm">{{
                    taskDetail?.repeatInfoText || taskDetail?.recurrenceRule || 'None'
                  }}
                </q-item-label>

                <q-item-label caption>Regarding</q-item-label>
                <q-item-label class="q-mb-sm">{{ taskDetail?.regardingType }}: {{
                    taskDetail?.regardingValue
                  }}
                </q-item-label>

                <q-item-label caption>Assignees</q-item-label>
                <q-item-label class="q-mb-sm">
                  <div v-for="assignee in taskDetail?.assignee" :key="assignee">{{ assignee }}</div>
                </q-item-label>

                <q-item-label caption>Tags</q-item-label>
                <q-item-label class="q-mb-sm">
                  <div v-for="tag in taskDetail?.tags" :key="tag">{{ tag }}</div>
                </q-item-label>

                <q-item-label caption>Subtasks</q-item-label>
                <q-item-label class="q-mb-sm">
                  <div v-for="subtask in taskDetail?.subtasks" :key="subtask">{{ subtask }}</div>
                </q-item-label>

              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-page-container>
    <pre>{{ taskDetail }}</pre>
  </q-layout>
</template>

<style></style>
