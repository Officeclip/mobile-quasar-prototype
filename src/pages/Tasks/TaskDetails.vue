<!-- cleaned up with google bard with minor correction -->
<script lang="ts" setup>
import {computed, ComputedRef, onMounted, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import dateTimeHelper from '../../helpers/dateTimeHelper';
import {useTaskDetailsStore} from "stores/task/taskDetailsStore";
import {taskDetails} from "src/models/task/taskDetails";
import {useTaskSummaryStore} from "stores/task/taskSummaryStore";
import AddSubtaskDialog from "components/tasks/addSubtaskDialog.vue";
import {subTask} from "src/models/task/subtask";

const taskDetailsStore = useTaskDetailsStore();
const taskSummaryStore = useTaskSummaryStore();
// const taskListStore = useTaskListsStore();
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

<template>
  <q-layout view="hHh Lpr lFf">
    <q-header bordered class="bg-primary text-white" reveal>
      <q-toolbar>
        <q-btn dense flat icon="arrow_back" round @click="$router.go(-1)"/>
        <q-toolbar-title>Task Details</q-toolbar-title>
        <div>
          <q-btn :to="{ name: 'editTask', params: { id: id } }" dense flat icon="edit" round/>
          <q-btn dense flat icon="delete" round @click="deleteTask(); $router.go(-1);"/>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-card class="q-ma-md" flat>
        <q-card-section class="text-h5">{{ taskDetail?.subject }}</q-card-section>

        <q-card-section>{{ taskDetail?.description}}</q-card-section>

        <q-separator inset></q-separator>

        <q-card-section>
          <q-item>
            <q-item-section side top>
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
            <q-item-section side top>
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

        <q-separator inset></q-separator>

        <q-card-section>
          <q-item>
            <q-item-section side top>
              <q-icon :name="isPrivate ? 'lock' : 'lock_open'"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Privacy</q-item-label>
              <q-item-label description>{{ isPrivate ? 'Private' : 'Public' }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-card-section>

        <q-separator inset></q-separator>

        <q-card-section>
          <div class="row items-center">
            <q-chip class="q-mr-sm" color="info" outline>{{ taskDetail?.taskType.name }}</q-chip>
            <q-chip class="q-mr-sm" color="amber" outline>{{ taskDetail?.taskPriority.name }}</q-chip>
            <q-chip :color="taskDetail?.taskStatus.color" class="q-mr-sm" outline>{{
                taskDetail?.taskStatus.name
              }}
            </q-chip>
          </div>
        </q-card-section>

        <q-separator inset></q-separator>

        <q-card-section>
          <div class="row q-col-gutter-sm">
            <q-chip v-for="assignee in taskDetail?.assignees" :key="assignee" dense>{{ assignee.name }}</q-chip>
          </div>
        </q-card-section>

        <q-card-section>
          <q-item>
            <q-item-section side top>
              <q-icon name="repeat"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Repeating</q-item-label>
              <q-item-label description>{{
                  taskDetail?.repeatInfoText || 'None'
                }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section side top>
              <q-icon name="notifications_active"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Reminder</q-item-label>
              <q-item-label description>{{ taskDetail?.remindBeforeMinutes }} minutes before</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section side top>
              <q-icon name="person"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Owner</q-item-label>
              <q-item-label description>{{ taskDetail?.taskOwner.name }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section side top>
              <q-icon name="label"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Tags</q-item-label>
              <div class="q-pt-xs">
                <q-chip v-for="tag in taskDetail?.tags" :key="tag" dense>{{ tag.name }}</q-chip>
              </div>
            </q-item-section>
          </q-item>
        </q-card-section>
      </q-card>

    </q-page-container>
  </q-layout>
</template>


<!--<template>-->
<!--  <q-layout view="lHh Lpr lFf">-->
<!--    <q-header bordered class="bg-primary text-white" reveal>-->
<!--      <q-toolbar>-->
<!--        <q-btn-->
<!--          dense-->
<!--          flat-->
<!--          icon="arrow_back"-->
<!--          round-->
<!--          @click="$router.go(-1)"-->
<!--        />-->
<!--        <q-toolbar-title>Task Details</q-toolbar-title>-->
<!--        <div>-->
<!--          <q-btn-->
<!--            :to="{ name: 'editTask', params: { id: id } }"-->
<!--            dense-->
<!--            flat-->
<!--            icon="edit"-->
<!--            round-->
<!--          />-->
<!--          <q-btn-->
<!--            dense-->
<!--            flat-->
<!--            icon="delete"-->
<!--            round-->
<!--            @click="deleteTask();  $router.go(-1);"-->
<!--          />-->
<!--        </div>-->
<!--      </q-toolbar>-->
<!--    </q-header>-->

<!--    <q-page-container>-->
<!--      <q-card flat class="q-ma-md">-->
<!--        <q-card-section>-->
<!--          <div class="text-h6 q-mb-md">{{ taskDetail?.subject }}</div>-->
<!--          <div class="q-mb-md" v-html="taskDetail?.description"></div>-->

<!--          <div class="q-mb-md">-->
<!--            <q-item-label caption>Start Date:</q-item-label>-->
<!--            <q-item-label>{{-->
<!--                taskDetail?.startDate-->
<!--                  ? dateTimeHelper.extractDateFromUtc(taskDetail?.startDate)-->
<!--                  : 'Not set'-->
<!--              }}-->
<!--            </q-item-label>-->
<!--          </div>-->

<!--          <div class="q-mb-md">-->
<!--            <q-item-label caption>Due Date:</q-item-label>-->
<!--            <q-item-label>{{-->
<!--                taskDetail?.dueDate-->
<!--                  ? dateTimeHelper.extractDateFromUtc(taskDetail?.dueDate)-->
<!--                  : 'Not set'-->
<!--              }}-->
<!--            </q-item-label>-->
<!--          </div>-->

<!--          <div class="q-mb-md">-->
<!--            <q-item-label caption>Private:</q-item-label>-->
<!--            <q-item-label>{{ isPrivate ? 'Yes' : 'No' }}</q-item-label>-->
<!--          </div>-->

<!--          <div class="q-mb-md">-->
<!--            <q-item-label caption>Task Type:</q-item-label>-->
<!--            <q-item-label>{{ taskDetail?.taskType.name }}</q-item-label>-->
<!--          </div>-->

<!--          <div class="q-mb-md">-->
<!--            <q-item-label caption>Priority:</q-item-label>-->
<!--            <q-item-label>{{ taskDetail?.taskPriority.name }}</q-item-label>-->
<!--          </div>-->

<!--          <div class="q-mb-md">-->
<!--            <q-item-label caption>Status:</q-item-label>-->
<!--            <q-item-label>{{ taskDetail?.taskStatus.name }}</q-item-label>-->
<!--          </div>-->

<!--          <div class="q-mb-md">-->
<!--            <q-item-label caption>Reminder:</q-item-label>-->
<!--            <q-item-label>{{ taskDetail?.remindBeforeMinutes }} minutes</q-item-label>-->
<!--          </div>-->

<!--          <div class="q-mb-md">-->
<!--            <q-item-label caption>Repeating:</q-item-label>-->
<!--            <q-item-label>{{-->
<!--                taskDetail?.repeatInfoText || taskDetail?.recurrenceRule || 'None'-->
<!--              }}-->
<!--            </q-item-label>-->
<!--          </div>-->

<!--          <div class="q-mb-md">-->
<!--            <q-item-label caption>Regarding:</q-item-label>-->
<!--            <q-item-label>{{ taskDetail?.regardingType }}: {{-->
<!--                taskDetail?.regardingValue-->
<!--              }}-->
<!--            </q-item-label>-->
<!--          </div>-->

<!--          <div class="q-mb-md">-->
<!--            <q-item-label caption>Assignees:</q-item-label>-->
<!--            <div>-->
<!--              <q-chip v-for="assignee in taskDetail?.assignees" :key="assignee" dense>-->
<!--                {{ assignee.name }}-->
<!--              </q-chip>-->
<!--            </div>-->
<!--          </div>-->

<!--          <div class="q-mb-md">-->
<!--            <q-item-label caption>Owner:</q-item-label>-->
<!--            <q-chip dense>{{ taskDetail?.taskOwner.name }}</q-chip>-->
<!--          </div>-->

<!--          <div class="q-mb-md">-->
<!--            <q-item-label caption>Tags:</q-item-label>-->
<!--            <div>-->
<!--              <q-chip v-for="tag in taskDetail?.tags" :key="tag" dense>-->
<!--                {{ tag.name }}-->
<!--              </q-chip>-->
<!--            </div>-->
<!--          </div>-->

<!--        </q-card-section>-->
<!--      </q-card>-->

<!--      <q-page-sticky :offset="[18, 18]" position="bottom-right">-->
<!--        <q-fab color="purple" icon="add" direction="up" vertical-actions-align="center">-->
<!--          <q-fab-action color="primary" icon="add_task" label="Add subtask" @click="showAddSubtaskDialog=true"/>-->
<!--          <q-fab-action :to="{ name: 'newTask', params: { id: -1 } }" color="secondary" icon="add" label="Create New Task"/>-->
<!--        </q-fab>-->
<!--      </q-page-sticky>-->
<!--      <q-dialog v-model="showAddSubtaskDialog">-->
<!--        <add-subtask-dialog @save-subtask="addSubtask"/>-->
<!--      </q-dialog>-->
<!--    </q-page-container>-->
<!--  </q-layout>-->
<!--</template>-->

<!--<template>-->
<!--  <q-layout view="lHh Lpr lFf">-->
<!--    <q-header bordered class="bg-primary text-white" height-hint="98" reveal>-->
<!--      <q-toolbar>-->
<!--        <q-btn-->
<!--          color="white"-->
<!--          dense-->
<!--          flat-->
<!--          icon="arrow_back"-->
<!--          round-->
<!--          @click="$router.go(-1)"-->
<!--        />-->
<!--        <q-toolbar-title>Task details</q-toolbar-title>-->
<!--        <q-btn-->
<!--          :to="{ name: 'editTask', params: { id: id } }"-->
<!--          color="white"-->
<!--          dense-->
<!--          flat-->
<!--          icon="edit"-->
<!--          round-->
<!--        />-->
<!--        <q-btn-->
<!--          color="white"-->
<!--          dense-->
<!--          flat-->
<!--          icon="delete"-->
<!--          round-->
<!--          @click="deleteTask();  $router.go(-1);"-->
<!--        />-->
<!--      </q-toolbar>-->
<!--    </q-header>-->

<!--    <q-page-container>-->
<!--      <q-card class="relative-position card-example" flat>-->
<!--        <q-card-section class="q-pb-none">-->
<!--          <q-list>-->
<!--            <q-item>-->
<!--              <q-item-section>-->
<!--                <q-item-label class="q-mb-sm text-h5">{{ taskDetail?.subject }}</q-item-label>-->
<!--                <q-item-label class="q-mb-sm">-->
<!--                  <div v-html="taskDetail?.description"/>-->
<!--                </q-item-label>-->
<!--                <div class="row">-->

<!--                  <div class="col-4">-->
<!--                    <q-item-label caption>Start Date:</q-item-label>-->
<!--                    <q-item-label>{{-->
<!--                        taskDetail?.startDate-->
<!--                          ? dateTimeHelper.extractDateFromUtc(taskDetail?.startDate)-->
<!--                          : 'YYYY'-->
<!--                      }}-->
<!--                    </q-item-label>-->
<!--                  </div>-->

<!--                  <div class="col-4">-->
<!--                    <q-item-label caption>Due Date:</q-item-label>-->
<!--                    <q-item-label>{{-->
<!--                        taskDetail?.dueDate-->
<!--                          ? dateTimeHelper.extractDateFromUtc(taskDetail?.dueDate)-->
<!--                          : 'YYYY'-->
<!--                      }}-->
<!--                    </q-item-label>-->
<!--                  </div>-->

<!--                  <div class="col-4">-->
<!--                    <q-item-label caption>Private</q-item-label>-->
<!--                    <q-item-label>{{ isPrivate }}</q-item-label>-->
<!--                  </div>-->
<!--                </div>-->

<!--                <div class="row">-->
<!--                  <div class="col-4">-->
<!--                    <q-item-label caption>Task Type</q-item-label>-->
<!--                    <q-item-label>{{ taskDetail?.taskType.name }}</q-item-label>-->
<!--                  </div>-->

<!--                  <div class="col-4">-->
<!--                    <q-item-label caption>Priority</q-item-label>-->
<!--                    <q-item-label>{{ taskDetail?.taskPriority.name }}</q-item-label>-->
<!--                  </div>-->

<!--                  <div class="col-4">-->
<!--                    <q-item-label caption>Status</q-item-label>-->
<!--                    <q-item-label>{{ taskDetail?.taskStatus.name }}</q-item-label>-->
<!--                  </div>-->
<!--                </div>-->

<!--                <div class="row">-->
<!--                  <div class="col-4">-->
<!--                    <q-item-label caption>Reminder</q-item-label>-->
<!--                    <q-item-label>{{ taskDetail?.remindBeforeMinutes }} minutes</q-item-label>-->
<!--                  </div>-->

<!--                  <div class="col-4">-->
<!--                    <q-item-label caption>Repeating</q-item-label>-->
<!--                    <q-item-label>{{-->
<!--                        taskDetail?.repeatInfoText || taskDetail?.recurrenceRule || 'None'-->
<!--                      }}-->
<!--                    </q-item-label>-->
<!--                  </div>-->

<!--                  <div class="col-4">-->
<!--                    <q-item-label caption>Regarding</q-item-label>-->
<!--                    <q-item-label>{{ taskDetail?.regardingType }}: {{-->
<!--                        taskDetail?.regardingValue-->
<!--                      }}-->
<!--                    </q-item-label>-->
<!--                  </div>-->
<!--                </div>-->

<!--                <div class="row">-->
<!--                  <div class="col-8">-->
<!--                    <q-item-label caption>Assignees</q-item-label>-->
<!--                    <q-item-label>-->
<!--                      <q-chip v-for="assignee in taskDetail?.assignees" :key="assignee" dense>{{-->
<!--                          assignee.name-->
<!--                        }}-->
<!--                      </q-chip>-->
<!--                    </q-item-label>-->
<!--                  </div>-->

<!--                  <div class="col-4">-->
<!--                    <q-item-label caption>Owner</q-item-label>-->
<!--                    <q-chip dense>{{ taskDetail?.taskOwner.name }}</q-chip>-->
<!--                  </div>-->
<!--                </div>-->

<!--                <q-item-label caption>Tags</q-item-label>-->
<!--                <q-item-label class="q-mb-sm">-->
<!--                  <q-chip v-for="tag in taskDetail?.tags" :key="tag" dense>{{ tag.name }}</q-chip>-->
<!--                </q-item-label>-->

<!--              </q-item-section>-->
<!--            </q-item>-->
<!--          </q-list>-->
<!--        </q-card-section>-->
<!--      </q-card>-->

<!--      <q-page-sticky :offset="[18, 18]" position="bottom-right">-->
<!--        <q-fab color="purple" direction="up" icon="add" vertical-actions-align="right">-->
<!--          <q-fab-action color="primary" icon="add_task" label="Add subtask" @click="showAddSubtaskDialog=true"/>-->
<!--          <q-fab-action :to="{-->
<!--            name: 'newTask',-->
<!--            params: {-->
<!--              id: -1,-->
<!--            },-->
<!--          }" color="secondary" icon="add" label="Create New Task"/>-->
<!--        </q-fab>-->
<!--      </q-page-sticky>-->

<!--      <q-dialog v-model="showAddSubtaskDialog">-->
<!--        <add-subtask-dialog @save-subtask="addSubtask"/>-->
<!--      </q-dialog>-->
<!--    </q-page-container>-->
<!--  </q-layout>-->
<!--</template>-->
