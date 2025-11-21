<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { useContactDetailsStore } from '../../stores/contact/ContactDetailsStore';
import { useContactListsStore } from '../../stores/contact/ContactListsStore';
import { useRoute, useRouter } from 'vue-router';
import NotesList from '../../components/Notes/NotesList.vue';
import EventsList from '../../components/Events/EventsListCtrl.vue';
import ContactDetails from '../../components/Contacts/ContactDetails.vue';
import MetaDetails from '../../components/Meta/MetaDetails.vue';
import { ObjectType } from '../../helpers/util';
import TaskMetaSummary from '../../components/tasks/TaskMetaSummaryItem.vue';
import { isAllowed } from 'src/helpers/security';
import { useQuasar } from 'quasar';
import ConfirmationDialog from '../../components/general/ConfirmDelete.vue';
import OC_Drawer from 'src/components/OC_Drawer.vue';
import OC_Loader from 'src/components/general/OC_Loader.vue';
import OC_Header from 'src/components/OCcomponents/OC_Header.vue';

const loading = ref(true);
const model = ref('1');
const contactDetailsStore = useContactDetailsStore();
const contactListsStore = useContactListsStore();
const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const id = route.params.id as string;

const { selectedTab: tab } = storeToRefs(contactDetailsStore);

const myDrawer = ref();

const loadContactDetails = async () => {
  loading.value = true;
  try {
    // See: https://github.com/vuejs/pinia/discussions/1078#discussioncomment-4240994
    await contactDetailsStore.getContactDetails(route.params.id as string);
    await contactListsStore.getChildren();
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      await router.push({ path: '/contactSummary' });
      router.go(0);
    });
  } finally {
    loading.value = false;
  }
};

const contactDetails = computed(() => {
  return contactDetailsStore.ContactDetails;
});

onMounted(async () => {
  await loadContactDetails();

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
  return contactListsStore.Children;
});

const showNotes = computed(() => {
  return children.value.some((c) => c.id === ObjectType.Note);
});

const showActivities = computed(() => {
  return children.value.some((c) => c.id === ObjectType.ActivityTabForCrm);
});

const params = computed(() => {
  return {
    contactDetails: contactDetails.value,
  };
});

const parent = ref({
  parentObjectId: id,
  parentObjectServiceType: ObjectType.Contact.toString(),
  selectedNoteBook: '',
});

const parent2 = ref({
  parentObjectId: id,
  parentObjectServiceType: ObjectType.Contact.toString(),
  appName: 'contact',
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
  const data = contactDetails.value?.security;
  return isAllowed({
    security: { write: data?.write },
  });
});

const isAllowDelete = computed(() => {
  const data = contactDetails.value?.security;
  return isAllowed({
    security: { delete: data?.delete },
  });
});

const title = ref('Confirm');
const message = ref('Are you sure you want to delete this Contact?');
const showConfirmationDialog = ref(false);

const displayConfirmationDialog = () => {
  showConfirmationDialog.value = true;
};
const cancelConfirmation = () => {
  showConfirmationDialog.value = false;
};

const confirmDeletion = async () => {
  try {
    await contactDetailsStore.deleteContactDetails(
      contactDetails.value?.id as string,
    );
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
    objectTypeId: ObjectType.Contact,
    objectId: contactDetails.value?.id,
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
  if (model.value === '1') {
    router.push({
      name: 'editContactDetails',
      params: { id: id },
    });
  } else {
    router.push({ name: 'editMetaDetail', params: { id: id } });
  }
};
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <OC_Header
      title="Contact details"
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
        <q-card-section class="q-pb-none flex flex-center">
          <div>
            <q-avatar
              color="grey-3"
              size="120px"
              class="q-mb-sm"
              style="color: inherit"
            >
              <q-img
                v-if="contactDetails?.picture"
                v-bind:src="contactDetails?.picture"
              />
              <q-icon name="person" v-else />
            </q-avatar>
          </div>
        </q-card-section>
        <ContactDetails v-if="model === '1'" :params="params" />
        <MetaDetails v-if="model === '2'" :params="parent" />
        <div v-if="children.length > 0" class="q-mt-lg">
          <q-tabs
            v-model="tab"
            @update:model-value="contactDetailsStore.setSelectedTab($event)"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
            dense
            inline-label
            :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'"
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
            <q-tab-panel name="notes" v-if="showNotes">
              <NotesList
                :parent-object-id="parent.parentObjectId"
                :parent-object-service-type="parent.parentObjectServiceType"
                @notes-loaded="handleNoteCount"
              />
            </q-tab-panel>

            <q-tab-panel name="events" v-if="showActivities">
              <EventsList
                @numberOfEvents="handleEventCount"
                :params="parent2"
              />
            </q-tab-panel>

            <q-tab-panel name="tasks" v-if="showActivities">
              <TaskMetaSummary
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
