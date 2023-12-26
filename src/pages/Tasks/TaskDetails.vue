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
import {taskDetails} from "src/models/task/taskDetails";
import {getPriorityColor, getPriorityIcon, getTaskStatusColor, getTaskStatusIcon} from "src/helpers/colorIconHelper";

const taskDetailsStore = useTaskDetailsStore();
const taskSummaryStore = useTaskSummaryStore();

const isPrivate = ref<string>();
const id = ref<string | string[]>('0');

const taskDetail: ComputedRef<taskDetails> = computed(() => {
  if (taskDetailsStore.TaskDetail) return taskDetailsStore.TaskDetail;
  else {
    const emptyTaskDetail: taskDetails = {
      actualDuration: 0.0,
      completionDate: '',
      description: "No Description",
      dueDate: "Not Available",
      estimatedDuration: 0.0,
      isLock: false,
      isPrivate: false,
      parent: {
        type: {
          id: "",
          name: ""
        },
        value: {
          id: "",
          name: ""
        }
      },
      id: "-1",
      startDate: "Not Available",
      subject: "No Subject",
      taskOwnerName: "Not Available",
      taskOwnerSid: "0",
      taskPriorityName: "Not Available",
      taskPriorityId: 0,
      taskStatusName: "-1",
      taskStatusId: 0,
      taskTypeName: "Not Available",
      taskTypeId: 0,
      assignees: [],
      tags: [],
      createdByUserSid: "0",
      createdDate: "Not Available",
      modifiedByUserSid: "0",
      modifiedDate: "Not Available",
      subTasks: [],
      security: {
        read: false,
        write: false,
        append: false,
        delete: false
      },
      remindTo: "Not Available",
      remindBeforeMinutes: 0,
      repeatInfoText: "Not Available",
      recurrenceRule: "Not Available"
    };
    return emptyTaskDetail;
  }
});
const pendingSubtasks = computed(() => {
  return taskDetail.value?.subTasks.filter(subtask => !subtask.isCompleted);
});

const completedSubtasks = computed(() => {
  return taskDetail.value?.subTasks.filter(subtask => subtask.isCompleted);
});

onMounted(() => {
  const route = useRoute();
  // console.log('id=', route.params.id);
  id.value = route.params.id;
  taskDetailsStore.getTask((route.params.id.toString()));
  // taskListStore.getTaskLists();
});

isPrivate.value = taskDetail.value?.isPrivate ? 'Yes' : 'No';


function deleteTask() {
  let taskId = id.value;
  console.log("Deleted: ID=" + taskId);
  // taskSummaryStore.deleteTask(taskId);
  // taskDetailsStore.deleteTask(taskId);
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
  top: -15px; /* Adjust as needed */
  left: 0; /* Adjust as needed */
  font-size: 0.65rem; /* Adjust as needed */
  color: black; /* Adjust as needed */
  background-color: white; /* To match the background */
  padding: 0 4px; /* For slight padding around the text */
  z-index: 2;
  opacity: 0.54;
}

</style>

<template>
  <q-layout view="hHh Lpr lFf">
    <q-header bordered class="bg-primary text-white" reveal>
      <q-toolbar>
        <q-btn dense flat icon="arrow_back" round @click="$router.go(-1)"/>
        <q-toolbar-title>Task Details</q-toolbar-title>
        <div v-if="taskDetail.security.write">
          <q-btn :to="{ name: 'editTask', params: { id: id } }" dense flat icon="edit"
                 round/>
        </div>
        <div v-else>
          <q-btn dense disable flat icon="edit"
                 round>
            <q-tooltip class="bg-accent">Editing is disabled</q-tooltip>
          </q-btn>
        </div>

        <div v-if="taskDetail.security.delete">

          <q-btn dense flat icon="delete" round @click="deleteTask"/>
        </div>
        <div v-else>
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
              <q-item-label caption>Start Date</q-item-label>
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
              <q-item-label caption>Due Date</q-item-label>
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
          <div class="row justify-around q-pt-sm">
            <div class="relative-position">
              <span class="chip-caption">Type</span>
              <q-chip outline square>{{ taskDetail?.taskTypeName }}</q-chip>
            </div>
            <div class="relative-position">
              <span class="chip-caption">Priority</span>
              <q-chip
                :color="getPriorityColor(taskDetail.taskPriorityName)"
                :icon-right="getPriorityIcon(taskDetail.taskPriorityName)"
                square text-color="white">
                {{ taskDetail.taskPriorityName }}
              </q-chip>
            </div>
            <div class="relative-position">
              <span class="chip-caption">Status</span>
              <q-chip
                :color="getTaskStatusColor(taskDetail.taskStatusCategory)"
                :icon-right="getTaskStatusIcon(taskDetail.taskStatusCategory)"
                square text-color="white">
                {{ taskDetail.taskStatusName }}
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
            <q-item-label caption class="q-pl-xs">Assignees</q-item-label>
            <div class="q-pt-xs">
              <q-chip v-for="assignee in taskDetail?.assignees" :key="assignee" dense square>{{
                  assignee.name
                }}
              </q-chip>
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
                <q-item-label description>{{ taskDetail?.taskOwnerName }}</q-item-label>
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
                  <q-chip v-for="tag in taskDetail?.tags" :key="tag" dense square>{{ tag.name }}</q-chip>
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
                <q-item-label description>{{
                    taskDetail?.parent.type.name + ": " + taskDetail?.parent.value.name
                  }}
                </q-item-label>
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
          <div v-for="subtask in pendingSubtasks" :key="subtask.id">
            <subtask-item :subtask="subtask"/>
          </div>
          <q-item-label v-if="pendingSubtasks.length===0" class="text-center text-grey">No pending tasks</q-item-label>

          <q-separator spaced/>

          <q-item-label caption class="q-ma-sm">Completed</q-item-label>
          <div v-for="subtask in completedSubtasks" :key="subtask.id">
            <subtask-item :subtask="subtask"/>
          </div>
          <q-item-label v-if="completedSubtasks.length===0" class="text-center text-grey">No completed tasks</q-item-label>
        </q-list>

      </q-card>
      <q-page-sticky :offset="[18, 18]" position="bottom-right">
        <q-fab color="purple" direction="up" icon="add" vertical-actions-align="right">
          <q-fab-action color="primary" icon="add_task" label="Add subtask" @click="showAddSubtaskDialog=true"/>
          <q-fab-action :to="{
                  name: 'newTask',
                  params: {
                    id: -1
                  }
                }" color="secondary" icon="add" label="Create New Task"/>
        </q-fab>
      </q-page-sticky>

      <q-dialog v-model="showAddSubtaskDialog">
        <add-subtask-dialog @save-subtask="addSubtask"/>
      </q-dialog>
    </q-page-container>
  </q-layout>
</template>
