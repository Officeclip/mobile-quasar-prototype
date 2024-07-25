<!-- cleaned up with google bard with minor correction -->
<script setup lang="ts">
console.log('NotesList: Setup Started');
import { onBeforeMount, ref, computed } from 'vue';
import NoteList from '../../components/Notes/NotesListCtrl.vue';
import { useNotesStore } from '../../stores/NotesStore';

const selectedNoteBook = ref('');
const notesStore = useNotesStore();
//const noteBooks = ref<any>([]);

onBeforeMount(async () => {
  console.log('NotesList: onBeforeMount Started');
  await notesStore.getNoteBooks();
  //noteBooks.value = notesStore.NoteBooks
  console.log('NotesList: onBeforeMount Ended');
});

const noteBooks = computed(() => {
  console.log('NotesList: computed: noteBooks Started');
  return notesStore.NoteBooks;
});

const parent = ref({
  parentObjectId: '',
  parentObjectServiceType: '', // FIXME: Use enumerated types
  selectedNoteBook: '',
});
console.log('NotesList: Setup Ended');
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
        <q-toolbar-title> All Notes </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-space class="q-mt-sm"></q-space>
    <q-page-container>
      <q-page>
        <div class="q-pa-lg text-center">
          <q-select
            outlined
            v-model="parent.selectedNoteBook"
            :options="noteBooks"
            option-label="notebookName"
            option-value="id"
            label="Select Notebook"
            emit-value
            map-options
          />
        </div>
        <pre>SelectedNoteBook: {{ parent.selectedNoteBook }}</pre>
        <pre>Parent: {{ parent }}</pre>
        <!-- See: https://michaelnthiessen.com/force-re-render/#key-changing-to-force-a-component-refresh-->
        <NoteList
          v-if="parent.selectedNoteBook.length > 0"
          @numberOfNotes="selectedNoteBook.length"
          :params="parent"
          :key="parent.selectedNoteBook"
        />
      </q-page>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn
          :to="{
            name: 'newNotes',
            params: {
              id: '',
            },
          }"
          fab
          icon="add"
          color="accent"
          padding="sm"
        >
        </q-btn>
      </q-page-sticky>
    </q-page-container>
  </q-layout>
</template>

<style></style>
