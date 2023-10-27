<script lang="ts" setup>
import {computed, onBeforeMount, ref,Ref, watch} from 'vue';
import TaskSummaryItem from "components/tasks/TaskSummaryItem.vue";
import {useTaskSummaryStore} from "stores/task/taskSummaryStore";
import TaskAdvancedFilters from "components/tasks/taskAdvancedFilters.vue";
import {searchFilter} from "src/models/task/searchFilter";


let filterOptions:Ref<searchFilter> = ref({
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
});

const parent = {
  parentObjectId: -1,
  parentObjectServiceType: -1,
};

const taskSummaryStore = useTaskSummaryStore();

const getFilteredTaskSummaries = computed(() => {
  // await taskSummaryStore.getFilteredTasks(filterOptions.value, parent.parentObjectId, parent.parentObjectServiceType);

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
    regarding: ''
  }
}
watch(filterOptions,(newValue, oldValue)=>{
  console.log("watched")
  taskSummaryStore.getFilteredTasks(newValue, parent.parentObjectId, parent.parentObjectServiceType);
});

onBeforeMount(() => {
  taskSummaryStore.getTasks(Number(parent.parentObjectId), Number(parent.parentObjectServiceType));
});

const sortOption = ref('subject'); // Default sorting by subject

function receiveAdvFilters(advancedOptions: any) {
  console.log(advancedOptions);
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
          <task-advanced-filters @advancedOptionsGenerated="receiveAdvFilters" :parent="parent"/>
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
