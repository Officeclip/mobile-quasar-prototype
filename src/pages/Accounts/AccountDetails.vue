<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { useAccountDetailsStore } from '../../stores/account/accountDetailsStore';
import { useAccountListsStore } from '../../stores/account/accountListsStore';
import { useRoute, useRouter } from 'vue-router';
import NotesList from '../../components/Notes/NotesList.vue';
import EventsList from '../../components/Events/EventsListCtrl.vue';
import { ObjectType } from '../../helpers/util';
import TaskMetaSummary from '../../components/tasks/TaskMetaSummaryItem.vue';
import { isAllowed } from 'src/helpers/security';
import { useQuasar } from 'quasar';
import ConfirmationDialog from '../../components/general/ConfirmDelete.vue';
import OC_Drawer from 'src/components/OC_Drawer.vue';
import OC_Loader from 'src/components/general/OC_Loader.vue';
import OC_Header from 'src/components/OCcomponents/OC_Header.vue';

const loading = ref(true);
const accountDetailsStore = useAccountDetailsStore();
const accountsListsStore = useAccountListsStore();
const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const id = route.params.id as string;
const { selectedTab: tab } = storeToRefs(accountDetailsStore);

const myDrawer = ref();

const loadAccountDetails = async () => {
  loading.value = true;
  try {
    await accountDetailsStore.getAccountDetails(route.params.id as string);
    await accountsListsStore.getAccountLists();
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      await router.push({ path: '/accountSummary' });
      router.go(0);
    });
  } finally {
    loading.value = false;
  }
};

const accountDetails = computed(() => {
  return accountDetailsStore.AccountDetails;
});

const filterAccountDetails = computed(() => {
  const details = accountDetailsStore.AccountDetails;
  if (!details) return [];
  return [
    {
      label: 'Account Name',
      value: details.account_name,
      show: !!details.account_name,
    },
    {
      label: 'Account Number',
      value: details.account_number,
      show: !!details.account_number,
    },
    {
      label: 'Email Address',
      value: details.email_address,
      show: !!details.email_address,
    },
    {
      label: 'Country',
      value: details.country_name,
      show: !!details.country_name,
    },
    {
      label: 'Phone Number',
      value: details.main_phone,
      show: !!details.main_phone,
    },
    {
      label: 'Address',
      value: details.street_address,
      show: !!details.street_address,
    },
  ];
});

onMounted(async () => {
  await loadAccountDetails();

  const availableTabs = [];
  if (showNotes.value) {
    availableTabs.push('notes');
  }
  if (showActivities.value) {
    availableTabs.push('events');
    availableTabs.push('tasks');
  }

  if (availableTabs.length > 0) {
    let desiredTab = tab.value;

    // If the stored tab is not available, default to the first one.
    if (!availableTabs.includes(desiredTab)) {
      desiredTab = availableTabs[0];
    }

    // To pre-load all tabs for their counts, we can cycle through them.
    // This ensures they are rendered once. `keep-alive` will cache them.
    for (const tabName of availableTabs) {
      tab.value = tabName;
      await nextTick();
    }

    // Finally, set the tab to the one we actually want to show.
    tab.value = desiredTab;
  }
});

const children = computed(() => {
  return accountsListsStore.Children;
});

const showNotes = computed(() => {
  return children.value.some((c) => c.id === ObjectType.Note);
});

const showActivities = computed(() => {
  return children.value.some((c) => c.id === ObjectType.ActivityTabForCrm);
});

const parent = ref({
  parentObjectId: id,
  parentObjectServiceType: ObjectType.Account.toString(),
  selectedNoteBook: '',
});

const parent2 = ref({
  parentObjectId: id,
  parentObjectServiceType: ObjectType.Account.toString(),
  appName: 'account',
});

const notesCount = ref<any>('0');

const handleNoteCount = (value: string) => {
  notesCount.value = value;
};

const eventsCount = ref<any>('0');

const handleEventCount = (value: string) => {
  eventsCount.value = value;
};

const tasksCount = ref<any>('0');

const handleTaskCount = (value: string) => {
  tasksCount.value = value;
};

const isAllowEdit = computed(() => {
  const data = accountDetails.value?.security;
  return isAllowed({
    security: { write: data?.write },
  });
});

const isAllowDelete = computed(() => {
  const data = accountDetails.value?.security;
  return isAllowed({
    security: { delete: data?.delete },
  });
});

const title = ref('Confirm');
const message = ref('Are you sure you want to delete this Account?');
const showConfirmationDialog = ref(false);

const displayConfirmationDialog = () => {
  showConfirmationDialog.value = true;
};
const cancelConfirmation = () => {
  showConfirmationDialog.value = false;
};

const confirmDeletion = async () => {
  try {
    await accountDetailsStore.deleteAccount(accountDetails.value?.id as string);
    showConfirmationDialog.value = false;
    router.go(-1);
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      showConfirmationDialog.value = false;
    });
  }
};

