<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
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
});

const children = computed(() => {
  return contactListsStore.Children;
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
        <div v-for="child in children" :key="child.id">
          <q-card-section v-if="child.id == ObjectType.Note">
            <q-list bordered class="rounded-borders">
              <q-expansion-item
                expand-separator
                expand-icon-class="text-primary"
                dense
              >
                <template v-slot:header>
                  <q-item-section side>
                    <div class="row items-center">
                      <q-icon name="subject" size="sm"></q-icon>
                    </div>
                  </q-item-section>
                  <q-item-section>
                    Notes ({{ notesCount.value }})</q-item-section
                  >

                  <q-item-section side>
                    <q-btn
                      :to="{
                        name: 'newNotes',
                        params: {
                          id: -1,
                          objectTypeId: ObjectType.Contact,
                          objectId: contactDetails?.id,
                        },
                      }"
                      size="sm"
                      flat
                      round
                      dense
                      icon="add"
                    >
                    </q-btn>
                  </q-item-section>
                </template>
                <q-separator></q-separator>
                <NoteList @numberOfNotes="handleNoteCount" :params="parent" />
              </q-expansion-item>
            </q-list>
          </q-card-section>
          <q-card-section v-if="child.id == ObjectType.ActivityTabForCrm">
            <q-list bordered class="rounded-borders">
              <q-expansion-item
                expand-separator
                expand-icon-class="text-primary"
                dense
              >
                <template v-slot:header>
                  <q-item-section side>
                    <div class="row items-center">
                      <q-icon name="calendar_month" size="sm"></q-icon>
                    </div>
                  </q-item-section>
                  <q-item-section> Events ({{ eventsCount }})</q-item-section>
                  <q-item-section side>
                    <q-btn
                      :to="{
                        name: 'newEvent',
                        params: {
                          id: -1,
                          objectTypeId: ObjectType.Contact,
                          objectId: contactDetails?.id,
                          appName: 'contact',
                        },
                      }"
                      size="sm"
                      flat
                      round
                      dense
                      icon="add"
                    >
                    </q-btn>
                  </q-item-section>
                </template>
                <q-separator></q-separator>
                <EventsList
                  @numberOfEvents="handleEventCount"
                  :params="parent2"
                />
              </q-expansion-item>
            </q-list>
          </q-card-section>
          <q-card-section v-if="child.id == ObjectType.ActivityTabForCrm">
            <q-list bordered class="rounded-borders">
              <q-expansion-item
                expand-separator
                expand-icon-class="text-primary"
                dense
              >
                <template v-slot:header>
                  <q-item-section side>
                    <div class="row items-center">
                      <q-icon name="checklist" size="sm"></q-icon>
                    </div>
                  </q-item-section>
                  <q-item-section>Tasks ({{ tasksCount }})</q-item-section>

                  <q-item-section side>
                    <q-btn
                      :to="{
                        name: 'newTask',
                        params: {
                          id: -1,
                          objectTypeId: ObjectType.Contact,
                          objectId: contactDetails?.id,
                          appName: 'contact',
                        },
                      }"
                      size="sm"
                      flat
                      round
                      dense
                      icon="add"
                    >
                    </q-btn>
                  </q-item-section>
                </template>
                <q-separator></q-separator>
                <TaskMetaSummary
                  @numberOfTasks="handleTaskCount"
                  :parent="parent2"
                />
              </q-expansion-item>
            </q-list>
          </q-card-section>
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
