<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import NotesList from '../../components/Notes/NotesList.vue';
import { useNotesStore } from '../../stores/NotesStore';
import { useRouter } from 'vue-router';
import OC_Drawer from 'src/components/OC_Drawer.vue';
import { useQuasar } from 'quasar';
import OC_Header from 'src/components/OCcomponents/OC_Header.vue';
import OC_Loader from 'src/components/general/OC_Loader.vue';

const router = useRouter();
const selectedNotebookId = ref('');
const notesStore = useNotesStore();
const myDrawer = ref();
const $q = useQuasar();
const loading = ref(true);
const errorMessageVisible = ref(false);

const noteBooks = computed(() => {
  return notesStore.NoteBooks;
});

const loadNoteBooks = async () => {
  loading.value = true;
  try {
    await notesStore.getNoteBooks();
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      await router.push({ path: '/homePage' });
    });
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await loadNoteBooks();
});

function navigateToNewNotes() {
  if (selectedNotebookId.value) {
    errorMessageVisible.value = false;
    router.push({
      name: 'newNotes',
      params: {
        id: selectedNotebookId.value,
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
    <OC_Header
      title="All Notes"
      back-button-to="/homepage"
      :show-menu-button="true"
      @toggle-drawer="toggleLeftDrawer"
    />
    <OC_Drawer ref="myDrawer" />
    <q-space class="q-mt-sm"></q-space>
    <q-page-container>
      <q-page>
        <OC_Loader :visible="loading" />
        <div class="q-pa-lg text-center">
          <q-select
            outlined
            v-model="selectedNotebookId"
            :options="noteBooks"
            option-label="notebookName"
            option-value="id"
            label="Select Notebook"
            emit-value
            map-options
          />
        </div>
        <span
          v-if="errorMessageVisible === true && !selectedNotebookId"
          class="q-pa-lg text-red"
        >
          Please select the notebook
        </span>
        <NotesList
          v-if="selectedNotebookId"
          :notebook-id="selectedNotebookId"
          :key="selectedNotebookId"
        />
      </q-page>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn
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
