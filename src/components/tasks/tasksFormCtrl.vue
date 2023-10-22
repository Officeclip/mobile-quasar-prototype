<script lang="ts" setup>
import {computed, defineProps, onBeforeMount, ref, Ref} from 'vue';
import dateTimeHelper from '../../helpers/dateTimeHelper';
import {useTaskListsStore} from 'stores/task/taskListsStore';
import {taskDetails} from 'src/models/task/taskDetails';
import EventsRecurrenceDialog from 'components/Events/EventsRecurrenceDialog.vue';
import EventsReminderDialog from 'components/Events/EventsReminderDialog.vue';
import {regardingContact} from 'src/models/task/taskLists';

const props = defineProps<{
  task: taskDetails
}>();


const isPrivate = ref('');
console.log(`props.task: ${props.task}`);

const dueDate = ref('');
const startDate = ref('');

// eslint-disable-next-line vue/no-setup-props-destructure
dueDate.value = props.task.dueDate
// eslint-disable-next-line vue/no-setup-props-destructure
startDate.value = props.task.startDate

const formattedDueDate = computed(() => {
  return dateTimeHelper.extractDateFromUtc(dueDate.value);
})

const formattedDueDate2 = dueDate.value ? formattedDueDate : dueDate;

const formattedStartDate = computed(() => {
  return dateTimeHelper.extractDateFromUtc(startDate.value);
})

const formattedStartDate2 = startDate.value ? formattedStartDate : startDate;

isPrivate.value = props.task.isPrivate ? 'Yes' : 'No';

const taskListsStore = useTaskListsStore();
onBeforeMount(() => {
  taskListsStore.getTaskLists();
});

const recurrenceDialogOpened = ref(false);
const reminderDialogOpened = ref(false);

const emit = defineEmits([
  'rrule-generated',
  'reminder-generated',
  'rrule-text-generated',
]);

function handleRRuleString(rruleString: string) {
  console.log('Received RRule String:', rruleString);
  emit('rrule-generated', rruleString);
}

function handleRRuleText(rruleText: string) {
  console.log('Received RRule Plain Text:', rruleText);
  const repeatText = rruleText.charAt(0).toUpperCase() + rruleText.slice(1); //capitalize first letter
  repeatString.value = repeatText;
  emit('rrule-text-generated', repeatText);
}

function handleReminderData(reminderString: [string, number]) {
  console.log('Received Reminder String:', reminderString);
  emit('reminder-generated', reminderString);
}

function handleReminderText(reminderText: string) {
  reminderTextInfo.value = reminderText;
}

const repeatString = ref('Does not repeat');
const reminderTextInfo = ref('Reminder');

const shownOptions: Ref<regardingContact[]> = ref([]);

async function filterFn(val: string, update: any, abort: any) {
  if (val.length < 2) {
    abort();
    return;
  } else if (val.length === 2) {
    shownOptions.value = [];
    await taskListsStore.getRegardingContactListThatMatch(val);
    shownOptions.value = taskListsStore.regardingContacts;
  }

  update(() => {
    console.log('update');
    const needle = val.toLowerCase();
    shownOptions.value = taskListsStore.regardingContacts.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  });
}

</script>

<template>
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
                <q-date v-model="dueDate" mask='YYYY-MM-DD'>
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
                <q-date v-model="startDate" mask='YYYY-MM-DD'>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup color="primary" flat label="Close"/>
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-select
          v-model="task.taskType"
          :options="taskListsStore.TaskTypes"
          emit-value
          label="Task Type"
          map-options
          option-label="name"
          option-value="id"
        />

        <q-select
          v-model="task.taskPriority"
          :options="taskListsStore.TaskPriorities"
          emit-value
          label="Priority"
          map-options
          option-label="name"
          option-value="id"
        />

        <q-select
          v-model="task.taskStatus"
          :options="taskListsStore.TaskStatuses"
          emit-value
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
          v-model="task.taskOwner"
          :options="shownOptions"
          clearable
          emit-value
          hint="Minimum 2 characters to trigger filtering"
          input-debounce="0"
          label="Owned by"
          option-label="name"
          option-value="name"
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
          hint="Minimum 2 characters to trigger filtering"
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
