<!--
TODO: skd: Provide a way to edit the image also [1.5h]
TODO: skd: Implement child events the same way as implemented in OfficeClip. Do at least the UI [2h]
-->
<script setup lang="ts">
import { ref, onBeforeMount, computed, onMounted } from 'vue';
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

const model = ref('1');
const contactDetailsStore = useContactDetailsStore();
const contactListsStore = useContactListsStore();
const route = useRoute();
const router = useRouter();
const $q = useQuasar();

const isLoaded = ref<boolean>(false);

onBeforeMount(async () => {
  try {
    // See: https://github.com/vuejs/pinia/discussions/1078#discussioncomment-4240994
    await contactDetailsStore.getContactDetails(route.params.id as string);
    await contactDetailsStore.getContactLists();
  } catch (error) {
    //console.error('Error Msg: ', error);
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      await router.push({ path: '/contactSummary' });
      await router.go(0);
    });
  } finally {
    isLoaded.value = true;
  }
});

// onMounted(async () => {
//   try {
//     await contactListsStore.getContactList();
//   } catch (error) {
//     $q.dialog({
//       title: 'Alert',
//       message: error as string,
//     }).onOk(async () => {
//       await router.push({ path: '/contactSummary' });
//       await router.go(0);
//     });
//   }
// });

const contactDetails = computed(() => {
  return contactDetailsStore.ContactDetails;
});

const children = computed(() => {
  return contactListsStore.Children;
});

const id = ref<string | string[]>('0');
id.value = route.params.id;

const stateName = computed(() => {
  const item = contactDetailsStore.States.find(
    (state) => state.id === contactDetails.value?.state_id
  );
  const stateItem = item ? item.name : '';
  return stateItem;
});

const countryName = computed(() => {
  const item = contactDetailsStore.Countries.find(
    (country) => country.id === contactDetails.value?.country_id
  );
  const countryItem = item ? item.name : '';
  return countryItem;
});

const params = computed(() => {
  return {
    contactDetails: contactDetails.value,
    stateName: stateName.value,
    countryName: countryName.value,
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

//TODO: CR: 2024-05-17: nk: Fix the below type error?
const isAllowEdit = computed(() => {
  return isAllowed({
    security: { write: contactDetails.value?.security.write },
  });
});

//TODO: CR: 2024-05-17: nk: Fix the below type error?
const isAllowDelete = computed(() => {
  return isAllowed({
    security: { delete: contactDetails.value?.security.delete },
  });
});

const title = ref('Confirm');
const message = ref('Are you sure you want to delete this task?');
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
      contactDetails.value?.id as string
    );
    showConfirmationDialog.value = false;
    router.go(-1);
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      console.log('*** Delete contact:onSubmit(...):onOK ***');
      showConfirmationDialog.value = false;
      //router.go(0);
    });
  }
};
</script>

<style>
.q-dialog__backdrop {
  backdrop-filter: blur(7px);
}
</style>

<template>
  <q-layout view="lHh Lpr lFf" v-if="isLoaded">
    <q-header reveal bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn
          @click="$router.go(-1)"
          flat
          round
          dense
          color="white"
          icon="arrow_back"
        >
        </q-btn>
        <q-toolbar-title> Contact details </q-toolbar-title>
        <div>
          <q-btn
            v-if="isAllowEdit"
            @click="
              model === '1'
                ? $router.push({
                    name: 'editContactDetails',
                    params: { id: id },
                  })
                : $router.push({ name: 'editMetaDetail', params: { id: id } })
            "
            flat
            round
            dense
            color="white"
            icon="edit"
          />
          <q-btn v-else dense disable flat icon="edit" round>
            <q-tooltip class="bg-accent">Editing is disabled</q-tooltip>
          </q-btn>
        </div>
        <div>
          <q-btn
            v-if="isAllowDelete"
            @click="displayConfirmationDialog"
            flat
            round
            dense
            color="white"
            icon="delete"
          /><q-btn v-else dense disable flat icon="delete" round>
            <q-tooltip class="bg-accent">Deleting is disabled</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-card class="relative-position card-example" flat bordered>
        <q-card-section class="q-pb-none">
          <div class="center">
            <q-avatar color="grey-3" size="200px" class="q-mb-sm">
              <q-img
                v-if="contactDetails?.picture"
                v-bind:src="contactDetails?.picture"
              />
              <q-icon name="image" v-else />
            </q-avatar>
            <!-- <div class="q-mt-md">
              <q-btn-toggle v-model="model" class="oc-custom-toggle" no-caps rounded unelevated toggle-color="primary"
                color="white" text-color="primary" :options="[
    { label: 'Summary', value: '1' },
    { label: 'Details', value: '2' },
  ]" />
            </div> -->
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
                      <q-icon name="subject"></q-icon>
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
                      <q-icon name="calendar_month"></q-icon>
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
                      <q-icon name="checklist"></q-icon>
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

<style scoped>
.center {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.oc-custom-toggle {
  border: 1px solid var(--q-primary);
}
</style>
