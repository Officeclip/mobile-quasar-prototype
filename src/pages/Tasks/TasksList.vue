<script lang="ts" setup>
import {computed, onBeforeMount, ref, Ref, watch} from 'vue';
import { useQuasar } from 'quasar'

import TaskSummaryItem from "components/tasks/TaskSummaryItem.vue";
import {useTaskSummaryStore} from "stores/task/taskSummaryStore";
import TaskAdvancedFilters from "components/tasks/taskAdvancedFilters.vue";
import {searchFilter} from "src/models/task/searchFilter";
import {taskSummary} from "src/models/task/taskSummary";

let filterOptions: Ref<searchFilter> = ref({
  filterString: '',
  ownedByMeFilter: false,
  assignedToMeFilter: false,
  showAdvancedOptions: false,
  userName: 'Alice Johnson',
  dueDateValue: '',
  dueDateOption: '',
  modifiedDateValue: '',
  modifiedDateOption: '',
  statusName: '',
  priorityName: '',
  taskTypeValue: '',
  assignedTo: '',
  ownedBy: '',
  regarding: '',
  hideCompleted: true
});

const parent = {
  parentObjectId: -1,
  parentObjectServiceType: -1,
};

const taskSummaryStore = useTaskSummaryStore();

// const getFilteredTaskSummaries = ref([...taskSummaryStore.taskSummaries]);
// const getFilteredTaskSummaries = computed(() => {
//   // await taskSummaryStore.getFilteredTasks(filterOptions.value, parent.parentObjectId, parent.parentObjectServiceType);
//
//   return taskSummaryStore.TaskSummaries;
// });

const getSortedSummaries = computed(() => {
  // let sortedTasks = getFilteredTaskSummaries;
  // sortedTasks.value.sort((a, b) => {
  //   if (sortOption.value === 'createdDate') {
  //     return a.createdDate.localeCompare(b.createdDate);
  //   } else if (sortOption.value === 'dueDate') {
  //     return a.dueDate.localeCompare(b.dueDate);
  //   } else {
  //     return a.subject.localeCompare(b.subject);
  //   }
  // });
  return taskSummaryStore.taskSummaries;
});

function clearFilterValues() {
  filterOptions.value = {
    filterString: '',
    ownedByMeFilter: false,
    assignedToMeFilter: false,
    showAdvancedOptions: false,
    userName: 'Alice Johnson',
    dueDateValue: '',
    dueDateOption: '',
    modifiedDateValue: '',
    modifiedDateOption: '',
    statusName: '',
    priorityName: '',
    taskTypeValue: '',
    assignedTo: '',
    ownedBy: '',
    regarding: '',
    hideCompleted: true,
  }
  filterCount.value = 0;
  getFirstBatch();
}

let currentPage = 1; // the current page number
// const pageSize = ref(10); // number of items in one page
let numItems = 0; // total number of items in the list
let reachedEnd = ref(false); // indicate if all contacts have been loaded
const batchSize = 10; // number of contacts to load in each batch

async function getFirstBatch() {
  await taskSummaryStore.resetTaskSummaryList();
  currentPage = 1;
  taskSummaryStore
    .getTaskSummaryByBatch(parent.parentObjectId, parent.parentObjectServiceType, batchSize, currentPage)
    .then(() => {
      // getFilteredTaskSummaries.value = [...taskSummaryStore.taskSummaries];
      currentPage++
    });
}

const loadMore = (index: any, done: () => void) => {
  const contactsSizeBeforeCall = getSortedSummaries.value.length;
  setTimeout(() => {
    taskSummaryStore
      .getTaskSummaryByBatch(parent.parentObjectId, parent.parentObjectServiceType, batchSize, currentPage)
      .then(() => {
        currentPage++;
        // getFilteredTaskSummaries.value = [...taskSummaryStore.taskSummaries];

        const contactsAfterCall = getSortedSummaries.value.length;
        reachedEnd.value = contactsSizeBeforeCall === contactsAfterCall;
        done();
      });
  }, 500);
};

