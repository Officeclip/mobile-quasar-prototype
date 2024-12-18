<script lang="ts" setup>
import { onBeforeMount, ref, Ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useTaskSummaryStore } from 'stores/task/taskSummaryStore';
import TaskAdvancedFilters from 'components/tasks/taskAdvancedFilters.vue';
import { searchFilter } from 'src/models/task/searchFilter';
import { useSessionStore } from 'stores/SessionStore';
import TasksListCtrl from 'components/tasks/tasksListCtrl.vue';
import drawer from '../../components/drawer.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const myDrawer = ref();
const infinteScroll = ref(null);

const defaultFilterOptions: searchFilter = {
  filterString: '',
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
};

let filterOptions: Ref<searchFilter> = ref({ ...defaultFilterOptions });

const parent = {
  parentObjectId: '',
  parentObjectServiceType: '',
  appName: 'task',
};

const taskSummaryStore = useTaskSummaryStore();
const sessionStore = useSessionStore();

const showAdvOptions = ref(false);
const assignedToMe = ref(
  filterOptions.value.assignedToId === sessionStore.Session.userId
);

function clearFilterValues() {
  window.location.reload();
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
  assignedToMe.value =
    advancedOptions.assignedToId === sessionStore.Session.userId;
}

async function filterFn(val: string) {
  if (val.length > 2) {
    filterOptions.value.filterString = val.toLowerCase();
    taskSummaryStore.resetPageNumber();
    taskSummaryStore.setFilter(filterOptions.value);
    await taskSummaryStore.getTasksUpdated(true);
    infinteScroll.value.infinteScrollReset();
  }
}

watch(
  () => filterOptions.value.filterString,
  async (newValue) => {
    await filterFn(newValue);
  }
);

watch(assignedToMe, async () => {
  if (!assignedToMe.value) {
    window.location.reload();
  }
  filterOptions.value.assignedToId = sessionStore.Session.userId;
  await taskSummaryStore.resetTaskSummaryList();
  taskSummaryStore.setFilter(filterOptions.value);
  await taskSummaryStore.getTasksUpdated(true);
  infinteScroll.value.infinteScrollReset();
});

const advanceFilters = async () => {
  await taskSummaryStore.resetTaskSummaryList();
  taskSummaryStore.setFilter(filterOptions.value);
  await taskSummaryStore.getTasksUpdated(true);
  infinteScroll.value.infinteScrollReset();
};

const filterCount = ref(0);

function updateFilterCount(val: number) {
  filterCount.value = val;
}

const $q = useQuasar();

function showNotif() {
  $q.notify({
    type: 'info',
    message: 'COMPLETED TASKS ARE HIDDEN',
    timeout: 2000,
    actions: [
      {
        icon: 'close',
        color: 'white',
        round: true,
        handler: () => {
          /* ... */
        },
      },
    ],
  });
}

onBeforeMount(() => {
  showNotif();
});
function toggleLeftDrawer() {
  if (myDrawer.value == null) return;
  myDrawer.value.toggleLeftDrawer();
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
          @click="router.push({ path: '/homepage' })"
        />
        <q-btn
          aria-label="Menu"
          dense
          flat
          icon="menu"
          round
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title> Tasks</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <drawer ref="myDrawer" />
    <q-space class="q-mt-sm" />
    <q-page-container>
      <q-page>
        <div class="q-pa-sm">
          <q-input
            v-model="filterOptions.filterString"
            debounce="1000"
            clearable
            @clear="clearFilterValues"
            label="Search"
            outlined
            placeholder="Start typing with min 3 characters to search"
          >
          </q-input>
        </div>

        <div class="row q-pa-sm justify-between">
          <div class="q-mr-md">
            <q-checkbox v-model="assignedToMe" label="Assigned to me" />
          </div>
          <div class="row">
            <div class="q-mr-md">
              <q-btn flat icon="filter_list" @click="showAdvOptions = true">
                <q-badge v-if="filterCount != 0" color="red" floating>{{
                  filterCount
                }}</q-badge>
              </q-btn>
            </div>
            <div class="q-mr-md">
              <q-btn flat icon="clear" @click="clearFilterValues" />
            </div>
          </div>
        </div>
        <tasks-list-ctrl :parent="parent" ref="infinteScroll" />
        <q-dialog v-model="showAdvOptions">
          <task-advanced-filters
            :filter-options="filterOptions"
            :parent="parent"
            @advancedOptionsGenerated="receiveAdvFilters"
            @filterCount="updateFilterCount"
            @scrollLoadMore="advanceFilters"
          />
        </q-dialog>
      </q-page>
      <q-page-sticky :offset="[18, 18]" position="bottom-right">
        <q-btn
          :to="{
            name: 'newTask',
            params: {
              id: -1,
              objectTypeId: -1,
              objectId: -1,
              appName: 'task',
            },
          }"
          color="accent"
          fab
          icon="add"
          padding="md"
        />
      </q-page-sticky>
    </q-page-container>
  </q-layout>
</template>
