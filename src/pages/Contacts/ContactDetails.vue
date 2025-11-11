<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue';
import { useContactDetailsStore } from '../../stores/contact/ContactDetailsStore';
import { useContactListsStore } from '../../stores/contact/ContactListsStore';
import { useRoute, useRouter } from 'vue-router';
import NoteList from '../../components/Notes/NotesListCtrl.vue';
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
const id = ref<string | string[]>('0');
id.value = route.params.id;

const myDrawer = ref();

const loadContactDetails = async () => {
  loading.value = true;
  try {
    // See: https://github.com/vuejs/pinia/discussions/1078#discussioncomment-4240994
    await contactDetailsStore.getContactDetails(route.params.id as string);
    await contactDetailsStore.getContactLists();
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

  const tabsToLoad = [];
  if (showNotes.value) {
    tabsToLoad.push('notes');
  }
  if (showActivities.value) {
    tabsToLoad.push('events');
    tabsToLoad.push('tasks');
  }

  if (tabsToLoad.length > 0) {
    const initialTab = tabsToLoad[0];
    tab.value = initialTab;
    await nextTick();

    for (let i = 1; i < tabsToLoad.length; i++) {
      tab.value = tabsToLoad[i];
      await nextTick();
    }
    tab.value = initialTab;
  }
});

const children = computed(() => {
  return contactListsStore.Children;
});

const tab = ref('');

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
  parentObjectId: id.value,
  parentObjectServiceType: ObjectType.Contact.toString(),
  selectedNoteBook: '',
});

const parent2 = ref({
  parentObjectId: id.value,
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
      params: { id: id.value },
    });
  } else {
    router.push({ name: 'editMetaDetail', params: { id: id.value } });
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
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
            dense
            :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
          >
            <q-tab v-if="showNotes" name="notes">
              <div class="row items-center no-wrap">
                <q-icon name="subject" class="q-mr-sm" />
                <div>Notes ({{ notesCount }})</div>
              </div>
            </q-tab>
            <q-tab v-if="showActivities" name="events">
              <div class="row items-center no-wrap">
                <q-icon name="calendar_month" class="q-mr-sm" />
                <div>Events ({{ eventsCount }})</div>
              </div>
            </q-tab>
            <q-tab v-if="showActivities" name="tasks">
              <div class="row items-center no-wrap">
                <q-icon name="checklist" class="q-mr-sm" />
                <div>Tasks ({{ tasksCount }})</div>
              </div>
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
              <NoteList @numberOfNotes="handleNoteCount" :params="parent" />
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

<!-- <style scoped>
.center {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.oc-custom-toggle {
  border: 1px solid var(--q-primary);
}
</style> -->
