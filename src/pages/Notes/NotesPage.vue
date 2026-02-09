<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import NotesList from '../../components/Notes/NotesList.vue';
import { useNotesStore } from '../../stores/NotesStore';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import OC_Header from 'src/components/OCcomponents/OC_Header.vue';
import OC_Loader from 'src/components/general/OC_Loader.vue';
import { storeToRefs } from 'pinia';

const notesStore = useNotesStore();
const { selectedNotebook, noteBooks } = storeToRefs(notesStore);
const router = useRouter();
const $q = useQuasar();
const loading = ref(true);

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

watch(selectedNotebook, (newNotebook) => {
  notesStore.setSelectedNotebook(newNotebook);
});

function navigateToNewNotes() {
  if (selectedNotebook.value) {
    // errorMessageVisible.value = false;
    router.push({
      name: 'newNotes',
      params: {
        id: selectedNotebook.value.id,
        objectTypeId: '-1',
        objectId: '-1',
      },
    });
  }
  // else {
  //   errorMessageVisible.value = true;
  // }
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <OC_Header title="All Notes" back-button-to="/homepage" />
    <q-space class="q-mt-sm"></q-space>
    <q-page-container>
      <q-page>
        <OC_Loader :visible="loading" />
        <div class="q-pa-lg text-center">
          <q-select
            outlined
            v-model="selectedNotebook"
            :options="noteBooks"
            option-label="notebookName"
            label="Select Notebook"
          />
        </div>
        <!-- <span v-if="errorMessageVisible" class="q-pa-lg text-red">
          Please select the notebook
        </span> -->
        <NotesList
          v-if="selectedNotebook"
          :notebook-id="selectedNotebook.id"
          :key="selectedNotebook.id"
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
