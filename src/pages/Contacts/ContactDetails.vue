<!--
TODO: skd: Provide a way to edit the image also [1.5h]
TODO: skd: Implement child events the same way as implemented in OfficeClip. Do at least the UI [2h]
-->

<script setup lang="ts">
import { ref, onBeforeMount, computed, onMounted } from 'vue';
import { useContactDetailsStore } from '../../stores/ContactDetailsStore';
import { useContactListsStore } from '../../stores/ContactListsStore';
import { useRoute, useRouter } from 'vue-router';
import NoteList from '../../components/Notes/NotesListCtrl.vue';
import EventsList from '../../components/Events/EventsListCtrl.vue';
import TasksList from 'components/tasks/tasksListCtrl.vue';
import ContactDetails from '../../components/Contacts/ContactDetails.vue';
import MetaDetails from '../../components/Meta/MetaDetails.vue';
import { ObjectType } from '../../helpers/util';
import { useQuasar } from 'quasar';
import TasksListCtrl from "components/tasks/tasksListCtrl.vue";

console.log('TESTING CONTACTVIEW: Setup');
const model = ref('1');
const contactDetailsStore = useContactDetailsStore();
const contactListsStore = useContactListsStore();
//const eventsStore = useEventsStore();
//const allEvents = eventsStore.getEventsById(-1,-1)
const route = useRoute();
const router = useRouter();
const $q = useQuasar();

// onBeforeMount(() => {
//   //contactsStore.$reset;
//   console.log('TESTING CONTACTVIEW: onBeforeMount');
//   console.log('Contactstorevarialble testing:', contactDetailsStore);
//   contactDetailsStore.getContactDetails(Number(route.params.id));
//   contactDetailsStore.getContactLists();
//   console.log(`ContactDetails: params: ${params.value}`);
// });

onBeforeMount(async () => {
  try {
    // See: https://github.com/vuejs/pinia/discussions/1078#discussioncomment-4240994
    //await sessionStore.getSession();
    //homeIconStore.getHomeIcons();
    await contactDetailsStore.getContactDetails(Number(route.params.id));
    console.log('On before mount: ', contactDetailsStore.ContactDetails)
    await contactDetailsStore.getContactLists();
  } catch (error) {
    console.log('Error Msg: ', error);
  }
});

onMounted(() => {
  contactListsStore.getContactList();
})

const contactDetails = computed(() => {
  console.log('Contact Details:', contactDetails)
  return contactDetailsStore.ContactDetails;
});

const children = computed(() => {
  return contactListsStore.Children;
});

const fullName = computed(() => {
  return `${contactDetails.value?.first_name} ${contactDetails.value?.last_name}`;
});

const id = ref<string | string[]>('0');
id.value = route.params.id;

const stateName = computed(() => {
  const item = contactDetailsStore.States.find(
    (state) => state.id === contactDetails.value?.state_id
  );
  const stateItem = item ? item.name : '';
  console.log('State Name - ', stateItem)
  return stateItem;
});

const countryName = computed(() => {
  const item = contactDetailsStore.Countries.find(
    (country) => country.id === contactDetails.value?.country_id
  );
  const countryItem = item ? item.name : '';
  console.log('Country Name - ', countryItem)
  return countryItem;
});

const params = computed(() => {
  return {
    contactDetails: contactDetails.value,
    stateName: stateName.value,
    countryName: countryName.value
  };
});

const parent = ref({
  parentObjectId: id.value,
  parentObjectServiceType: ObjectType.Contact,
  selectedNoteBook: -1,
});

const parent2 = ref({
  parentObjectId: id.value,
  parentObjectServiceType: ObjectType.Contact,
});

// const params = ref({
//   contact: contact.value,
//   stateName: stateName.value,
// });

const notesCount = ref<any>('0');

const handleNoteCount = (value: string) => {
  notesCount.value = value;
  console.log(`handleNoteCount(): ${notesCount.value}`);
};

const eventsCount = ref<any>('0');

const handleEventCount = (value: string) => {
  eventsCount.value = value;
  console.log(`handleEventCount(): ${eventsCount.value}`);
};

const tasksCount = ref<any>('0');

const handleTaskCount = (value: string) => {
  tasksCount.value = value;
  console.log(`handleTaskCount(): ${tasksCount.value}`);
};

