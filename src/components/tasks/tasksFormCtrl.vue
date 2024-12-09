<script lang="ts" setup>
import { defineProps, onBeforeMount, ref, Ref, computed } from 'vue';
import { useTaskListsStore } from 'stores/task/taskListsStore';
import { taskDetails } from 'src/models/task/taskDetails';
import EventsRecurrenceDialog from 'components/Events/EventsRecurrenceDialog.vue';
import { userSummary } from 'src/models/userSummary';
import { useUserSummaryStore } from 'stores/userSummaryStore';
import { tag } from 'src/models/task/taskLists';
import Regarding from 'components/general/regardingComponent.vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import dateTimeHelper from 'src/helpers/dateTimeHelper';
import OCItem from '../../components/OCcomponents/OC-Item.vue';

const props = defineProps({
  taskFromParent: {
    type: Object,
  },
  appName: {
    type: String,
  },
});

const task: Ref<taskDetails> = ref(props.taskFromParent);
const userSummaryStore = useUserSummaryStore();
const taskListsStore = useTaskListsStore();
const $q = useQuasar();
const router = useRouter();

const nameRef = ref();
const dateRef = ref();

const repeatString = ref('Does not repeat');
const recurrenceDialogOpened = ref(false);

const dateMask = 'YYYY-MM-DD';

const startDateModel = computed(() => {
  return dateTimeHelper.formatDateTimeFromRestAPIForUI(
    task.value?.startDate,
    true
  );
});

const dueDateModel = computed(() => {
  return dateTimeHelper.formatDateTimeFromRestAPIForUI(
    task.value?.dueDate,
    true
  );
});

const usersList: Ref<userSummary[]> = ref([]);
const tagOptions: Ref<tag[]> = ref([]);
const filterUsersList: Ref<userSummary[]> = ref([]);

onBeforeMount(async () => {
  try {
    await taskListsStore.getTaskLists();
    await userSummaryStore.getUserSummaries();
    usersList.value = filterUsersList.value = userSummaryStore.UserSummaries;
    tagOptions.value = taskListsStore.Tags;
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      await router.push({ path: '/tasksList' });
    });
  }
});

function handleRRuleString(rruleString: string) {
  task.value.recurrence.rule = rruleString;
}

function handleRRuleText(rruleText: string) {
  const repeatText = rruleText.charAt(0).toUpperCase() + rruleText.slice(1); //capitalize first letter
  repeatString.value = repeatText;
  task.value.recurrence.text = repeatText;
}

// const filterUsersList: Ref<userSummary[]> = ref([]);
async function filterUsersFn(val: string, update: any) {
  if (val === '') {
    update(() => {
      filterUsersList.value = usersList.value;
    });
  }
  update(() => {
    const needle = val.toLowerCase();
    filterUsersList.value = usersList.value.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  });
}

const filterTagOptions: Ref<tag[]> = ref([]);
async function filterTagFn(val: string, update: any) {
  if (val === '') {
    update(() => {
      filterTagOptions.value = tagOptions.value;
    });
  }
  update(() => {
    const needle = val.toLowerCase();
    filterTagOptions.value = tagOptions.value.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  });
}

const ruleDueDateGreaterThanStartDate = (val: string) => {
  if (!task.value.startDate || task.value.startDate.length === 0) return true;
  const isGreater = new Date(val) > new Date(task.value.startDate);
  return isGreater ? true : 'Due Date should be more than start date';
};

const validateAll = () => {
  nameRef.value.validate();
  dateRef.value.validate();
  return !(nameRef.value.hasError || dateRef.value.hasError);
};

const ruleNotEmpty = (val: string) => {
  const condition = val && val.length > 0;
  return condition ? true : 'Please fill in this field';
};

defineExpose({
  validateAll,
});

const regarding = computed(() => {
  return `${props.taskFromParent?.parent.type.name} : ${props.taskFromParent?.parent.value.name}`;
});

function createValue(newValue: string, done: any) {
  const id = Math.round(Math.random() * -1000).toString();
  if (newValue === '') {
    done();
    return;
  }
  done({ id: id, name: newValue }, 'toggle');
}
</script>

