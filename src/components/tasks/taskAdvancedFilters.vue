<script lang="ts" setup>
import { onBeforeMount, ref, Ref } from 'vue';
import { useTaskListsStore } from 'stores/task/taskListsStore';
import { user } from 'src/models/task/taskLists';
import { useTaskSummaryStore } from 'stores/task/taskSummaryStore';
import { searchFilter } from 'src/models/task/searchFilter';
import { useSessionStore } from 'stores/SessionStore';

const emit = defineEmits(['advancedOptionsGenerated', 'filterCount']);

const props = defineProps<{
  parent: any;
  filterOptions: searchFilter;
}>();
const taskSummaryStore = useTaskSummaryStore();
const sessionStore = useSessionStore();

const advancedOptions: Ref<searchFilter> = ref({
  filterString: '',
  assignedToMe: false,
  dueDateValue: '',
  dueDateOption: '',
  modifiedDateValue: '',
  modifiedDateOption: '',
  statusId: '',
  priorityId: '',
  taskTypeId: '',
  assignedToId: '',
  ownedById: '',
  regardingTypeId: '',
  regardingValueId: '',
  showCompleted: false,
});

function filterNumber(filter: searchFilter) {
  let val = 0;
  val += filter.dueDateOption !== '' ? 1 : 0;
  val += filter.modifiedDateOption !== '' ? 1 : 0;
  val += filter.statusId ? 1 : 0;
  val += filter.priorityId ? 1 : 0;
  val += filter.taskTypeId ? 1 : 0;
  val += filter.assignedToId ? 1 : 0;
  val += filter.ownedById ? 1 : 0;
  val += filter.regardingTypeId ? 1 : 0;
  val += filter.regardingValueId ? 1 : 0;
  val += filter.showCompleted ? 1 : 0;

  return val;
}

function emitOptions() {
  console.log(
    `taskAdvancedFilters: emitOptions: advancedOptions ${JSON.stringify(
      advancedOptions.value
    )}`
  );
  taskSummaryStore.setFilter(advancedOptions.value);
  taskSummaryStore.resetPageNumber();
  taskSummaryStore.getTasksUpdated(true);

  emit('advancedOptionsGenerated', advancedOptions.value);
  emit('filterCount', filterNumber(advancedOptions.value));
}

const taskListsStore = useTaskListsStore();
onBeforeMount(() => {
  taskListsStore.getTaskLists();
  console.log(sessionStore.getSession());
  Object.assign(advancedOptions.value, props.filterOptions);
});

const dateOptions = [
  { label: 'On this day', value: 'EqualTo' },
  { label: 'Not on this day', value: 'NotEqualTo' },
  { label: 'After this day', value: 'GreaterThan' },
  { label: 'Before this day', value: 'LessThan' },
  { label: 'On or after this day', value: 'GreaterOrEqual' },
  { label: 'On or before this day', value: 'LessOrEqual' },
  { label: 'No date', value: 'isNull' },
  { label: 'Any date', value: 'isNotNull' },
];

const userList: Ref<user[]> = ref([]);

async function filterFn(val: string, update: any, abort: any) {
  if (val.length < 2) {
    abort();
    return;
  } else if (val.length === 2) {
    userList.value = [];
    await taskListsStore.getFilteredUsers(val);
    userList.value = taskListsStore.users;
  }

  update(() => {
    console.log('update');
    const needle = val.toLowerCase();
    userList.value = taskListsStore.users.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  });
}
</script>

<template>
  <q-card style="width: 700px; max-width: 80vw">
    <div class="q-pa-md row">
      <q-item-section>
        <q-item-label>Due Date</q-item-label>
        <q-input
          v-model="advancedOptions.dueDateValue"
          clearable
          label="Due Date"
          outlined
          type="date"
        />
        <q-select
          v-model="advancedOptions.dueDateOption"
          :options="dateOptions"
          clearable
          emit-value
          map-options
          option-label="label"
          option-value="value"
        />
      </q-item-section>

      <q-item-section>
        <q-item-label>Modified Date</q-item-label>
        <q-input
          v-model="advancedOptions.modifiedDateValue"
          clearable
          label="Modified Date"
          outlined
          type="date"
        />
        <q-select
          v-model="advancedOptions.modifiedDateOption"
          :options="dateOptions"
          clearable
          emit-value
          map-options
          option-label="label"
          option-value="value"
        />
      </q-item-section>
    </div>

    <div class="q-pa-md row">
      <q-item-section>
        <q-item-label>Status</q-item-label>
        <q-select
          v-model="advancedOptions.statusId"
          :options="taskListsStore.TaskStatuses"
          emit-value
          map-options
          option-label="name"
          option-value="id"
        />
      </q-item-section>

      <q-item-section>
        <q-item-label>Priority</q-item-label>
        <q-select
          v-model="advancedOptions.priorityId"
          :options="taskListsStore.TaskPriorities"
          emit-value
          map-options
          option-label="name"
          option-value="id"
        />
      </q-item-section>

      <q-item-section>
        <q-item-label>Task Type</q-item-label>
        <q-select
          v-model="advancedOptions.taskTypeId"
          :options="taskListsStore.TaskTypes"
          emit-value
          map-options
          option-label="name"
          option-value="id"
        />
      </q-item-section>
    </div>

    <div class="q-pa-md row">
      <q-item-section>
        <q-item-label>Assigned To</q-item-label>
        <q-select
          v-model="advancedOptions.assignedToId"
          :options="userList"
          clearable
          emit-value
          map-options
          option-label="name"
          option-value="id"
          use-input
          @filter="filterFn"
        />
      </q-item-section>

      <q-item-section>
        <q-item-label>Owned By</q-item-label>
        <q-select
          v-model="advancedOptions.ownedById"
          :options="userList"
          clearable
          emit-value
          map-options
          option-label="name"
          option-value="id"
          use-input
          @filter="filterFn"
        />
      </q-item-section>
    </div>
    <div class="q-pa-md row">
      <q-item-section>
        <div class="q-mr-md">
          <q-checkbox
            v-model="advancedOptions.showCompleted"
            label="Show completed tasks"
          />
        </div>
      </q-item-section>
    </div>
    <q-card-actions>
      <q-btn v-close-popup color="primary" label="Apply" @click="emitOptions" />
    </q-card-actions>
  </q-card>
</template>
