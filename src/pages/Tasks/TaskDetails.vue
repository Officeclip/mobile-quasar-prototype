<!-- cleaned up with google bard with minor correction -->
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import dateTimeHelper from '../../helpers/dateTimeHelper';
import { useTaskDetailsStore } from 'stores/task/taskDetailsStore';
import addEditSubtaskDialog from 'components/tasks/addEditSubtaskDialog.vue';
import { subTask } from 'src/models/task/subtask';
import SubtaskItem from 'components/tasks/SubtaskItem.vue';
import {
  getPriorityColor,
  getPriorityIcon,
  getTaskStatusColor,
  getTaskStatusIcon,
} from 'src/helpers/colorIconHelper';
import ConfirmationDialog from '../../components/general/ConfirmDelete.vue';
import { useQuasar } from 'quasar';
import drawer from '../../components/drawer.vue';

const taskDetailsStore = useTaskDetailsStore();
const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const myDrawer = ref();

const id = route.params.id;
const isLoaded = ref<boolean>(false);
const appName = route.params.appName;

onMounted(async () => {
  try {
    await taskDetailsStore.getTask(id as string);
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      await router.push({ path: '/tasksList' });
      await router.go(0);
    });
  } finally {
    isLoaded.value = true;
  }
});

const taskDetail = computed(() => {
  return taskDetailsStore?.taskDetail;
});

const pendingSubtasks = computed(() => {
  return taskDetail.value?.subTasks.filter((subtask) => !subtask.isCompleted);
});

const completedSubtasks = computed(() => {
  return taskDetail.value?.subTasks.filter((subtask) => subtask.isCompleted);
});

const formattedStartDate = computed(() => {
  return dateTimeHelper.formatDateTimeFromRestAPIForUI(
    taskDetail.value?.startDate as string,
    true
  );
});

const formattedEndDate = computed(() => {
  return dateTimeHelper.formatDateTimeFromRestAPIForUI(
    taskDetail.value?.dueDate as string,
    true
  );
});

const title = ref('Confirm');
const message = ref('Are you sure you want to delete this task?');
const showConfirmationDialog = ref(false);
const displayConfirmationDialog = () => {
  showConfirmationDialog.value = true;
};
const cancelConfirmation = () => {
  showConfirmationDialog.value = false;
};

const confirmDeletion = async () => {
  try {
    await taskDetailsStore.deleteTask(id as string);
    showConfirmationDialog.value = false;
    router.go(-1);
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      showConfirmationDialog.value = false;
    });
  }
};

const showAddSubtaskDialog = ref(false);

async function addSubtask(subtask: subTask) {
  try {
    await taskDetailsStore.addSubtask(subtask);
    showAddSubtaskDialog.value = false;
    window.location.reload();
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      showAddSubtaskDialog.value = true;
    });
  }
}
function toggleLeftDrawer() {
  if (myDrawer.value == null) return;
  myDrawer.value.toggleLeftDrawer();
}

const newSubtask = ref({
  id: '',
  parentId: id,
  title: '',
  description: '',
  assignee: {
    id: '',
    name: '',
  },
  isCompleted: false,
  completedDate: '',
});
</script>

<style>
.q-dialog__backdrop {
  backdrop-filter: blur(7px);
}

.chip-caption {
  position: absolute;
  top: -12.5px;
  font-size: 0.65rem;
  color: black;
  padding: 0 4px;
  opacity: 0.54;
}
</style>

