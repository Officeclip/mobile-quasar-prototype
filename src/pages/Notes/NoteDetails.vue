<!-- cleaned up with google bard with minor correction -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useNotesStore } from '../../stores/NotesStore';
import { useRoute, useRouter } from 'vue-router';
import ConfirmDelete from '../../components/general/ConfirmDelete.vue';

const route = useRoute();
const router = useRouter();

const parentObjectId = route.params.objectId ? route.params.objectId : '';
const parentObjectServiceType = route.params.objectTypeId ? route.params.objectTypeId : '';

const notesStore = useNotesStore();
const isPrivate = ref<string>();

const id = ref<string | string[]>('0');

const note = computed(() => {
  return notesStore.Note;
});

onMounted(() => {
  id.value = route.params.id;
  notesStore.getNote(route.params.id as string);
});

isPrivate.value = note.value?.isPrivate ? 'Yes' : 'No';

const title = ref('Confirm');
const message = ref('Are you sure you want to delete this note?');

const isNoteDelete = ref(false);
const displayConfirmationDialog = () => {
  isNoteDelete.value = true;
};
const cancelConfirmation = () => {
  isNoteDelete.value = false;
};
const deleteNote = (id: string) => {
  {
    notesStore.deleteNote(id).then(() => {
      isNoteDelete.value = false;
      router.go(-1);
    });
  }
};
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn @click="$router.go(-1)" flat round dense color="white" icon="arrow_back">
        </q-btn>
        <q-toolbar-title> Note details </q-toolbar-title>

        <q-btn
          :to="{ name: 'editNote', params: { id: id, objectTypeId: parentObjectServiceType, objectId: parentObjectId } }"
          flat round dense color="white" icon="edit" />
        <q-btn @click="displayConfirmationDialog" flat round dense color="white" icon="delete" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-card class="relative-position card-example" flat bordered>
        <q-card-section class="q-pb-none">
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label caption>Title</q-item-label>
                <q-item-label class="q-mb-sm">{{ note?.title }}</q-item-label>

                <q-item-label caption>Description</q-item-label>
                <!-- <div v-html="note?.description"> </div> -->
                <q-item-label class="q-mb-sm">
                  <div v-html="note?.description"> </div>
                </q-item-label>

                <q-item-label caption>Private</q-item-label>
                <q-item-label class="q-mb-sm">{{ isPrivate }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <ConfirmDelete v-if="isNoteDelete" :showConfirmationDialog="isNoteDelete" :id="route.params.id" :title="title"
        :message="message" @cancel="cancelConfirmation" @confirm="deleteNote" />
    </q-page-container>
  </q-layout>
</template>

<style></style>