function receiveAdvFilters(advancedOptions: any) {
  filterOptions.value.dueDateValue = advancedOptions.dueDateValue;
  filterOptions.value.dueDateOption = advancedOptions.dueDateOption;
  filterOptions.value.modifiedDateValue = advancedOptions.modifiedDateValue;
  filterOptions.value.modifiedDateOption = advancedOptions.modifiedDateOption;
  filterOptions.value.statusName = advancedOptions.statusName;
  filterOptions.value.priorityName = advancedOptions.priorityName;
  filterOptions.value.assignedTo = advancedOptions.assignedTo;
  filterOptions.value.ownedBy = advancedOptions.ownedBy;
  filterOptions.value.regarding = advancedOptions.regarding;
  filterOptions.value.taskTypeValue = advancedOptions.taskTypeValue;

  // console.log(filterOptions.value);

}

async function filterFn(val: string) {
  if (val.length === 0) {
    await getFirstBatch();
  } else if (val.length < 2) {
    // abort();
    return;
  } else if (val.length === 2) {
    // getFilteredTaskSummaries.value = [];
    await taskSummaryStore.getRegardingContactListThatMatch(val, parent.parentObjectId, parent.parentObjectServiceType);
    // getFilteredTaskSummaries.value = taskSummaryStore.TaskSummaries;
  } else {
    // getFilteredTaskSummaries.value = getFilteredTaskSummaries.value.filter((t: taskSummary) => {
    //   return t.subject.toLowerCase().includes(val.toLowerCase());
    // });

    taskSummaryStore.taskSummaries = taskSummaryStore.taskSummaries.filter((t: taskSummary) => {
      return t.subject.toLowerCase().includes(val.toLowerCase());
    });
  }

  // update(() => {
  //   console.log('update');
  //   const needle = val.toLowerCase();
  //   getFilteredTaskSummaries.value = taskSummaryStore.TaskSummaries.filter(
  //     (task) => task.subject.toLowerCase().indexOf(needle) > -1
  //   );
  // });
}

watch(
  () => filterOptions.value.filterString,
  async (newValue, oldValue) => {
    await filterFn(newValue);
  }
);

watch(
  () => filterOptions.value.assignedToMeFilter,
  async (newValue, oldValue) => {
    await taskSummaryStore.resetTaskSummaryList();
    // getFilteredTaskSummaries.value = [...taskSummaryStore.taskSummaries];
    setTimeout(async () => {
      await getFirstBatch();
    }, 300);
  }
);

watch(
  () => filterOptions.value.ownedByMeFilter,
  async (newValue, oldValue) => {
    await taskSummaryStore.resetTaskSummaryList();
    // getFilteredTaskSummaries.value = [...taskSummaryStore.taskSummaries];
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

function showNotif () {
  $q.notify({
    type: 'info',
    message: 'COMPLETED TASKS ARE HIDDEN',
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
        <q-btn
          color="white"
          dense
          flat
          icon="arrow_back"
          round
          @click="$router.go(-1)"
        />
        <q-toolbar-title> Tasks</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-space class="q-mt-sm"/>
    <q-page-container>
      <q-page>
        <div class="q-pa-sm">
          <q-input
            v-model="filterOptions.filterString"
            clearable
            label="Search"
            outlined
            @clear=getFirstBatch
          >
            <template v-slot:append>
              <q-icon name="search"/>
            </template>
          </q-input>
        </div>

        <div class="row q-pa-sm justify-between">
          <div class="q-mr-md">
            <q-checkbox v-model="filterOptions.assignedToMeFilter" label="Assigned to me"/>
          </div>
          <div class="row">
            <div class="q-mr-md">
              <q-btn flat icon="filter_list" @click="filterOptions.showAdvancedOptions = true">
                <q-badge v-if="filterCount!=0" color="red" floating>{{ filterCount }}</q-badge>
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
                                 @advancedOptionsGenerated="receiveAdvFilters"
                                 @filterCount="updateFilterCount"/>
        </q-dialog>
      </q-page>
      <q-page-sticky :offset="[18, 18]" position="bottom-right">
        <q-btn
          :to="{
            name: 'newTask',
            params: {id: -1},
          }"
          color="accent"
          fab
          icon="add"
          padding="sm"
        />
      </q-page-sticky>
    </q-page-container>
  </q-layout>
</template>
