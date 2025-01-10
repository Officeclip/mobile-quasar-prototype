<script lang="ts" setup>
import { onBeforeMount, ref, Ref, computed, watch } from 'vue';
import { useTaskListsStore } from 'stores/task/taskListsStore';
import { user } from 'src/models/task/taskLists';
import { useTaskSummaryStore } from 'stores/task/taskSummaryStore';
import { searchFilter } from 'src/models/task/searchFilter';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const emit = defineEmits([
  'advancedOptionsGenerated',
  'filterCount',
  'scrollLoadMore',
]);
const $q = useQuasar();
const router = useRouter();

const props = defineProps<{
  parent: any;
  filterOptions: searchFilter;
}>();

const taskSummaryStore = useTaskSummaryStore();
const taskListsStore = useTaskListsStore();
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
  val += (filter.dueDateOption ?? '').length > 0 ? 1 : 0;
  val += filter.modifiedDateOption !== '' ? 1 : 0;
  val += filter.statusId ? 1 : 0;
  val += filter.priorityId === '' || filter.priorityId === '0' ? 0 : 1;
  val += filter.taskTypeId === '' || filter.taskTypeId === '-1' ? 0 : 1;
  val += filter.assignedToId ? 1 : 0;
  val += filter.ownedById ? 1 : 0;
  val += filter.regardingTypeId ? 1 : 0;
  val += filter.regardingValueId ? 1 : 0;
  val += filter.showCompleted ? 1 : 0;
  return val;
}

function emitOptions() {
  taskSummaryStore.$reset();
  taskSummaryStore.setFilter(advancedOptions.value);
  taskSummaryStore.resetPageNumber();
  taskSummaryStore.getTasksUpdated(true);

  emit('advancedOptionsGenerated', advancedOptions.value);
  emit('filterCount', filterNumber(advancedOptions.value));
  emit('scrollLoadMore');
}

onBeforeMount(async () => {
  try {
    await taskListsStore.getTaskLists();
    Object.assign(advancedOptions.value, props.filterOptions);
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      await router.push({ path: '/HomePage' });
    });
  }
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
  userList.value = [];
  await taskListsStore.getFilteredUsers(val);
  userList.value = taskListsStore.users;

  update(() => {
    const needle = val.toLowerCase();
    userList.value = taskListsStore.users.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  });
}

// function showApplyButton() {
//   if (filterNumber(advancedOptions.value)) {
//     return true;
//   } else {
//     false;
//   }
// }
const isDisable = () => {
  const count = filterNumber(advancedOptions.value);
  if (!count) {
    return true;
  } else {
    false;
  }
};

const isDueDateDisabled = computed(() => !advancedOptions.value.dueDateValue);
const isModifiedDateDisabled = computed(
  () => !advancedOptions.value.modifiedDateValue
);

watch(
  () => [
    advancedOptions.value.dueDateValue,
    advancedOptions.value.modifiedDateValue,
  ],
  ([newDueDate, newModifiedDate]) => {
    if (!newDueDate) {
      advancedOptions.value.dueDateOption = '';
    }
    if (!newModifiedDate) {
      advancedOptions.value.modifiedDateOption = '';
    }
  }
);
</script>

<template>
  <q-card style="width: 700px; max-width: 80vw">
    <q-card-section class="row items-center">
      <span class="text-h6">Advanced Filter options</span>
      <q-space></q-space>
      <q-btn dense flat icon="close" v-close-popup> </q-btn>
    </q-card-section>
    <q-separator />
    <q-scroll-area style="height: 70vh">
      <div class="row">
        <q-item-section class="q-ma-sm q-pa-md shadow-2">
          <q-input
            v-model="advancedOptions.dueDateValue"
            clearable
            label="Due Date"
            outlined
            type="date"
          />
          <q-select
            filled
            label="Due Date Options"
            v-model="advancedOptions.dueDateOption"
            :options="dateOptions"
            clearable
            emit-value
            map-options
            option-label="label"
            option-value="value"
            hint="needed when due date is selected"
            :disable="isDueDateDisabled"
          />
        </q-item-section>
      </div>
      <div class="row">
        <q-item-section class="q-ma-sm q-pa-md shadow-2">
          <q-input
            v-model="advancedOptions.modifiedDateValue"
            clearable
            label="Modified Date"
            outlined
            type="date"
          />
          <q-select
            filled
            label="Modified Date Options"
            v-model="advancedOptions.modifiedDateOption"
            :options="dateOptions"
            clearable
            emit-value
            map-options
            option-label="label"
            option-value="value"
            hint="needed when modified date is selected"
            :disable="isModifiedDateDisabled"
          />
        </q-item-section>
      </div>
      <div class="q-pa-md row">
        <q-item-section>
          <q-select
            outlined
            label="Status"
            v-model="advancedOptions.statusId"
            :options="taskListsStore.TaskStatuses"
            emit-value
            map-options
            option-label="name"
            option-value="id"
          />
        </q-item-section>
      </div>
      <div class="q-pa-md row">
        <q-item-section>
          <q-select
            outlined
            label="Priority"
            v-model="advancedOptions.priorityId"
            :options="taskListsStore.TaskPriorities"
            emit-value
            map-options
            option-label="name"
            option-value="id"
          />
        </q-item-section>
      </div>
      <div class="q-pa-md row">
        <q-item-section>
          <q-select
            outlined
            label="Task Type"
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
          <q-select
            outlined
            label="Assigned To"
            v-model="advancedOptions.assignedToId"
            :options="taskListsStore.users"
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
          <q-select
            outlined
            label="Owned By"
            v-model="advancedOptions.ownedById"
            :options="taskListsStore.users"
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
        </q-item-section></div
    ></q-scroll-area>
    <q-separator />
    <q-card-actions align="right">
      <q-btn
        :disable="isDisable()"
        v-close-popup
        color="primary"
        label="Apply"
        @click="emitOptions"
      />
    </q-card-actions>
  </q-card>
</template>
