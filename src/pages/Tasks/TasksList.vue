<script lang="ts" setup>
import {computed, onBeforeMount, ref, Ref, watch} from 'vue';
import {useQuasar} from 'quasar'

import TaskSummaryItem from 'components/tasks/TaskSummaryItem.vue';
import {useTaskSummaryStore} from 'stores/task/taskSummaryStore';
import TaskAdvancedFilters from 'components/tasks/taskAdvancedFilters.vue';
import {searchFilter} from 'src/models/task/searchFilter';
import {taskSummary} from 'src/models/task/taskSummary';

let filterOptions: Ref<searchFilter> = ref({
  filterString: '',
  ownedByMe: false,
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

const parent = {
  parentObjectId: -1,
  parentObjectServiceType: -1,
};

const taskSummaryStore = useTaskSummaryStore();
const getSortedSummaries = computed(() => {
  return taskSummaryStore.taskSummaries;
});

let reachedEnd = ref(false);
const pageSize = 10;

async function getFirstBatch() {
  // taskSummaryStore
  //   .getTaskSummaryByBatch(parent.parentObjectId, parent.parentObjectServiceType, pageSize, 1)
  //   .then((val) => {
  //     reachedEnd.value = val;
  //   });
  taskSummaryStore
    .getTasksUpdated()
    .then((val) => {
      reachedEnd.value = val;
    });
}

const loadMore = (index: any, done: () => void) => {
  // const contactsSizeBeforeCall = getSortedSummaries.value.length;
  setTimeout(() => {
    // taskSummaryStore
    //   .getTaskSummaryByBatch(parent.parentObjectId, parent.parentObjectServiceType, pageSize, -1)
    //   .then((val) => {
    //     reachedEnd.value = val;
    //     done();
    //   });
    taskSummaryStore
      .getTasksUpdated()
      .then((val) => {
        reachedEnd.value = val;
      });
  }, 500);
};

function clearFilterValues() {
  filterOptions.value = {
    filterString: '',
    ownedByMe: false,
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
  }
  filterCount.value = 0;
  getFirstBatch();
}

function receiveAdvFilters(advancedOptions: searchFilter) {
  filterOptions.value.dueDateValue = advancedOptions.dueDateValue;
  filterOptions.value.dueDateOption = advancedOptions.dueDateOption;
  filterOptions.value.modifiedDateValue = advancedOptions.modifiedDateValue;
  filterOptions.value.modifiedDateOption = advancedOptions.modifiedDateOption;
  filterOptions.value.statusId = advancedOptions.statusId;
  filterOptions.value.priorityId = advancedOptions.priorityId;
  filterOptions.value.assignedToId = advancedOptions.assignedToId;
  filterOptions.value.ownedById = advancedOptions.ownedById;
  filterOptions.value.regardingValueId = advancedOptions.regardingValueId;
  filterOptions.value.regardingTypeId = advancedOptions.regardingTypeId;
  filterOptions.value.taskTypeId = advancedOptions.taskTypeId;
  filterOptions.value.showCompleted = advancedOptions.showCompleted;
}

async function filterFn(val: string) {
  if (val.length === 0) {
    await getFirstBatch();
  } else if (val.length < 2) {
    return;
  } else if (val.length === 2) {
    await taskSummaryStore.getRegardingContactListThatMatch(val, parent.parentObjectId, parent.parentObjectServiceType);
  } else {
    taskSummaryStore.taskSummaries = taskSummaryStore.taskSummaries.filter((t: taskSummary) => {
      return t.subject.toLowerCase().includes(val.toLowerCase());
    });
  }
}

watch(
  () => filterOptions.value.filterString,
  async (newValue) => {
    await filterFn(newValue);
  }
);

watch(
  () => filterOptions.value.assignedToMe,
  async () => {
    await taskSummaryStore.resetTaskSummaryList();
    setTimeout(async () => {
      await taskSummaryStore.getFilteredTasksNew(filterOptions.value, parent.parentObjectId, parent.parentObjectServiceType);
    }, 300);
  }
);

watch(
  () => filterOptions.value.ownedByMe,
  async () => {
    await taskSummaryStore.resetTaskSummaryList();
    setTimeout(async () => {
      await getFirstBatch();
    }, 300);
  }
);

const filterCount = ref(0);

function updateFilterCount(val: number) {
  filterCount.value = val;
}

const $q = useQuasar()

function showNotif() {
  $q.notify({
    type: 'info',
    message: 'COMPLETED TASKS ARE HIDDEN',
    timeout: 10000,
    actions: [
      {
        icon: 'close', color: 'white', round: true, handler: () => { /* ... */
        }
      }
    ]
  })
}

onBeforeMount(async () => {
  await getFirstBatch();
  showNotif();
});


</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header bordered class="bg-primary text-white" height-hint="98" reveal>
      <q-toolbar>
        <q-btn color="white" dense flat icon="arrow_back" round @click="$router.go(-1)"/>
        <q-toolbar-title> Tasks</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-space class="q-mt-sm"/>
    <q-page-container>
      <q-page>
        <div class="q-pa-sm">
          <q-input v-model="filterOptions.filterString" clearable label="Search" outlined @clear=getFirstBatch>
            <template v-slot:append>
              <q-icon name="search"/>
            </template>
          </q-input>
        </div>

        <div class="row q-pa-sm justify-between">
          <div class="q-mr-md">
            <q-checkbox v-model="filterOptions.assignedToMe" label="Assigned to me"/>
          </div>
          <div class="row">
            <div class="q-mr-md">
              <q-btn flat icon="filter_list" @click="filterOptions.showAdvancedOptions = true">
                <q-badge v-if="filterCount != 0" color="red" floating>{{ filterCount }}</q-badge>
              </q-btn>
            </div>
            <div class="q-mr-md">
              <q-btn flat icon="clear" @click="clearFilterValues">
              </q-btn>
            </div>
          </div>
        </div>

        <q-infinite-scroll :disable="reachedEnd" :offset="250" @load="loadMore">
          <q-item v-for="task in getSortedSummaries" :key="task.id" class="q-pa-sm">
            <taskSummaryItem :task="task" class="full-width"/>
          </q-item>
          <template v-slot:loading>
            <q-spinner-dots color="primary" size="40px"></q-spinner-dots>
          </template>
        </q-infinite-scroll>

        <q-dialog v-model="filterOptions.showAdvancedOptions">
          <task-advanced-filters :filter-options="filterOptions" :parent="parent"
                                 @advancedOptionsGenerated="receiveAdvFilters" @filterCount="updateFilterCount"/>
        </q-dialog>
      </q-page>
      <q-page-sticky :offset="[18, 18]" position="bottom-right">
        <q-btn :to="{
          name: 'newTask',
          params: {
            id: -1,
            objectTypeId: -1,
            objectId: -1
          },
        }" color="accent" fab icon="add" padding="sm"/>
      </q-page-sticky>
    </q-page-container>
  </q-layout>
</template>
