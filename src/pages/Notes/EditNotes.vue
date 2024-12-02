<!-- Cleaned up using Google Bard -->
<script setup lang="ts">
import { ref, onMounted, Ref } from 'vue';
import { useNotesStore } from '../../stores/NotesStore';
import { useRouter, useRoute } from 'vue-router';
import NotesForm from '../../components/Notes/NotesFormCtrl.vue';
import { useQuasar } from 'quasar';
import OCSaveButton from 'src/components/OCcomponents/OC-SaveButton.vue';
import { Note } from 'src/models/note';

const $q = useQuasar();
const notesStore = useNotesStore();
const route = useRoute();
const router = useRouter();

const id = ref<string | string[]>(route.params.id);

const note: Ref<Note> = ref(null);

onMounted(async () => {
  try {
    await notesStore.getNote(id.value as string);
    const response = notesStore.Note;
    note.value = response;
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      await router.push({ path: '/notesList' });
    });
  }
});

const childComponent = ref(null);

async function onSubmit(e: Event) {
  try {
    if (!childComponent.value.validateAll()) return;
    const editNotes = ref(note);
    await notesStore.editNote(editNotes.value);
    router.go(-2);
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    });
  }
}
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn
          @click="router.go(-1)"
          flat
          round
          dense
          color="white"
          icon="arrow_back"
        >
        </q-btn>
        <q-toolbar-title> Edit Notes</q-toolbar-title>
        <OCSaveButton @handleClick="onSubmit"></OCSaveButton>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form @submit="onSubmit" class="q-gutter-md">
        <div v-if="note">
          <NotesForm :note="note" ref="childComponent" />
        </div>
      </q-form>
    </q-page-container>
  </q-layout>
</template>

<style></style>