<template>
  <div>
    <q-list>
      <q-item class="column">
        <q-input
          ref="nameRef"
          v-model="task.subject"
          error-message="Please type subject"
          label="Subject"
          placeholder="enter task subject"
          :rules="[ruleNotEmpty]"
      /></q-item>
      <q-item class="column">
        <q-field v-model="task.description" label-slot borderless>
          <template #label>Description</template>
          <template #control>
            <q-editor
              style="color: black"
              class="q-mt-md full-width"
              v-model="task.description"
              paragraph-tag="div"
            ></q-editor>
          </template> </q-field
      ></q-item>
      <q-item class="column">
        <q-input v-model="startDateModel" label="Start Date" readonly>
          <template v-slot:prepend>
            <q-icon class="cursor-pointer" name="event">
              <q-popup-proxy
                cover
                transition-hide="scale"
                transition-show="scale"
              >
                <q-date v-model="task.startDate" :mask="dateMask"
                  ><div class="row items-center justify-end">
                    <q-btn v-close-popup color="primary" flat label="Close" />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template> </q-input
      ></q-item>
      <q-item class="column">
        <q-input
          ref="dateRef"
          v-model="dueDateModel"
          :rules="[ruleNotEmpty, ruleDueDateGreaterThanStartDate]"
          label="Due Date"
        >
          <template v-slot:prepend>
            <q-icon class="cursor-pointer" name="event">
              <q-popup-proxy
                cover
                transition-hide="scale"
                transition-show="scale"
              >
                <q-date v-model="task.dueDate" :mask="dateMask"
                  ><div class="row items-center justify-end">
                    <q-btn v-close-popup color="primary" flat label="Close" />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template> </q-input
      ></q-item>
      <q-item class="column">
        <q-select
          v-model="task.taskTypeId"
          :options="taskListsStore.TaskTypes"
          label="Task Type"
          map-options
          option-label="name"
          option-value="id"
          emit-value
        />
      </q-item>
      <q-item class="column">
        <q-select
          v-model="task.taskPriorityId"
          :options="taskListsStore.TaskPriorities"
          label="Priority"
          map-options
          option-label="name"
          option-value="id"
          emit-value
      /></q-item>
      <q-item class="column">
        <q-select
          v-model="task.taskStatusId"
          :options="taskListsStore.TaskStatuses"
          label="Status"
          map-options
          option-label="name"
          option-value="id"
          emit-value
        />
      </q-item>
      <q-item class="column">
        <q-checkbox v-model="task.isPrivate" label="Private?" />
      </q-item>
      <q-item class="column">
        <q-select
          v-model="task.taskOwnerSid"
          :options="filterUsersList"
          @filter="filterUsersFn"
          input-debounce="0"
          label="Owned by"
          option-label="name"
          option-value="id"
          emit-value
          map-options
          use-chips
          use-input
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results</q-item-section>
            </q-item>
          </template>
        </q-select></q-item
      >
      <q-item class="column">
        <q-select
          v-model="task.assignees"
          :options="filterUsersList"
          @filter="filterUsersFn"
          input-debounce="0"
          label="Assigned to"
          multiple
          option-label="name"
          option-value="id"
          use-chips
          use-input
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results</q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-item>
      <q-item class="column">
        <q-select
          v-model="task.tags"
          :options="filterTagOptions"
          input-debounce="0"
          label="Tags"
          multiple
          option-label="name"
          use-chips
          use-input
          @filter="filterTagFn"
          @new-value="createValue"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                not in the list press enter to add as new tag</q-item-section
              >
            </q-item>
          </template>
        </q-select>
      </q-item>
      <q-item>
        <Regarding
          v-if="appName === 'task'"
          v-model="task.parent"
          :regarding-parents="taskListsStore.RegardingParent"
      /></q-item>
      <OCItem
        v-if="appName !== 'task' && taskFromParent?.parent?.value?.name"
        title="Regarding"
        :value="regarding"
      />
      <q-item v-ripple clickable @click="recurrenceDialogOpened = true">
        <q-item-section avatar>
          <q-icon color="primary" name="repeat" size="sm" />
        </q-item-section>
        <q-item-section> {{ repeatString }}</q-item-section>
        <q-item-section side>
          <q-icon color="primary" name="chevron_right" />
        </q-item-section>
      </q-item>
    </q-list>
  </div>

  <q-dialog v-model="recurrenceDialogOpened">
    <EventsRecurrenceDialog
      @rrule-string-generated="handleRRuleString"
      @rrule-text-generated="handleRRuleText"
    />
  </q-dialog>
</template>
