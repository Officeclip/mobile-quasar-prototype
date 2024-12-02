<script lang="ts" setup>
import { defineProps, onBeforeMount, ref, Ref, watch, computed } from 'vue';
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

const emit = defineEmits(['emit-task']);

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

onBeforeMount(async () => {
  try {
    await taskListsStore.getTaskLists();
    await userSummaryStore.getUserSummaries();
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

const taskType =
  task.value.id === ''
    ? ref()
    : ref({ id: task.value.taskTypeId, name: task.value.taskTypeName });

const taskStatus =
  task.value.id === ''
    ? ref()
    : ref({
        id: task.value.taskStatusId,
        name: task.value.taskStatusName,
        category: task.value.taskStatusCategory,
      });

const taskPriority =
  task.value.id === ''
    ? ref()
    : ref({
        id: task.value.taskPriorityId,
        name: task.value.taskPriorityName,
      });

const taskOwner = ref({
  id: task.value.taskOwnerSid,
  name: task.value.taskOwnerName,
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
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
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
          v-model="taskType"
          :options="taskListsStore.TaskTypes"
          label="Task Type"
          map-options
          option-label="name"
          option-value="id"
        />
      </q-item>
      <q-item class="column">
        <q-select
          v-model="taskPriority"
          :options="taskListsStore.TaskPriorities"
          label="Priority"
          map-options
          option-label="name"
          option-value="id"
      /></q-item>
      <q-item class="column">
        <q-select
          v-model="taskStatus"
          :options="taskListsStore.TaskStatuses"
          label="Status"
          map-options
          option-label="name"
          option-value="id"
        />
      </q-item>
      <q-item class="column">
        <q-checkbox v-model="task.isPrivate" label="Private?" />
      </q-item>
      <q-item class="column">
        <q-select
          v-model="taskOwner"
          :options="shownOptions"
          hint="Start typing"
          input-debounce="0"
          label="Owned by"
          option-label="name"
          use-chips
          use-input
          @filter="filterFn"
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
          :options="shownOptions"
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
      </q-item>
      <q-item class="column">
        <q-select
          v-model="task.tags"
          :options="shownTagOptions"
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
