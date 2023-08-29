<!--
TODO: skd: Provide a way to edit the image also [1.5h]
TODO: skd: Implement child events the same way as implemented in OfficeClip. Do at least the UI [2h]
-->

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useContactsStore } from '../../stores/ContactsStore';
//import { useEventsStore } from 'src/stores/EventsStore';
import { useRoute } from 'vue-router';
import NoteList from '../../components/Notes/NotesListCtrl.vue';
import EventsList from '../../components/Events/EventsListCtrl.vue';
import TasksList from '../../components/Tasks/TasksListCtrl.vue';
import ContactSummary from '../../components/Contacts/ContactSummary.vue';
import ContactDetails from '../../components/Contacts/ContactDetails.vue';

const model = ref('1');
const contactsStore = useContactsStore();
//const eventsStore = useEventsStore();
//const allEvents = eventsStore.getEventsById(-1,-1)
const route = useRoute();

const contact = computed(() => {
  return contactsStore.Contact;
});

const fullName = computed(() => {
  return `${contact.value?.first_name} ${contact.value?.last_name}`;
});

const id = ref<string | string[]>('0');
id.value = route.params.id;

const stateName = computed(() => {
  const item = contactsStore.States.find(
    (state) => state.code === contact.value?.state
  );
  const stateItem = item ? item.name : '';
  //console.log("state name: ", stateItem);
  return stateItem;
});

const params = computed(() => {
  return {
    contact: contact.value,
    stateName: stateName.value,
  };
});

onMounted(() => {
  contactsStore.$reset;
  contactsStore.getContactSummary(Number(route.params.id));
  contactsStore.getStates();
  console.log(`ContactDetails: params: ${params.value}`);
});

const parent = ref({
  parentObjectId: id.value,
  parentObjectServiceType: 14, // FIXME: Use enumerated types
  selectedNoteBook: -1,
});
const parent2 = ref({
  parentObjectId: id.value,
  parentObjectServiceType: 14, // FIXME: Use enumerated types
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

//console.log(stateName);
</script>

<template>
  <q-layout view="lHh Lpr lFf">
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

        <q-btn
          :to="{ name: 'editcontact', params: { id: id } }"
          flat
          round
          dense
          color="white"
          icon="edit"
        />

        <q-btn
          @click="contactsStore.deleteContact(contact?.id); $router.go(-1)"
          flat
          round
          dense
          color="white"
          icon="delete"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-card class="relative-position card-example" flat bordered>
        <q-card-section class="q-pb-none">
          <div class="center">
            <q-avatar color="grey-3" size="200px" class="q-mb-sm">
              <img :src="contact?.picture" alt="{{ fullName }}" />
            </q-avatar>
            <div class="q-mt-md">
              <q-btn-toggle
                v-model="model"
                class="oc-custom-toggle"
                no-caps
                rounded
                unelevated
                toggle-color="primary"
                color="white"
                text-color="primary"
                :options="[
                  { label: 'Summary', value: '1' },
                  { label: 'Details', value: '2' },
                ]"
              />
            </div>
          </div>
        </q-card-section>
        <ContactSummary v-if="model === '1'" :params="params" />
        <ContactDetails v-if="model === '2'" :params="parent" />
        <!-- Notes Starts -->
        <q-card-section>
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
                <q-item-section> Notes ({{ notesCount }})</q-item-section>

                <q-item-section side>
                  <q-btn
                    :to="{
                      name: 'newNotes',
                      params: {
                        id: contact?.id,
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
              <!-- <pre>{{ parent }}</pre> -->
            </q-expansion-item>
          </q-list>
        </q-card-section>

        <q-card-section>
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
                <q-item-section> Events</q-item-section>

                <q-item-section side>
                  <q-btn
                    :to="{
                      name: 'newEvent',
                      params: {
                        id: contact?.id,
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
              <EventsList :params="parent2" />
            </q-expansion-item>
          </q-list>
        </q-card-section>

        <q-card-section>
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
                <q-item-section>Tasks</q-item-section>

                <q-item-section side>
                  <q-btn
                    :to="{
                      name: 'newTask',
                      params: {
                        id: contact?.id,
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
              <TasksList :params="parent2" />
            </q-expansion-item>
          </q-list>
        </q-card-section>
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
