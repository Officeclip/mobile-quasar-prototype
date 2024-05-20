<script lang="ts" setup>
import { defineProps, onBeforeMount, ref, Ref, watch } from 'vue';
import { useTaskListsStore } from 'stores/task/taskListsStore';
import { taskDetails } from 'src/models/task/taskDetails';
import EventsRecurrenceDialog from 'components/Events/EventsRecurrenceDialog.vue';
import EventsReminderDialog from 'components/Events/EventsReminderDialog.vue';
import { userSummary } from 'src/models/userSummary';
import { useUserSummaryStore } from 'stores/userSummaryStore';
import { tag } from 'src/models/task/taskLists';
import Regarding from 'components/general/regardingComponent.vue';


const props = defineProps<{
  taskFromParent: taskDetails
}>();
const emit = defineEmits([
  'emit-task'
]);

const task: Ref<taskDetails> = ref(props.taskFromParent);
const userSummaryStore = useUserSummaryStore();
const taskListsStore = useTaskListsStore();


const repeatString = ref('Does not repeat');
const reminderTextInfo = ref('Reminder');
const recurrenceDialogOpened = ref(false);
const reminderDialogOpened = ref(false);

onBeforeMount(() => {
  taskListsStore.getTaskLists();
  userSummaryStore.getUserSummaries();
});


function handleRRuleString(rruleString: string) {
  task.value.recurrence.rule = rruleString;
}

function handleRRuleText(rruleText: string) {
  const repeatText = rruleText.charAt(0).toUpperCase() + rruleText.slice(1); //capitalize first letter
  repeatString.value = repeatText;
  task.value.recurrence.text = repeatText;
}

function handleReminderData(reminderString: [string, number]) {
  task.value.reminder.to = reminderString[0];
  task.value.reminder.beforeMinutes = reminderString[1];
}

function handleReminderText(reminderText: string) {
  reminderTextInfo.value = reminderText;
  reminderTextInfo.value = reminderText;
}

const shownOptions: Ref<userSummary[]> = ref([]);
const shownTagOptions: Ref<tag[]> = ref([]);

async function filterFn(val: string, update: any) {
  update(() => {
    const needle = val.toLowerCase();
    shownOptions.value = userSummaryStore.userSummaries.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  });
}

async function filterTagFn(val: string, update: any) {
  update(() => {
    const needle = val.toLowerCase();
    shownTagOptions.value = taskListsStore.tags.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  });
}

const taskType = ref({
  id: task.value.taskTypeId,
  name: task.value.taskTypeName
});
const taskStatus = ref({
  id: task.value.taskStatusId,
  name: task.value.taskStatusName,
  category: task.value.taskStatusCategory
});
const taskPriority = ref({
  id: task.value.taskPriorityId,
  name: task.value.taskPriorityName
});
const taskOwner = ref({
  id: task.value.taskOwnerSid,
  name: task.value.taskOwnerName
});

watch(taskType, () => {
  task.value.taskTypeId = taskType.value?.id;
  task.value.taskTypeName = taskType.value?.name;
});
watch(taskStatus, () => {
  task.value.taskStatusId = taskStatus.value?.id;
  task.value.taskStatusName = taskStatus.value?.name;
  task.value.taskStatusCategory = taskStatus.value?.category;
});
watch(taskPriority, () => {
  task.value.taskPriorityId = taskPriority.value?.id;
  task.value.taskPriorityName = taskPriority.value?.name;
});
watch(taskOwner, () => {
  task.value.taskOwnerSid = taskOwner.value?.id;
  task.value.taskOwnerName = taskOwner.value?.name;
});
watch(task.value, () => {
  emit('emit-task', task.value);
});
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <div>
    <div class="q-pa-md">
      <div class="q-gutter-y-md column">
        <q-input v-model="task.subject" :rules="[(val) => (val && val.length > 0) || 'Please type something']"
          label="Subject" lazy-rules placeholder="enter task subject" />

        <q-editor v-model="task.description" class="q-mt-none" label="Description" paragraph-tag="div"
          placeholder="type here...." />

        <q-input v-model="task.startDate" :rules="['date']" label="Start Date" mask="date">
          <template v-slot:prepend>
            <q-icon class="cursor-pointer" name="event">
              <q-popup-proxy cover transition-hide="scale" transition-show="scale">
                <q-date v-model="task.startDate">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup color="primary" flat label="Close" />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-input v-model="task.dueDate" :rules="['date']" label="Due Date" mask="date">
          <template v-slot:prepend>
            <q-icon class="cursor-pointer" name="event">
              <q-popup-proxy cover transition-hide="scale" transition-show="scale">
                <q-date v-model="task.dueDate">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup color="primary" flat label="Close" />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-select v-model="taskType" :options="taskListsStore.TaskTypes" label="Task Type" map-options
          option-label="name" option-value="id" />

        <q-select v-model="taskPriority" :options="taskListsStore.TaskPriorities" label="Priority" map-options
          option-label="name" option-value="id" />

        <q-select v-model="taskStatus" :options="taskListsStore.TaskStatuses" label="Status" map-options
          option-label="name" option-value="id" />

        <q-checkbox v-model="task.isPrivate" label="Private?" />

        <q-select v-model="taskOwner" :options="shownOptions" clearable hint="Start typing" input-debounce="0"
          label="Owned by" option-label="name" use-input @filter="filterFn">
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results</q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select v-model="task.assignees" :options="shownOptions" hint="Start typing" input-debounce="0"
          label="Assigned to" multiple option-label="name" option-value="name" use-chips use-input @filter="filterFn">
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results</q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select v-model="task.tags" :options="shownTagOptions" hint="Start typing" input-debounce="0" label="Tags"
          multiple option-label="name" use-chips use-input @filter="filterTagFn">
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results</q-item-section>
            </q-item>
          </template>
        </q-select>

        <Regarding v-model="task.parent" :regarding-parents="taskListsStore.RegardingParent" />

        <q-item class="q-pa-none" v-ripple clickable @click="recurrenceDialogOpened = true">
          <q-item-section avatar>
            <q-icon color="primary" name="repeat" size="sm" />
          </q-item-section>
          <q-item-section> {{ repeatString }}</q-item-section>
          <q-item-section side>
            <q-icon color="primary" name="chevron_right" />
          </q-item-section>
        </q-item>

        <q-item class="q-pa-none" v-ripple clickable @click="reminderDialogOpened = true">
          <q-item-section avatar>
            <q-icon color="primary" name="alarm" size="sm" />
          </q-item-section>
          <q-item-section>{{ reminderTextInfo }}</q-item-section>
          <q-item-section side>
            <q-icon color="primary" name="chevron_right" />
          </q-item-section>
        </q-item>
      </div>
    </div>
  </div>

  <q-dialog v-model="recurrenceDialogOpened">
    <EventsRecurrenceDialog @rrule-string-generated="handleRRuleString" @rrule-text-generated="handleRRuleText" />
  </q-dialog>
  <q-dialog v-model="reminderDialogOpened">
    <EventsReminderDialog @reminder-text-generated="handleReminderText" @reminder-data-generated="handleReminderData" />
  </q-dialog>
</template>
