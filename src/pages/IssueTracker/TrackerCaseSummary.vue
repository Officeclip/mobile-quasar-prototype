<script setup lang="ts">
import { Ref, ref, watch } from 'vue';
import drawer from '../../components/drawer.vue';
import { useIssueSummaryStore } from 'src/stores/issueTracker/issueSummaryStore';
import { useRoute, useRouter } from 'vue-router';
import AdvancedFilters from '../../components/IssueTracker/IssueTrackerAdvancedFilters.vue';
import { searchFilter } from 'src/models/issueTracker/searchFilter';
import { useSessionStore } from 'src/stores/SessionStore';
import IssuesListCtrl from 'src/components/IssueTracker/IssuesListCtrl.vue';

const route = useRoute();
const router = useRouter();
const binderId = route.params.binderId;
const binderName = route.params.binderName;
const myDrawer = ref();
const defaultFilterOptions: searchFilter = {
  searchString: '',
  starredIssues: '',
  statusId: '',
  criticalityId: '',
  categoryId: '',
  kindId: '',
  createdById: '',
  assignedToId: '',
  modifiedById: '',
};

let filterOptions: Ref<searchFilter> = ref({ ...defaultFilterOptions });

const sessionStore = useSessionStore();
const issueSummaryStore = useIssueSummaryStore();

const assignedToMe = ref(
  filterOptions.value.assignedToId === sessionStore.Session.userId
);

//need to figure out how and what value assigned for starredIssues filter
const starredIssues = ref('');

function clearFilterValues() {
  window.location.reload();
}

function receiveAdvFilters(advancedOptions: searchFilter) {
  filterOptions.value.statusId = advancedOptions.statusId;
  filterOptions.value.criticalityId = advancedOptions.criticalityId;
  filterOptions.value.categoryId = advancedOptions.categoryId;
  filterOptions.value.kindId = advancedOptions.kindId;
  filterOptions.value.createdById = advancedOptions.createdById;
  filterOptions.value.assignedToId = advancedOptions.assignedToId;
  filterOptions.value.assignedToId = advancedOptions.assignedToId;
  filterOptions.value.modifiedById = advancedOptions.modifiedById;
  assignedToMe.value =
    advancedOptions.assignedToId === sessionStore.Session.userId;
}

async function filterFn(val: string) {
  if (val === null || val.length === 0) {
    issueSummaryStore.resetPageNumber();
    return await issueSummaryStore.getIssuesUpdated(false);
  } else {
    if (val.length > 2) {
      filterOptions.value.searchString = val.toLowerCase();
      issueSummaryStore.resetPageNumber();
      issueSummaryStore.setFilter(filterOptions.value);
      await issueSummaryStore.getIssuesUpdated(true);
    }
  }
}

async function handleClear() {
  await issueSummaryStore.resetIssuesSummaryList();
  issueSummaryStore.resetPageNumber();
}

watch(
  () => filterOptions.value.searchString,
  async (newValue) => {
    await filterFn(newValue);
  }
);

watch(assignedToMe, async () => {
  if (!assignedToMe.value) {
    window.location.reload();
  }
  filterOptions.value.assignedToId = sessionStore.Session.userId;
  await issueSummaryStore.resetIssuesSummaryList();
  issueSummaryStore.setFilter(filterOptions.value);
  await issueSummaryStore.getIssuesUpdated(true);
});

watch(
  () => filterOptions.value,
  () => {
    issueSummaryStore.setFilter(filterOptions.value);
  },
  { deep: true } // This option is necessary to watch for nested changes
);

const showAdvOptions = ref(false);
const filterCount = ref(0);
function updateFilterCount(val: number) {
  filterCount.value = val;
}
const position = ref('top');

function open(pos: string) {
  position.value = pos;
  showAdvOptions.value = true;
}

function toggleLeftDrawer() {
  if (myDrawer.value == null) return;
  myDrawer.value.toggleLeftDrawer();
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn
          @click="router.push({ path: '/binders' })"
          flat
          round
          dense
          color="white"
          icon="arrow_back"
        >
        </q-btn>
        <q-btn
          aria-label="Menu"
          dense
          flat
          icon="menu"
          round
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title> {{ binderName }} </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <drawer ref="myDrawer" />
    <q-space class="q-mt-sm"></q-space>
    <q-page-container>
      <q-page>
        <q-item>
          <!-- <q-item-section>
            <q-item-label>
              <q-input
                v-model="filterOptions.searchString"
                class="GNL__toolbar-input"
                color="bg-grey-7 shadow-1"
                dense
                outlined
                label="Search"
              >
                <template v-slot:prepend>
                  <q-icon
                    v-if="filterOptions.searchString === ''"
                    name="search"
                  />
                  <q-icon
                    v-else
                    class="cursor-pointer"
                    name="clear"
                    @click="filterOptions.searchString = ''"
                  />
                </template>
              </q-input> </q-item-label
          ></q-item-section> -->
          <q-item-section>
            <q-input
              v-model="filterOptions.searchString"
              clearable
              @clear="handleClear"
              label="Search"
              outlined
              placeholder="Start typing with min 3 characters to search"
            >
            </q-input>
          </q-item-section>
        </q-item>
        <q-item class="q-mt-sm q-mb-md">
          <q-item-section>
            <q-item-label>
              <q-checkbox dense v-model="assignedToMe" label="assigned to me" />
            </q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              <q-checkbox
                dense
                v-model="starredIssues"
                true-value="star"
                false-value=""
                label="starred issues"
              />
            </q-item-label>
          </q-item-section>
          <!-- <q-item-section>
            <q-item-label>
              <q-select
                dense
                label="Sort By"
                v-model="sortByModel"
                :options="sortByOptions"
              />
            </q-item-label>
          </q-item-section> -->
          <q-item-section side>
            <q-item-label>
              <q-btn
                flat
                icon="filter_list"
                @click="open('top')"
                class="q-px-xs"
              >
                <q-badge v-if="filterCount" color="red" floating rounded>{{
                  filterCount
                }}</q-badge>
              </q-btn>
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label>
              <q-btn flat icon="clear" @click="clearFilterValues" />
            </q-item-label>
          </q-item-section>
        </q-item>
        <IssuesListCtrl />
        <q-dialog v-model="showAdvOptions" :position="position">
          <AdvancedFilters
            :filter-options="filterOptions"
            @advancedOptionsGenerated="receiveAdvFilters"
            @filterCount="updateFilterCount"
          />
        </q-dialog>
      </q-page>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn
          fab
          icon="add"
          color="accent"
          padding="sm"
          :to="{
            name: 'newIssue',
          }"
        >
        </q-btn>
      </q-page-sticky>
    </q-page-container>
  </q-layout>
</template>

<style scopped lang="scss">
@import '../../css/status.scss';
.q-item {
  min-height: 24px;
  padding: 4px 16px;
}
</style>