//console.log(stateName);
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn @click="$router.go(-1)" flat round dense color="white" icon="arrow_back">
        </q-btn>
        <q-toolbar-title> Contact details </q-toolbar-title>

        <q-btn @click="
          model === '1'
            ? $router.push({ name: 'editContactDetails', params: { id: id } })
            : $router.push({ name: 'editMetaDetail', params: { id: id } })
          " flat round dense color="white" icon="edit" />

        <q-btn @click="
          contactDetailsStore.deleteContactDetails(contactDetails?.id);
        $router.go(-1);
        " flat round dense color="white" icon="delete" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-card class="relative-position card-example" flat bordered>
        <q-card-section class="q-pb-none">
          <div class="center">
            <q-avatar color="grey-3" size="200px" class="q-mb-sm">
              <img :src="contactDetails?.picture" alt="{{ fullName }}" />
            </q-avatar>
            <div class="q-mt-md">
              <q-btn-toggle v-model="model" class="oc-custom-toggle" no-caps rounded unelevated toggle-color="primary"
                color="white" text-color="primary" :options="[
                  { label: 'Summary', value: '1' },
                  { label: 'Details', value: '2' },
                ]" />
            </div>
          </div>
        </q-card-section>
        <ContactDetails v-if="model === '1'" :params="params" />
        <MetaDetails v-if="model === '2'" :params="parent" />

        <div v-for="child in children" :key="child.id">
          <q-card-section v-if="child.id == ObjectType.Note">
            <q-list bordered class="rounded-borders">
              <q-expansion-item expand-separator expand-icon-class="text-primary" dense>
                <template v-slot:header>
                  <q-item-section side>
                    <div class="row items-center">
                      <q-icon name="subject"></q-icon>
                    </div>
                  </q-item-section>
                  <q-item-section> Notes ({{ notesCount }})</q-item-section>

                  <q-item-section side>
                    <q-btn :to="{
                      name: 'newNotes',
                      params: {
                        id: -1,
                        objectTypeId: ObjectType.Contact,
                        objectId: contactDetails?.id
                      },
                    }" size="sm" flat round dense icon="add">
                    </q-btn>
                  </q-item-section>
                </template>
                <q-separator></q-separator>
                <NoteList @numberOfNotes="handleNoteCount" :params="parent" />
              </q-expansion-item>
            </q-list>
          </q-card-section>

          <q-card-section v-if="child.id == ObjectType.Event">
            <q-list bordered class="rounded-borders">
              <q-expansion-item expand-separator expand-icon-class="text-primary" dense>
                <template v-slot:header>
                  <q-item-section side>
                    <div class="row items-center">
                      <q-icon name="calendar_month"></q-icon>
                    </div>
                  </q-item-section>
                  <q-item-section> Events ({{ eventsCount }})</q-item-section>

                  <q-item-section side>
                    <q-btn :to="{
                      name: 'newEvent',
                      params: {
                        id: -1,
                        objectTypeId: ObjectType.Contact,
                        objectId: contactDetails?.id
                      },
                    }" size="sm" flat round dense icon="add">
                    </q-btn>
                  </q-item-section>
                </template>
                <q-separator></q-separator>
                <EventsList @numberOfEvents="handleEventCount" :params="parent2" />
              </q-expansion-item>
            </q-list>
          </q-card-section>

          <q-card-section v-if="child.id == ObjectType.Task">
            <q-list bordered class="rounded-borders">
              <q-expansion-item expand-separator expand-icon-class="text-primary" dense>
                <template v-slot:header>
                  <q-item-section side>
                    <div class="row items-center">
                      <q-icon name="checklist"></q-icon>
                    </div>
                  </q-item-section>
                  <q-item-section>Tasks ({{ tasksCount }})</q-item-section>

                  <q-item-section side>
                    <q-btn :to="{
                      name: 'newTask',
                      params: {
                        id: -1,
                        objectTypeId: ObjectType.Contact,
                        objectId: contactDetails?.id
                      },
                    }" size="sm" flat round dense icon="add">
                    </q-btn>
                  </q-item-section>
                </template>
                <q-separator></q-separator>
                <tasks-list-ctrl @numberOfTasks="handleTaskCount" :parent="parent2" />
              </q-expansion-item>
            </q-list>
          </q-card-section>
        </div>

      </q-card>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
/* .q-img__content > div {
  padding: 2px 16px !important;
  background: rgba(0, 0, 0, 0.6);
} */

.center {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.oc-custom-toggle {
  border: 1px solid var(--q-primary);
}
</style>