<template>
  <q-layout view="lHh Lpr lFf" v-if="isLoaded">
    <q-header bordered class="bg-primary text-white" reveal height-hint="98">
      <q-toolbar>
        <q-btn dense flat icon="arrow_back" round @click="router.go(-1)" />
        <q-btn
          aria-label="Menu"
          dense
          flat
          icon="menu"
          round
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title>Task Details</q-toolbar-title>
        <div v-if="taskDetail?.security?.write">
          <q-btn
            :to="{ name: 'editTask', params: { id: id, appName: appName } }"
            dense
            flat
            icon="edit"
            round
          />
        </div>
        <div v-else>
          <q-btn dense disable flat icon="edit" round>
            <q-tooltip class="bg-accent">Editing is disabled</q-tooltip>
          </q-btn>
        </div>
        <div>
          <q-btn
            v-if="taskDetail?.security?.delete"
            color="white"
            dense
            flat
            icon="delete"
            round
            @click="displayConfirmationDialog"
          />
          <q-btn v-else dense disable flat icon="delete" round>
            <q-tooltip class="bg-accent">Deleting is disabled</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>
    <drawer ref="myDrawer" />
    <q-page-container>
      <q-card class="q-ma-md" flat>
        <q-card-section class="text-h5">{{
          taskDetail?.subject
        }}</q-card-section>
        <q-card-section>
          <div v-html="taskDetail?.description"></div>
        </q-card-section>
        <q-separator inset />
        <q-card-section class="row justify-between">
          <q-item>
            <q-item-section center side>
              <q-icon name="event" />
            </q-item-section>
            <q-item-section>
              <q-item-label caption>Start Date</q-item-label>
              <q-item-label description>{{ formattedStartDate }} </q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section center side>
              <q-icon name="event_available" />
            </q-item-section>
            <q-item-section>
              <q-item-label caption>Due Date</q-item-label>
              <q-item-label description>{{ formattedEndDate }} </q-item-label>
            </q-item-section>
          </q-item>
        </q-card-section>
        <q-separator inset />
        <q-card-section>
          <div class="row justify-around q-pt-sm">
            <div class="relative-position">
              <span class="chip-caption">Type</span>
              <q-chip outline square>{{ taskDetail?.taskTypeName }}</q-chip>
            </div>
            <div class="relative-position">
              <span class="chip-caption">Priority</span>
              <q-chip
                :color="getPriorityColor(taskDetail?.taskPriorityName as string)"
                :icon-right="getPriorityIcon(taskDetail?.taskPriorityName as string)"
                square
                text-color="white"
              >
                {{ taskDetail?.taskPriorityName }}
              </q-chip>
            </div>
            <div class="relative-position">
              <span class="chip-caption">Status</span>
              <q-chip
                :color="getTaskStatusColor(taskDetail?.taskStatusCategory as string)"
                :icon-right="getTaskStatusIcon(taskDetail?.taskStatusCategory as string)"
                square
                text-color="white"
              >
                {{ taskDetail?.taskStatusName }}
              </q-chip>
            </div>
          </div>
        </q-card-section>
        <q-separator inset />
        <q-item>
          <q-item-section center side>
            <q-icon name="group" />
          </q-item-section>
          <q-item-section>
            <q-item-label caption class="q-pl-xs">Assignees</q-item-label>
            <div class="q-pt-xs row">
              <q-chip
                v-for="assignee in taskDetail?.assignees"
                :key="assignee.id"
                dense
                square
              >
                {{ assignee.name }}
                <q-tooltip>{{ assignee.email }}</q-tooltip>
              </q-chip>
            </div>
          </q-item-section>
        </q-item>
        <q-separator inset />
        <q-card-section>
          <div class="row justify-between">
            <q-item>
              <q-item-section center side>
                <q-icon name="repeat" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Repeating</q-item-label>
                <q-item-label description>
                  <div v-html="taskDetail?.recurrence?.text"></div>
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="row justify-between">
            <q-item>
              <q-item-section center side>
                <q-icon name="person" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Owner</q-item-label>
                <q-item-label description>{{
                  taskDetail?.taskOwnerName
                }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label caption>Privacy</q-item-label>
                <q-item-label description>{{
                  taskDetail?.isPrivate ? 'Private' : 'Public'
                }}</q-item-label>
              </q-item-section>
              <q-item-section center side>
                <q-icon :name="taskDetail?.isPrivate ? 'lock' : 'lock_open'" />
              </q-item-section>
            </q-item>
          </div>
          <div class="row justify-between">
            <q-item>
              <q-item-section center side>
                <q-icon name="label" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Tags</q-item-label>
                <div>
                  <q-chip
                    v-for="tag in taskDetail?.tags"
                    :key="tag.id"
                    dense
                    square
                    >{{ tag.name }}</q-chip
                  >
                </div>
              </q-item-section>
            </q-item>
          </div>
          <div class="row justify-between">
            <q-item>
              <q-item-section center side>
                <q-icon name="info" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Regarding</q-item-label>
                <q-item-label description
                  >{{
                    taskDetail?.parent.type.name +
                    ': ' +
                    taskDetail?.parent.value.name
                  }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </q-card-section>
        <div v-if="pendingSubtasks?.length as number > 0">
          <q-toolbar class="bg-primary text-white shadow-2">
            <q-toolbar-title>Subtasks</q-toolbar-title>
            <q-btn
              dense
              flat
              icon="add"
              round
              @click="showAddSubtaskDialog = true"
            />
          </q-toolbar>
          <q-list bordered class="rounded-borders">
            <q-item-label caption class="q-ma-sm">Pending</q-item-label>
            <div v-for="subtask in pendingSubtasks" :key="subtask.id">
              <subtask-item
                :subtask="subtask"
                :taskSid="taskDetail?.id as string"
              />
            </div>
            <q-item-label
              v-if="pendingSubtasks?.length === 0"
              class="text-center text-grey"
              >No pending tasks</q-item-label
            >
            <q-separator spaced />
            <q-item-label caption class="q-ma-sm">Completed</q-item-label>
            <div v-for="subtask in completedSubtasks" :key="subtask.id">
              <subtask-item
                :subtask="subtask"
                :taskSid="taskDetail?.id as string"
              />
            </div>
            <q-item-label
              v-if="completedSubtasks?.length === 0"
              class="text-center text-grey"
              >No completed tasks
            </q-item-label>
          </q-list>
        </div>
        <div v-else>
          <q-btn
            color="primary"
            label="Add subtask"
            no-caps
            @click="showAddSubtaskDialog = true"
          ></q-btn>
        </div>
      </q-card>
      <q-page-sticky :offset="[18, 18]" position="bottom-right">
        <q-fab
          color="purple"
          direction="up"
          icon="add"
          vertical-actions-align="right"
        >
          <q-fab-action
            color="primary"
            icon="add_task"
            label="Add subtask"
            @click="showAddSubtaskDialog = true"
          />
          <q-fab-action
            :to="{
              name: 'newTask',
              params: {
                id: -1,
                objectTypeId: -1,
                objectId: -1,
              },
            }"
            color="secondary"
            icon="add"
            label="Create New Task"
          />
        </q-fab>
      </q-page-sticky>
      <q-dialog v-model="showAddSubtaskDialog">
        <add-edit-subtask-dialog
          :subtask="newSubtask"
          :taskSid="taskDetail?.id as string"
          @save-subtask="addSubtask"
        />
      </q-dialog>
    </q-page-container>
  </q-layout>
  <ConfirmationDialog
    v-if="showConfirmationDialog"
    :showConfirmationDialog="showConfirmationDialog"
    :title="title"
    :message="message"
    @cancel="cancelConfirmation"
    @confirm="confirmDeletion"
  />
</template>
