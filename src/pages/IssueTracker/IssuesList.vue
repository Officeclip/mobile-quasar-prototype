<!-- cleaned up with google bard with minor correction -->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import drawer from '../../components/drawer.vue';
import { useIssueSummaryStore } from 'src/stores/issueTracker/issueSummaryStore';
import { useRoute, useRouter } from 'vue-router';
import AdvancedFilters from '../../components/IssueTracker/IssueTrackerAdvancedFilters.vue';
import dateTimeHelper from 'src/helpers/dateTimeHelper';
import { getIssueTrackerLabelColor } from 'src/helpers/colorIconHelper';

// const title = ref('Binders');

const route = useRoute();
const router = useRouter();
const title = route.params.binder;
const myDrawer = ref();

const searchText = ref('');

function toggleLeftDrawer() {
  if (myDrawer.value == null) return;
  myDrawer.value.toggleLeftDrawer();
}
const issueSummaryStore = useIssueSummaryStore();

onMounted(() => {
  issueSummaryStore.getIssuesList();
  // binderList.value = issueTrackerStore.BindersList;
});
const issuesList = computed(() => {
  return issueSummaryStore.IssuesList;
});

const getData = computed(() => {
  if (issuesList.value.length === 0) {
    return null;
  }
  const filteredIssues =
    searchText.value === ''
      ? issuesList.value
      : issuesList.value.filter((t: any) => {
          return t.name.toLowerCase().includes(searchText.value.toLowerCase());
        });
  return filteredIssues;
});

const showAdvOptions = ref(false);
const filterCount = ref(1);
const position = ref('top');

function open(pos: string) {
  position.value = pos;
  showAdvOptions.value = true;
}

const assignedToMe = ref('');
const starredIssues = ref('');
const sortByModel = ref('Status');
const sortByOptions = [
  'Status',
  'Title',
  'Created Date',
  'Criticality',
  'Issue Id',
  'Kind',
  'Modified By',
  'Modified Date',
];

function handleAssignedToMeClick() {
  if (!assignedToMe.value) {
    window.location.reload();
  }
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
        <q-toolbar-title> {{ title }} </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <drawer ref="myDrawer" />
    <q-space class="q-mt-sm"></q-space>
    <q-page-container>
      <q-page>
        <q-item>
          <q-item-section>
            <q-item-label>
              <q-input
                v-model="searchText"
                class="GNL__toolbar-input"
                color="bg-grey-7 shadow-1"
                dense
                outlined
                label="Search"
              >
                <template v-slot:prepend>
                  <q-icon v-if="searchText === ''" name="search" />
                  <q-icon
                    v-else
                    class="cursor-pointer"
                    name="clear"
                    @click="searchText = ''"
                  />
                </template>
              </q-input> </q-item-label
          ></q-item-section>
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
        </q-item>
        <q-item class="q-mt-sm q-mb-md">
          <q-item-section>
            <q-item-label>
              <!-- <pre>{{ assignedToMe }}</pre> -->
              <q-checkbox
                dense
                v-model="assignedToMe"
                true-value="Rao Narsimha"
                false-value=""
                label="assigned to me"
                @click="handleAssignedToMeClick"
              />
            </q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              <!-- <pre>{{ starredIssues }}</pre> -->
              <q-checkbox
                dense
                v-model="starredIssues"
                true-value="star"
                false-value=""
                label="starred issues"
              />
            </q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              <q-select
                dense
                label="Sort By"
                v-model="sortByModel"
                :options="sortByOptions"
              />
            </q-item-label>
          </q-item-section>
        </q-item>
        <!-- <pre>{{ getData }}</pre> -->
        <q-list v-for="issue in getData" :key="issue.id">
          <q-item
            clickable
            v-ripple
            :to="{
              name: 'issueDetails',
              params: {
                binderName: title,
              },
            }"
          >
            <q-item-section>
              <q-item-label class="ellipsis"
                ><span class="text-subtitle1 text-weight-medium inline"
                  >{{ issue.id }}:</span
                >
                {{ issue.name }}</q-item-label
              >
            </q-item-section>
            <q-item-section side top>
              <q-chip dense :class="getIssueTrackerLabelColor(issue.status)">
                <q-item-label caption class="q-px-xs testClass">{{
                  issue.status
                }}</q-item-label>
              </q-chip>
            </q-item-section>

            <q-item-section side>
              <q-icon color="primary" name="chevron_right" />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <div class="flex items-end justify-around ellipsis">
                <q-item-label>
                  <span class="text-caption">created on</span>
                  <span class="q-mx-sm">{{
                    dateTimeHelper.formatDateTimeFromRestAPIForUI(
                      issue.createdDate,
                      false
                    )
                  }}</span>
                </q-item-label>
                <!-- <space></space> -->
                <q-item-label>
                  <span class="text-caption">assigned to:</span>
                  <span class="q-mx-sm">{{ issue.assignedTo }}</span>
                </q-item-label>
              </div>
            </q-item-section>
          </q-item>
          <q-separator spaced inset></q-separator>
        </q-list>

        <!-- demo filter options interface need to implement -->
        <q-dialog v-model="showAdvOptions" :position="position">
          <AdvancedFilters />
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
/* .testClass {
  background-color: green;
  color: white;
} */
</style>
