<script lang="ts" setup>
import {computed, onBeforeMount, ref} from 'vue';
import TaskSummaryItem from "components/tasks/TaskSummaryItem.vue";
import {useTaskSummaryStore} from "stores/task/taskSummaryStore";
import {taskSummary} from "src/models/task/taskSummary";

const filterString = ref('');
const ownedByMeFilter = ref(false);
const assignedToMeFilter = ref(false);
const userName = ref("Alice Johnson");
const parent = ref({
  parentObjectId: -1,
  parentObjectServiceType: -1,
});

const taskSummaryStore = useTaskSummaryStore();

const getTasks = computed(() => {
  let filteredTasks = taskSummaryStore.taskSummaries;

  if (filterString.value) {
    filteredTasks = filteredTasks.filter((task: taskSummary) => {
      return task.subject.toLowerCase().includes(filterString.value.toLowerCase());
    });
  }

  if (ownedByMeFilter.value === true) {
    filteredTasks = filteredTasks.filter((task: taskSummary) => {
      return task.taskOwner === userName.value;
    });
  }

  if (assignedToMeFilter.value === true) {
    filteredTasks = filteredTasks.filter((task: taskSummary) => {
      return task.assignee.includes(userName.value);
    });
  }
  return filteredTasks;
});

onBeforeMount(() => {
  taskSummaryStore.getTasks(Number(parent.value.parentObjectId), Number(parent.value.parentObjectServiceType));
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
        >
        </q-btn>
        <q-toolbar-title> Tasks</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-space class="q-mt-sm"/>
    <q-page-container>
      <q-page>
        <div class="q-pa-sm row text-center">
          <div class="col-4">
            <q-input
                v-model="filterString"
                label="Search"
                outlined
            />
          </div>
          <div class="col-3">
            <q-checkbox v-model="ownedByMeFilter" dense label="Owned by me"/>
          </div>
          <div class="col-3">
            <q-checkbox v-model="assignedToMeFilter" dense label="Assigned to me"/>
          </div>
        </div>

        <q-list v-for="task in getTasks" :key="task.id" class="q-pa-xs">
          <taskSummaryItem :task="task"/>
        </q-list>
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
