<script lang="ts" setup>
import {computed, defineProps, onBeforeMount, ref, Ref, watch} from 'vue';
import dateTimeHelper from '../../helpers/dateTimeHelper';
import {useTaskListsStore} from "stores/task/taskListsStore";
import {taskDetails} from "src/models/task/taskDetails";
import EventsRecurrenceDialog from "components/Events/EventsRecurrenceDialog.vue";
import EventsReminderDialog from "components/Events/EventsReminderDialog.vue";
import {userSummary} from "src/models/userSummary";
import {useUserSummaryStore} from "stores/userSummaryStore";
import {tag} from "src/models/task/taskLists";
import Regarding from "components/general/regardingComponent.vue";

const props = defineProps<{
  taskFromParent: taskDetails
}>();
const task: Ref<taskDetails> = ref(props.taskFromParent);
const userSummaryStore = useUserSummaryStore();
const taskListsStore = useTaskListsStore();


const isPrivate = ref('');
console.log(`props.task: ${props.taskFromParent}`);

const dueDate = ref('');
const startDate = ref('');

// eslint-disable-next-line vue/no-setup-props-destructure
dueDate.value = task.value.dueDate
// eslint-disable-next-line vue/no-setup-props-destructure
startDate.value = task.value.startDate

const formattedDueDate = computed(() => {
  return dateTimeHelper.extractDateFromUtc(task.value.dueDate);
});

const formattedDueDate2 = task.value.dueDate ? formattedDueDate : dueDate.value;

const formattedStartDate = computed(() => {
  return dateTimeHelper.extractDateFromUtc(task.value.startDate);
})

const formattedStartDate2 = task.value.startDate ? formattedStartDate : startDate.value;

isPrivate.value = task.value.isPrivate ? 'Yes' : 'No';

onBeforeMount(() => {
  taskListsStore.getTaskLists();
  userSummaryStore.getUserSummaries();
});

const recurrenceDialogOpened = ref(false);
const reminderDialogOpened = ref(false);

const emit = defineEmits([
  'emit-task',
  'rrule-generated',
  'reminder-generated',
  'rrule-text-generated',
]);

// function emitTask(task: taskDetails) {
//   console.log('Emitted Task:', task);
//   emit('emit-task', task);
// }

function handleRRuleString(rruleString: string) {
  task.value.recurrenceRule = rruleString;
  console.log('Received RRule String:', rruleString);
  // emit('rrule-generated', rruleString);
}

function handleRRuleText(rruleText: string) {
  console.log('Received RRule Plain Text:', rruleText);
  const repeatText = rruleText.charAt(0).toUpperCase() + rruleText.slice(1); //capitalize first letter
  repeatString.value = repeatText;
  task.value.repeatInfoText = repeatText;
  // emit('rrule-text-generated', repeatText);
}

function handleReminderData(reminderString: [string, number]) {
  console.log('Received Reminder String:', reminderString);
  task.value.remindTo = reminderString[0];
  task.value.remindBeforeMinutes = reminderString[1];
  // emit('reminder-generated', reminderString);
}

function handleReminderText(reminderText: string) {
  reminderTextInfo.value = reminderText;
}

function regardingReceived(regardings: any) {
  console.log(regardings);
}

const repeatString = ref('Does not repeat');
const reminderTextInfo = ref('Reminder');

const shownOptions: Ref<userSummary[]> = ref([]);
const shownTagOptions: Ref<tag[]> = ref([]);

async function filterFn(val: string, update: any, abort: any) {
  update(() => {
    console.log('update');
    const needle = val.toLowerCase();
    shownOptions.value = userSummaryStore.userSummaries.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  });
}

async function filterTagFn(val: string, update: any, abort: any) {
  update(() => {
    console.log('update');
    const needle = val.toLowerCase();
    shownTagOptions.value = taskListsStore.tags.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  });
}

watch(task.value, (oldValue) => {
  console.log('emitted',task.value)
  emit('emit-task', task.value);
});

