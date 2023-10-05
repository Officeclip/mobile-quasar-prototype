<!-- cleaned up with google bard with minor correction -->
<script lang="ts" setup>
import {computed, ComputedRef, onMounted, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import dateTimeHelper from '../../helpers/dateTimeHelper';
import {useTaskDetailsStore} from "stores/task/taskDetailsStore";
import {useTaskSummaryStore} from "stores/task/taskSummaryStore";
import AddSubtaskDialog from "components/tasks/addSubtaskDialog.vue";
import {subTask} from "src/models/task/subtask";
import SubtaskItem from "components/tasks/SubtaskItem.vue";

const taskDetailsStore = useTaskDetailsStore();
const taskSummaryStore = useTaskSummaryStore();

const isPrivate = ref<string>();
const id = ref<string | string[]>('0');

const taskDetail: ComputedRef<taskDetails> = computed(() => {
  if (taskDetailsStore.TaskDetail) return taskDetailsStore.TaskDetail;
  else {
    const emptyTaskDetail: taskDetails = {
      id: 0,
      subject: "No Subject",
      description: "No Description",
      createdDate: "Not Available",
      startDate: "Not Available",
      dueDate: "Not Available",
      modifiedDate: "Not Available",
      regardingType: 0,
      regardingValue: "Not Available",
      assignees: [],
      isPrivate: false,
      taskStatus: {
        id: "Not Available",
        name: "Not Available",
      },
      parentObject: {
        id: 0,
        serviceType: 0,
      },
      taskOwner: {
        name: "Not Available",
        sid: 0,
      },
      taskPriority: {
        id: "Not Available",
        name: "Not Available",
      },
      taskType: {
        id: "Not Available",
        name: "Not Available",
      },
      remindTo: "Not Available",
      remindBeforeMinutes: 0,
      repeatInfoText: "Not Available",
      recurrenceRule: "Not Available",
      tags: [],
      subtasks: [],
    };
    return emptyTaskDetail;
  }
});

onMounted(() => {
  const route = useRoute();
  // console.log('id=', route.params.id);
  id.value = route.params.id;
  taskDetailsStore.getTask(Number(route.params.id));
  // taskListStore.getTaskLists();
});

isPrivate.value = taskDetail.value?.isPrivate ? 'Yes' : 'No';


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

<style>

.chip-caption {
  position: absolute;
  top: -5px; /* Adjust as needed */
  left: 10px; /* Adjust as needed */
  font-size: 0.65rem; /* Adjust as needed */
  color: black; /* Adjust as needed */
  background-color: white; /* To match the background */
  padding: 0 4px; /* For slight padding around the text */
  z-index: 2;
}

</style>

<template>
  <q-layout view="hHh Lpr lFf">
    <q-header bordered class="bg-primary text-white" reveal>
      <q-toolbar>
        <q-btn dense flat icon="arrow_back" round @click="$router.go(-1)"/>
        <q-toolbar-title>Task Details</q-toolbar-title>
        <!--        <div v-if="!taskDetail?.isEditable">-->
        <!--          <q-btn dense disable flat icon="edit"-->
        <!--                 round>-->
        <!--            <q-tooltip class="bg-accent">Editing is disabled</q-tooltip>-->

        <!--          </q-btn>-->
        <!--          <q-btn dense disable flat icon="delete" round>-->
        <!--            <q-tooltip class="bg-accent">Deleting is disabled</q-tooltip>-->
        <!--          </q-btn>-->
        <!--        </div>-->
        <div v-if="taskDetail?.isEditable==null||taskDetail?.isEditable">
          <q-btn :to="{ name: 'editTask', params: { id: id } }" dense flat icon="edit"
                 round/>
          <q-btn dense flat icon="delete" round/>
        </div>

        <div v-else>
          <q-btn dense disable flat icon="edit"
                 round>
            <q-tooltip class="bg-accent">Editing is disabled</q-tooltip>

          </q-btn>
          <q-btn dense disable flat icon="delete" round>
            <q-tooltip class="bg-accent">Deleting is disabled</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-card class="q-ma-md" flat>
        <q-card-section class="text-h5">{{ taskDetail?.subject }}</q-card-section>

        <q-card-section>{{ taskDetail?.description }}</q-card-section>

        <q-separator inset/>

        <q-card-section class="row justify-between">
          <q-item>
            <q-item-section center side>
              <q-icon name="event"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Start Date</q-item-label>
              <q-item-label description>{{
                  taskDetail?.startDate
                    ? dateTimeHelper.extractDateFromUtc(taskDetail?.startDate)
                    : 'Not set'
                }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section center side>
              <q-icon name="event_available"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Due Date</q-item-label>
              <q-item-label description>{{
                  taskDetail?.dueDate
                    ? dateTimeHelper.extractDateFromUtc(taskDetail?.dueDate)
                    : 'Not set'
                }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-card-section>

        <q-separator inset/>

        <q-card-section>
          <div class="row justify-around q-gutter-sm">
            <div class="relative-position">
              <span class="chip-caption">Type</span>
              <q-chip square color="info" outline>{{ taskDetail?.taskType.name }}</q-chip>
            </div>
            <div class="relative-position">
              <span class="chip-caption">Priority</span>
              <q-chip square color="amber" outline>{{ taskDetail?.taskPriority.name }}</q-chip>
            </div>
            <div class="relative-position">
              <span class="chip-caption">Status</span>
              <q-chip square :color="taskDetail?.taskStatus.color" outline>
                {{ taskDetail?.taskStatus.name }}
              </q-chip>
            </div>
          </div>
        </q-card-section>

        <q-separator inset/>

        <q-item>
          <q-item-section center side>
            <q-icon name="group"/>
          </q-item-section>
          <q-item-section>
            <q-item-label class="q-pl-xs">Assignees</q-item-label>
            <div class="q-pt-xs">
              <q-chip square v-for="assignee in taskDetail?.assignees" :key="assignee" dense>{{ assignee.name }}</q-chip>
            </div>
          </q-item-section>
        </q-item>

        <q-separator inset/>

        <q-card-section>
          <div class="row justify-between">
            <q-item>
              <q-item-section center side>
                <q-icon name="repeat"/>
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Repeating</q-item-label>
                <q-item-label description>{{
                    taskDetail?.repeatInfoText || 'None'
                  }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item>

              <q-item-section>
                <q-item-label caption>Reminder</q-item-label>
                <q-item-label description>{{ taskDetail?.remindBeforeMinutes }} minutes before</q-item-label>
              </q-item-section>
              <q-item-section center side>
                <q-icon name="notifications_active"/>
              </q-item-section>
            </q-item>

          </div>

          <div class="row justify-between">
            <q-item>
              <q-item-section center side>
                <q-icon name="person"/>
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Owner</q-item-label>
                <q-item-label description>{{ taskDetail?.taskOwner.name }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label caption>Privacy</q-item-label>
                <q-item-label description>{{ isPrivate ? 'Private' : 'Public' }}</q-item-label>
              </q-item-section>
              <q-item-section center side>
                <q-icon :name="isPrivate ? 'lock' : 'lock_open'"/>
              </q-item-section>
            </q-item>
          </div>

          <div class="row justify-between">
            <q-item>
              <q-item-section center side>
                <q-icon name="label"/>
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Tags</q-item-label>
                <div>
                  <q-chip square v-for="tag in taskDetail?.tags" :key="tag" dense>{{ tag.name }}</q-chip>
                </div>
              </q-item-section>
            </q-item>
          </div>
          <div class="row justify-between">

          <q-item>
            <q-item-section center side>
              <q-icon name="info"/>
            </q-item-section>
            <q-item-section>
              <q-item-label caption>Regarding</q-item-label>
              <q-item-label description>{{taskDetail?.regardingType +': '+ taskDetail?.regardingValue }}</q-item-label>
            </q-item-section>

          </q-item>

          </div>
        </q-card-section>

        <q-toolbar class="bg-primary text-white shadow-2">
          <q-toolbar-title>Subtasks</q-toolbar-title>
          <q-btn dense flat icon="add" round @click="showAddSubtaskDialog=true"/>

        </q-toolbar>
        <q-list bordered class="rounded-borders">
          <q-item-label caption class="q-ma-sm">Pending</q-item-label>

          <div v-for="subtask in taskDetail?.subtasks" :key="subtask.id">
            <subtask-item v-if="!subtask.isCompleted" :subtask="subtask"/>
          </div>
          <q-separator spaced/>
          <q-item-label caption class="q-ma-sm">Completed</q-item-label>

          <div v-for="subtask in taskDetail?.subtasks" :key="subtask.id">
            <subtask-item v-if="subtask.isCompleted" :subtask="subtask"/>
          </div>
        </q-list>

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
