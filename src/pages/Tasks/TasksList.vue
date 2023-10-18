<script lang="ts" setup>
import {computed, onBeforeMount, ref} from 'vue';
import TaskSummaryItem from "components/tasks/TaskSummaryItem.vue";
import {useTaskSummaryStore} from "stores/task/taskSummaryStore";
import TaskAdvancedFilters from "components/tasks/taskAdvancedFilters.vue";


let filterOptions = {
  filterString: '',
  ownedByMeFilter: false,
  assignedToMeFilter: false,
  showAdvancedOptions: false,
  userName: 'Alice Johnson',

  dueDateValue: '',
  dueDateOption: '',
  modifiedDateValue: '',
  modifiedDateOption: '',
  statusValue: '',
  priorityValue: '',
  taskTypeValue: '',
  assignedTo: '',
  ownedBy: '',
  regarding: ''
};

const parent = ref({
  parentObjectId: -1,
  parentObjectServiceType: -1,
});

const taskSummaryStore = useTaskSummaryStore();

//Temporary fix to stop continuous network requests
// Get the filtered task summaries, and ensure that the component only re-renders when the filtered tasks actually change.
// const filteredTaskSummaries = computed(() => {
//   getFilteredTaskSummaries();
//   return taskSummaryStore.TaskSummaries;
// });
//
// async function getFilteredTaskSummaries() {
//   console.log('Request filtered tasks');
//   await taskSummaryStore.getFilteredTasks(
//     filterOptions.value,
//     Number(parent.value.parentObjectId),
//     Number(parent.value.parentObjectServiceType)
//   );
// }
//
// watch(filterOptions.value, () => {
//   getFilteredTaskSummaries();
// });

const getFilteredTaskSummaries = computed(() => {
  // console.log(filterOptions);

  // console.log("Request filtered tasks");
  taskSummaryStore.getFilteredTasks(filterOptions, Number(parent.value.parentObjectId), Number(parent.value.parentObjectServiceType));
  return taskSummaryStore.TaskSummaries;
  //
  // if (filterString.value) {
  //   filteredTasks = filteredTasks.filter((task: taskSummary) => {
  //     return task.subject.toLowerCase().includes(filterString.value.toLowerCase());
  //   });
  // }
  //
  // if (ownedByMeFilter.value === true) {
  //   filteredTasks = filteredTasks.filter((task: taskSummary) => {
  //     return task.taskOwner === userName.value;
  //   });
  // }
  //
  // if (assignedToMeFilter.value === true) {
  //   filteredTasks = filteredTasks.filter((task: taskSummary) => {
  //     return task.assignee.includes(userName.value);
  //   });
  // }
  //
  // if (statusFilter.value) {
  //   filteredTasks = filteredTasks.filter((task) => {
  //     return task.taskStatusId === statusFilter.value;
  //   });
  // }
  //
  // if (priorityFilter.value) {
  //   filteredTasks = filteredTasks.filter((task) => {
  //     return task.taskPriorityId === priorityFilter.value;
  //   });
  // }
  // return filteredTasks;
});

const getSortedSummaries = computed(() => {
  let sortedTasks = getFilteredTaskSummaries;
  sortedTasks.value.sort((a, b) => {
    if (sortOption.value === 'createdDate') {
      return a.createdDate.localeCompare(b.createdDate);
    } else if (sortOption.value === 'dueDate') {
      return a.dueDate.localeCompare(b.dueDate);
    } else {
      return a.subject.localeCompare(b.subject);
    }
  });
  return sortedTasks.value;
});

function clearFilterValues() {
  filterOptions = {
    filterString: '',
    ownedByMeFilter: false,
    assignedToMeFilter: false,
    showAdvancedOptions: false,
    userName: 'Alice Johnson',

    dueDateValue: '',
    dueDateOption: '',
    modifiedDateValue: '',
    modifiedDateOption: '',
    statusValue: '',
    priorityValue: '',
    taskTypeValue: '',
    assignedTo: '',
    ownedBy: '',
    regarding: ''
  }
}

onBeforeMount(() => {
  taskSummaryStore.getTasks(Number(parent.value.parentObjectId), Number(parent.value.parentObjectServiceType));
});

const sortOption = ref('subject'); // Default sorting by subject

function receiveAdvFilters(advancedOptions: any) {
  console.log(advancedOptions);
  filterOptions.dueDateValue = advancedOptions.dueDateValue;
  filterOptions.dueDateOption = advancedOptions.dueDateOption;
  filterOptions.modifiedDateValue = advancedOptions.modifiedDateValue;
  filterOptions.modifiedDateOption = advancedOptions.modifiedDateOption;
  filterOptions.statusValue = advancedOptions.statusValue;
  filterOptions.priorityValue = advancedOptions.priorityValue;
  filterOptions.assignedTo = advancedOptions.assignedTo;
  filterOptions.ownedBy = advancedOptions.ownedBy;
  filterOptions.regarding = advancedOptions.regarding;
  filterOptions.taskTypeValue = advancedOptions.taskTypeValue;
}

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
        >
        </q-btn>
        <q-toolbar-title> Tasks</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-space class="q-mt-sm"/>
    <q-page-container>
      <q-page>
        <div class="q-pa-sm row text-center">
          <div class="row">
            <q-input
              v-model="filterOptions.filterString"
              label="Search"
              outlined
            />
          </div>
          <div class="column">
            <div class="row">
              <q-checkbox v-model="filterOptions.ownedByMeFilter" label="Owned by me"/>
              <q-checkbox v-model="filterOptions.assignedToMeFilter" label="Assigned to me"/>
            </div>
            <div>
              <q-btn class="q-ma-sm" label="Open Advanced Filters" @click="filterOptions.showAdvancedOptions = true"/>
              <q-btn class="q-ma-sm" label="Reset Filters" @click="clearFilterValues"/>
            </div>
          </div>
        </div>

        <q-list v-for="task in getSortedSummaries" :key="task.id" class="q-pa-xs">
          <taskSummaryItem :task="task"/>
        </q-list>

        <q-dialog v-model="filterOptions.showAdvancedOptions">
          <task-advanced-filters @advancedOptionsGenerated="receiveAdvFilters"/>
        </q-dialog>

        <pre>{{ filterOptions }}</pre>
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
