<script lang="ts" setup>
import {computed, onBeforeMount, ref} from 'vue';
import TaskSummaryItem from "components/tasks/TaskSummaryItem.vue";
import {useTaskSummaryStore} from "stores/task/taskSummaryStore";
import TaskAdvancedFilters from "components/tasks/taskAdvancedFilters.vue";


const filterOptions = {
  filterString: '',
  ownedByMeFilter: false,
  assignedToMeFilter: false,
  showAdvancedOptions: false,
  userName: 'Alice Johnson',
  statusFilter: '',
  priorityFilter: ''
};

const parent = ref({
  parentObjectId: -1,
  parentObjectServiceType: -1,
});

const taskSummaryStore = useTaskSummaryStore();

//Temporary fix to stop continous network requests

const getFilteredTaskSummaries = computed(() => {
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

onBeforeMount(() => {
  taskSummaryStore.getTasks(Number(parent.value.parentObjectId), Number(parent.value.parentObjectServiceType));
});


const sortOption = ref('subject'); // Default sorting by subject

const sortOptions = [
  {label: 'Subject', value: 'subject'},
  {label: 'Created Date', value: 'createdDate'},
  {label: 'Due Date', value: 'dueDate'},
];

const statusOptions = [
  {label: 'All', value: ''},
  {label: 'Open', value: 'Open'},
  {label: 'In Progress', value: 'In Progress'},
  {label: 'Completed', value: 'Completed'},
];

const priorityOptions = [
  {label: 'All', value: ''},
  {label: 'Low', value: 'Low'},
  {label: 'Medium', value: 'Medium'},
  {label: 'High', value: 'High'},
];

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
            <div class="row center">
              <q-item-section> Show Advanced Options</q-item-section>
              <q-toggle v-model="filterOptions.showAdvancedOptions"></q-toggle>
            </div>
          </div>
        </div>

        <q-list v-for="task in getSortedSummaries" :key="task.id" class="q-pa-xs">
          <taskSummaryItem :task="task"/>
        </q-list>

        <q-dialog v-model="filterOptions.showAdvancedOptions">
          <task-advanced-filters/>
        </q-dialog>
      </q-page>
      <q-page-sticky :offset="[18, 18]" position="bottom-right">
        <q-btn
          :to="{
            name: 'newTask',
            params: {
              id: -1,
            },
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

<style></style>
