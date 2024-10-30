<script lang="ts" setup>
import { onBeforeMount, ref, Ref } from 'vue';
import { searchFilter } from 'src/models/issueTracker/searchFilter';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useIssueListsStore } from 'stores/issueTracker/issueListsStore';
import { useIssueSummaryStore } from 'stores/issueTracker/issueSummaryStore';
import { user } from '../../models/issueTracker/issueLists';

const emit = defineEmits(['advancedOptionsGenerated', 'filterCount']);
const $q = useQuasar();
const router = useRouter();
const issueListsStore = useIssueListsStore();
const issueSummaryStore = useIssueSummaryStore();

const props = defineProps<{
  // parent: any;
  filterOptions: searchFilter;
}>();

const advancedOptions: Ref<searchFilter> = ref({
  searchString: '',
  starredIssues: '',
  statusId: '',
  criticalityId: '',
  categoryId: '',
  kindId: '',
  createdById: '',
  assignedToId: '',
  modifiedById: '',
});

function filterNumber(filter: searchFilter) {
  let val = 0;
  val += filter.statusId ? 1 : 0;
  val += filter.criticalityId ? 1 : 0;
  val += filter.categoryId ? 1 : 0;
  val += filter.assignedToId ? 1 : 0;
  val += filter.kindId ? 1 : 0;
  val += filter.createdById ? 1 : 0;
  val += filter.modifiedById ? 1 : 0;
  return val;
}
//const filterModel = ref(null);
// const filterOptions = ['Open', 'Closed', 'Resolved', 'Reopened'];

function emitOptions() {
  issueSummaryStore.setFilter(advancedOptions.value);
  issueSummaryStore.resetPageNumber();
  issueSummaryStore.getIssuesUpdated(true);

  emit('advancedOptionsGenerated', advancedOptions.value);
  emit('filterCount', filterNumber(advancedOptions.value));
}

onBeforeMount(async () => {
  try {
    await issueListsStore.getIssueLists();
    Object.assign(advancedOptions.value, props.filterOptions);
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      await router.push({ path: '/HomePage' });
    });
  }
});

const userList: Ref<user[]> = ref([]);

async function filterFn(val: string, update: any, abort: any) {
  // if (val.length < 2) {
  //   abort();
  //   return;
  // } else if (val.length >= 2) {
  userList.value = [];
  await issueListsStore.getFilteredUsers(val);
  userList.value = issueListsStore.users;
  //}

  update(() => {
    const needle = val.toLowerCase();
    userList.value = issueListsStore.users.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  });
}
</script>

<template>
  <q-card style="width: 700px; max-width: 80vw">
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6">Filter Options</div>
      <q-space></q-space>
      <q-btn icon="close" flat round dense v-close-popup></q-btn>
    </q-card-section>

    <q-card-section>
      <div class="q-pa-md row">
        <q-item-section>
          <q-select
            outlined
            label="Status"
            v-model="advancedOptions.statusId"
            :options="issueListsStore.status"
            emit-value
            map-options
            option-label="name"
            option-value="id"
          />
        </q-item-section>
      </div>
      <div class="q-pa-md row">
        <q-item-section>
          <q-select
            outlined
            label="Criticality"
            v-model="advancedOptions.criticalityId"
            :options="issueListsStore.Criticality"
            emit-value
            map-options
            option-label="name"
            option-value="id"
          />
        </q-item-section>
      </div>
      <div class="q-pa-md row">
        <q-item-section>
          <q-select
            outlined
            label="Category"
            v-model="advancedOptions.categoryId"
            :options="issueListsStore.category"
            emit-value
            map-options
            option-label="name"
            option-value="id"
          />
        </q-item-section>
      </div>
      <div class="q-pa-md row">
        <q-item-section>
          <q-select
            outlined
            label="Created by"
            v-model="advancedOptions.createdById"
            :options="issueListsStore.Users"
            clearable
            emit-value
            map-options
            option-label="name"
            option-value="id"
            use-input
            @filter="filterFn"
          />
        </q-item-section>
      </div>
      <div class="q-pa-md row">
        <q-item-section>
          <q-select
            outlined
            label="Modified by"
            v-model="advancedOptions.modifiedById"
            :options="issueListsStore.users"
            clearable
            emit-value
            map-options
            option-label="name"
            option-value="id"
            use-input
            @filter="filterFn"
          />
        </q-item-section>
      </div>
    </q-card-section>
    <q-card-actions>
      <q-btn v-close-popup color="primary" label="Apply" @click="emitOptions" />
    </q-card-actions>
  </q-card>
</template>
