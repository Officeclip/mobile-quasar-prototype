<!-- cleaned up with google bard with minor correction -->
<script setup lang="ts">
import { onBeforeMount, ref, computed } from 'vue';
import NoteList from '../../components/Notes/NotesListCtrl.vue';
import { useNotesStore } from '../../stores/NotesStore';
import { useRouter } from 'vue-router';
import drawer from '../../components/drawer.vue';

const router = useRouter();
const selectedNoteBook = ref('');
const notesStore = useNotesStore();
const myDrawer = ref();

onBeforeMount(async () => {
  await notesStore.getNoteBooks();
});

const noteBooks = computed(() => {
  return notesStore.NoteBooks;
});

const parent = ref({
  parentObjectId: '',
  parentObjectServiceType: '', // FIXME: Use enumerated types
  selectedNoteBook: '',
});

const errorMessageVisible = ref(false);

function navigateToNewNotes() {
  if (parent.value.selectedNoteBook) {
    errorMessageVisible.value = false;
    router.push({
      name: 'newNotes',
      params: {
        id: parent.value.selectedNoteBook,
        objectTypeId: '-1',
        objectId: '-1',
      },
    });
  } else {
    errorMessageVisible.value = true;
  }
}
function toggleLeftDrawer() {
  if (myDrawer.value == null) return;
  myDrawer.value.toggleLeftDrawer();
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn
          @click="router.push({ path: '/homepage' })"
          flat
          round
          dense
          color="white"
          icon="arrow_back"
        >
        </q-btn>
        <q-btn
          aria-label="Menu"
          dense
          flat
          icon="menu"
          round
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title> All Notes </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <drawer ref="myDrawer" />
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
        <span
          v-if="errorMessageVisible === true && !parent.selectedNoteBook"
          class="q-pa-lg text-red"
        >
          Please select the notebook
        </span>
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
              id: parent.selectedNoteBook,
              objectTypeId: '-1',
              objectId: '-1',
            },
          }"
          fab
          icon="add"
          color="accent"
          padding="md"
          @click="navigateToNewNotes"
        >
        </q-btn>
      </q-page-sticky>
    </q-page-container>
  </q-layout>
</template>

<style></style>
