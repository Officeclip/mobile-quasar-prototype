<script setup lang="ts">
import NotesForm from '../../components/Notes/NotesFormCtrl.vue';
import { useNotesStore } from '../../stores/NotesStore';
import { Ref, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Note } from '../../models/Notes/note';
import { useQuasar } from 'quasar';
import OC_Header from 'src/components/OCcomponents/OC_Header.vue';

const $q = useQuasar();
const router = useRouter();
const route = useRoute();

const parentObjectId = route.params.objectId ? route.params.objectId : '';
const parentObjectServiceType = route.params.objectTypeId
  ? route.params.objectTypeId
  : '';
const notebookId = route.params.id !== '-1' ? route.params.id : '';

const notesStore = useNotesStore();
const note: Ref<Note> = ref({
  noteBookId: notebookId as string,
  parent: {
    type: {
      id: parentObjectServiceType as string,
      name: '',
    },
    value: {
      id: parentObjectId as string,
      name: '',
    },
  },
  title: '',
  description: '',
  isPrivate: false,
});

const childComponent = ref(null);

function onSubmit(e: Note) {
  try {
    if (!childComponent.value.validateAll()) return;
    const newNote = {
      ...note.value,
      title: note.value.title
        ? note.value.title
        : note.value.description.substring(0, 40) + '...',
    };
    notesStore.addNotes(newNote);
    router.go(-1);
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
      title="New Notes"
      :show-save-button="true"
      @save="onSubmit"
    ></OC_Header>
    <q-page-container>
      <q-form @submit="onSubmit" class="q-gutter-md">
        <div>
          <NotesForm :note="note" ref="childComponent" />
          <!-- <q-btn
            label="Reset"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          ></q-btn> -->
        </div>
      </q-form>
    </q-page-container>
  </q-layout>
</template>

<style scoped></style>
