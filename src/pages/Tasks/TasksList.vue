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
  statusName: '',
  priorityName: '',
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

const getFilteredTaskSummaries = computed(() => {

  taskSummaryStore.getFilteredTasks(filterOptions, Number(parent.value.parentObjectId), Number(parent.value.parentObjectServiceType));
  return taskSummaryStore.TaskSummaries;
});

const getSortedSummaries = computed(() => {
  let sortedTasks = getFilteredTaskSummaries;
  // sortedTasks.value.sort((a, b) => {
  //   if (sortOption.value === 'createdDate') {
  //     return a.createdDate.localeCompare(b.createdDate);
  //   } else if (sortOption.value === 'dueDate') {
  //     return a.dueDate.localeCompare(b.dueDate);
  //   } else {
  //     return a.subject.localeCompare(b.subject);
  //   }
  // });
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
    statusName: '',
    priorityName: '',
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
  filterOptions.statusName = advancedOptions.statusName;
  filterOptions.priorityName = advancedOptions.priorityName;
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
