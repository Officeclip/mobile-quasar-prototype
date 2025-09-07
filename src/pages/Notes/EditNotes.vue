<!-- Cleaned up using Google Bard -->
<script setup lang="ts">
import { ref, onMounted, Ref } from 'vue';
import { useNotesStore } from '../../stores/NotesStore';
import { useRouter, useRoute } from 'vue-router';
import NotesForm from '../../components/Notes/NotesFormCtrl.vue';
import { useQuasar } from 'quasar';
import { Note } from 'src/models/Notes/note';
import OC_Header from 'src/components/OCcomponents/OC_Header.vue';

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
    <OC_Header
      title="Edit Notes"
      :show-save-button="true"
      @save="onSubmit"
    ></OC_Header>
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