</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <div>
    <div class="q-pa-md">
      <div class="q-gutter-y-md column">
        <q-input
          v-model="task.subject"
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
          label="Subject"
          lazy-rules
          placeholder="enter task subject"
        />

        <q-editor
          v-model="task.description"
          class="q-mt-none"
          label="Description"
          paragraph-tag="div"
          placeholder="type here...."
        />

        <q-input v-model="formattedDueDate2" label="Due Date" name="dueDate">
          <template v-slot:prepend>
            <q-icon class="cursor-pointer" name="event">
              <q-popup-proxy cover transition-hide="scale" transition-show="scale">
                <q-date v-model="task.dueDate" mask='YYYY-MM-DD'>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup color="primary" flat label="Close"/>
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>


        <q-input
          v-model="formattedStartDate2" label="Start Date" name="startDate">
          <template v-slot:prepend>
            <q-icon class="cursor-pointer" name="event">
              <q-popup-proxy cover transition-hide="scale" transition-show="scale">
                <q-date v-model="task.startDate" mask='YYYY-MM-DD'>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup color="primary" flat label="Close"/>
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-select
          v-model="task.taskTypeName"
          :options="taskListsStore.TaskTypes"
          label="Task Type"
          map-options
          option-label="name"
          option-value="id"
        />

        <q-select
          v-model="task.taskPriorityName"
          :options="taskListsStore.TaskPriorities"
          label="Priority"
          map-options
          option-label="name"
          option-value="id"
        />

        <q-select
          v-model="task.taskStatusName"
          :options="taskListsStore.TaskStatuses"
          label="Status"
          map-options
          option-label="name"
          option-value="id"
        />
        <q-checkbox
          v-model="task.isPrivate"
          label="Mark the task private"
        />

        <q-select
          v-model="task.taskOwnerName"
          :options="shownOptions"
          clearable
          emit-value
          hint="Start typing"
          input-debounce="0"
          label="Owned by"
          option-label="name"
          use-input
          @filter="filterFn"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results</q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select
          v-model="task.assignees"
          :options="shownOptions"
          emit-value
          hint="Start typing"

          input-debounce="0"
          label="Assigned to"
          multiple
          option-label="name"
          option-value="name"
          use-chips
          use-input
          @filter="filterFn"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results</q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select
          v-model="task.tags"
          :options="shownTagOptions"
          emit-value
          hint="Start typing"
          input-debounce="0"
          label="Tags"
          multiple
          option-label="name"
          use-chips
          use-input
          @filter="filterTagFn"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results</q-item-section>
            </q-item>
          </template>
        </q-select>

        <!--        <Regarding :regarding-parents="taskListsStore.RegardingParent" @regarding-generated="regardingReceived"/>-->
        <Regarding v-model="task.parent" :regarding-parents="taskListsStore.RegardingParent"/>

        <q-item v-ripple clickable @click="recurrenceDialogOpened = true">
          <q-item-section avatar>
            <q-icon color="primary" name="repeat" size="sm"/>
          </q-item-section>
          <q-item-section> {{ repeatString }}</q-item-section>
          <q-item-section side>
            <q-icon color="primary" name="chevron_right"/>
          </q-item-section>
        </q-item>

        <q-item v-ripple clickable @click="reminderDialogOpened = true">
          <q-item-section avatar>
            <q-icon color="primary" name="alarm" size="sm"/>
          </q-item-section>
          <q-item-section>{{ reminderTextInfo }}</q-item-section>
          <q-item-section side>
            <q-icon color="primary" name="chevron_right"/>
          </q-item-section>
        </q-item>
      </div>
    </div>
  </div>

  <q-dialog v-model="recurrenceDialogOpened">
    <EventsRecurrenceDialog
      @rrule-string-generated="handleRRuleString"
      @rrule-text-generated="handleRRuleText"
    />
  </q-dialog>
  <q-dialog v-model="reminderDialogOpened">
    <EventsReminderDialog
      @reminder-text-generated="handleReminderText"
      @reminder-data-generated="handleReminderData"
    />
  </q-dialog>
</template>