const getAddRoute = (tabName: string) => {
  const baseParams = {
    id: -1,
    objectTypeId: ObjectType.Account,
    objectId: accountDetails.value?.id,
  };

  let routeName = '';
  const extraParams: { appName?: string } = {};

  if (tabName === 'notes') {
    routeName = 'newNotes';
  } else if (tabName === 'events') {
    routeName = 'newEvent';
    extraParams.appName = 'contact';
  } else if (tabName === 'tasks') {
    routeName = 'newTask';
    extraParams.appName = 'contact';
  }

  return {
    name: routeName,
    params: { ...baseParams, ...extraParams },
  };
};

function toggleLeftDrawer() {
  if (myDrawer.value == null) return;
  myDrawer.value.toggleLeftDrawer();
}

const handleEditClick = () => {
  router.push({
    name: 'editAccountDetails',
    params: { id: id },
  });
};
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <OC_Header
      title="Account details"
      :show-menu-button="true"
      @toggle-drawer="toggleLeftDrawer"
      :show-edit-button="isAllowEdit"
      @edit="handleEditClick"
      :show-delete-button="isAllowDelete"
      @delete="displayConfirmationDialog"
    ></OC_Header>
    <OC_Drawer ref="myDrawer" />
    <q-page-container>
      <OC_Loader :visible="loading" />
      <q-card flat>
        <div class="q-pa-md">
          <div class="row q-col-gutter-md">
            <div
              v-for="(item, index) in filterAccountDetails"
              :key="index"
              class="col-12 col-sm-6 col-md-4"
            >
              <q-item v-if="item.show">
                <q-item-section>
                  <q-item-label caption>
                    {{ item.label }}
                  </q-item-label>
                  <div v-if="item.label === 'Address'">
                    <q-item-label class="text-body1">
                      {{ item.value || 'N/A' }}
                    </q-item-label>
                    <q-item-label v-if="accountDetails?.city">
                      {{ accountDetails?.city }},
                      {{ accountDetails?.state_name }}
                    </q-item-label>
                    <q-item-label v-if="accountDetails?.country_name">
                      {{ accountDetails?.country_name }},
                      {{ accountDetails?.postal_code }}
                    </q-item-label>
                  </div>
                  <div v-else>
                    <q-item-label class="text-body1">
                      {{ item.value || 'N/A' }}
                    </q-item-label>
                  </div>
                </q-item-section>
              </q-item>
            </div>
          </div>
        </div>
        <div v-if="children.length > 0" class="q-mt-lg">
          <q-tabs
            v-model="tab"
            @update:model-value="accountDetailsStore.setSelectedTab"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
            dense
            inline-label
            :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'"
            style="border-radius: 8px"
          >
            <q-tab v-if="showNotes" name="notes" label="Notes" icon="subject">
              <q-badge v-if="notesCount > 0" class="q-ml-sm">{{
                notesCount
              }}</q-badge>
            </q-tab>
            <q-tab
              v-if="showActivities"
              name="events"
              label="Events"
              icon="calendar_month"
            >
              <q-badge v-if="eventsCount > 0" class="q-ml-sm">{{
                eventsCount
              }}</q-badge>
            </q-tab>
            <q-tab
              v-if="showActivities"
              name="tasks"
              label="Tasks"
              icon="checklist"
            >
              <q-badge v-if="tasksCount > 0" class="q-ml-sm">{{
                tasksCount
              }}</q-badge>
            </q-tab>
          </q-tabs>

          <q-separator />

          <div class="row justify-end q-mt-sm q-mr-sm">
            <q-btn
              :to="getAddRoute(tab)"
              size="sm"
              outline
              rounded
              dense
              icon="add"
              label="Add"
              class="q-px-sm"
            />
          </div>

          <q-tab-panels v-model="tab" animated keep-alive>
            <q-tab-panel name="notes">
              <NotesList
                v-if="showNotes"
                :parent-object-id="parent.parentObjectId"
                :parent-object-service-type="parent.parentObjectServiceType"
                @notes-loaded="handleNoteCount"
              />
            </q-tab-panel>

            <q-tab-panel name="events">
              <EventsList
                v-if="showActivities"
                @numberOfEvents="handleEventCount"
                :params="parent2"
              />
            </q-tab-panel>

            <q-tab-panel name="tasks">
              <TaskMetaSummary
                v-if="showActivities"
                @numberOfTasks="handleTaskCount"
                :parent="parent2"
              />
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </q-card>
    </q-page-container>
  </q-layout>
  <ConfirmationDialog
    v-if="showConfirmationDialog"
    :showConfirmationDialog="showConfirmationDialog"
    :title="title"
    :message="message"
    @cancel="cancelConfirmation"
    @confirm="confirmDeletion"
  />
</template>
