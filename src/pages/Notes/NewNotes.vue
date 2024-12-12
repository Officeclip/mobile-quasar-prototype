<script setup lang="ts">
import NotesForm from '../../components/Notes/NotesFormCtrl.vue';
import { useNotesStore } from '../../stores/NotesStore';
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Note } from '../../models/Notes/note';
import { useQuasar } from 'quasar';
import OCSaveButton from 'src/components/OCcomponents/OC-SaveButton.vue';

const $q = useQuasar();
const router = useRouter();
const route = useRoute();

const parentObjectId = route.params.objectId ? route.params.objectId : '';
const parentObjectServiceType = route.params.objectTypeId
  ? route.params.objectTypeId
  : '';
const notebookId = route.params.id !== '-1' ? route.params.id : '';

const notesStore = useNotesStore();
const note = ref({
  title: '',
  description: '',
  isPrivate: false,
});

const childComponent = ref(null);

function onSubmit(e: Event) {
  try {
    if (!childComponent.value.validateAll()) return;
    const newNote: Note = {
      id: '',
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
      title: note.value.title
        ? note.value.title
        : note.value.description.substring(0, 25),
      description: note.value.description,
      isPrivate: note.value.isPrivate as boolean,
      createdByUserSid: '',
      createdDateTime: '',
      security: [],
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
        <q-toolbar-title> New Notes</q-toolbar-title>
        <OCSaveButton @handleClick="onSubmit"></OCSaveButton>
      </q-toolbar>
    </q-header>
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
