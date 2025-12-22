<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
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
import OC_AddButton from 'src/components/OCcomponents/OC_AddButton.vue';

const loading = ref(true);
const accountDetailsStore = useAccountDetailsStore();
const accountsListsStore = useAccountListsStore();
const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const id = route.params.id as string;

const myDrawer = ref();

const loadAccountDetails = async () => {
  loading.value = true;
  try {
    await accountDetailsStore.getAccountDetails(route.params.id as string);
    await accountsListsStore.getChildren();
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

const accountDetailProperties = computed(() => {
  // const details = accountDetailsStore.AccountDetails;
  const details = accountDetails.value;
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
const filterAccountDetails = computed(() => {
  return accountDetailProperties.value.filter((prop) => prop.show);
});

onMounted(async () => {
  await loadAccountDetails();
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
      <q-page class="column">
        <q-card flat>
          <div class="q-pa-md">
            <div class="row q-col-gutter-md">
              <div
                v-for="(item, index) in filterAccountDetails"
                :key="index"
                class="col-12 col-sm-6 flex items-start"
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
        </q-card>
        <!-- <q-space /> -->
        <div v-if="children.length > 0" class="q-pa-md">
          <q-expansion-item
            v-if="showNotes"
            group="children"
            icon="notes"
            :label="`Notes`"
            header-class="text-primary"
            class="q-mb-md shadow-1 rounded-borders"
          >
            <template v-slot:header>
              <q-item-section avatar>
                <q-icon name="description" />
              </q-item-section>

              <q-item-section>
                <div class="flex items-center">
                  <span>Notes</span>
                  <q-badge color="secondary" class="q-ml-sm">{{
                    notesCount
                  }}</q-badge>
                </div>
              </q-item-section>

              <q-item-section side>
                <OC_AddButton :route-to="getAddRoute('notes')" />
              </q-item-section>
            </template>
            <q-card>
              <q-card-section>
                <NotesList
                  :parent-object-id="parent.parentObjectId"
                  :parent-object-service-type="parent.parentObjectServiceType"
                  @notes-loaded="handleNoteCount"
                />
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-expansion-item
            v-if="showActivities"
            group="children"
            icon="event"
            label="Events"
            header-class="text-primary"
            class="q-mb-md shadow-1 rounded-borders"
          >
            <template v-slot:header>
              <q-item-section avatar>
                <q-icon name="event" />
              </q-item-section>

              <q-item-section>
                <div class="flex items-center">
                  <span>Events</span>
                  <q-badge color="secondary" class="q-ml-sm">{{
                    eventsCount
                  }}</q-badge>
                </div>
              </q-item-section>

              <q-item-section side>
                <OC_AddButton :route-to="getAddRoute('events')" />
              </q-item-section>
            </template>
            <q-card>
              <q-card-section>
                <EventsList
                  @numberOfEvents="handleEventCount"
                  :params="parent2"
                />
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-expansion-item
            v-if="showActivities"
            group="children"
            icon="task"
            label="Tasks"
            header-class="text-primary"
            class="shadow-1 rounded-borders"
          >
            <template v-slot:header>
              <q-item-section avatar>
                <q-icon name="task" />
              </q-item-section>

              <q-item-section>
                <div class="flex items-center">
                  <span>Tasks</span>
                  <q-badge color="secondary" class="q-ml-sm">{{
                    tasksCount
                  }}</q-badge>
                </div>
              </q-item-section>

              <q-item-section side>
                <OC_AddButton :route-to="getAddRoute('tasks')" />
              </q-item-section>
            </template>
            <q-card>
              <q-card-section>
                <TaskMetaSummary
                  @numberOfTasks="handleTaskCount"
                  :parent="parent2"
                />
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </div>
      </q-page>
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
