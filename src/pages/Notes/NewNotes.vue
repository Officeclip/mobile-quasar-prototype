<script setup lang="ts">
import NotesForm from '../../components/Notes/NotesFormCtrl.vue';
import { useNotesStore } from '../../stores/NotesStore';
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Note } from '../../models/note';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const router = useRouter();
const route = useRoute();

const parentObjectId = route.params.objectId ? route.params.objectId : '';
const parentObjectServiceType = route.params.objectTypeId
  ? route.params.objectTypeId
  : '';

const notesStore = useNotesStore();
const note = ref({
  title: '',
  description: '',
  isPrivate: false,
});

function onSubmit(e: Event) {
  e.preventDefault();
  // if (!note.value.title) {
  //   alert('Please add text')
  //   return
  // }
  // note.value.isPrivate = (note.value.isPrivate === 'Yes')
  try {
    const newNote: Note = {
      id: '',
      noteBookId: '',
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
    console.log(`*** NewNote:onSubmit(...):catch: ${error} ***`);
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      console.log('*** NewNote:onSubmit(...):onOK ***');
    });
  }
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
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
        <q-toolbar-title> New Notes</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form @submit="onSubmit" class="q-gutter-md">
        <div>
          <NotesForm :note="note" />
          <q-btn
            class="q-ml-md q-mb-md q-mt-md"
            label="Submit"
            type="submit"
            color="primary"
          ></q-btn>
          <q-btn
            label="Reset"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          ></q-btn>
        </div>
      </q-form>
    </q-page-container>
  </q-layout>
</template>

<style scoped></style>
