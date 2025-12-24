<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
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
import OC_AddButton from 'src/components/OCcomponents/OC_AddButton.vue';

const loading = ref(true);
const model = ref('1');
const contactDetailsStore = useContactDetailsStore();
const contactListsStore = useContactListsStore();
const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const id = route.params.id as string;

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
      <q-page class="column">
        <div>
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
          </q-card>
        </div>
        <!-- <q-space /> -->
        <div v-if="children.length > 0" class="q-pa-md">
          <q-expansion-item
            v-if="showNotes"
            group="children"
            icon="notes"
            :label="`Notes`"
            header-class="text-primary"
            class="q-mb-md rounded-borders"
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
            <NotesList
              :parent-object-id="parent.parentObjectId"
              :parent-object-service-type="parent.parentObjectServiceType"
              @notes-loaded="handleNoteCount"
            />
          </q-expansion-item>

          <q-expansion-item
            v-if="showActivities"
            group="children"
            icon="event"
            label="Events"
            header-class="text-primary"
            class="q-mb-md"
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
            <EventsList @numberOfEvents="handleEventCount" :params="parent2" />
          </q-expansion-item>

          <q-expansion-item
            v-if="showActivities"
            group="children"
            icon="task"
            label="Tasks"
            header-class="text-primary"
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
            <TaskMetaSummary
              @numberOfTasks="handleTaskCount"
              :parent="parent2"
            />
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
