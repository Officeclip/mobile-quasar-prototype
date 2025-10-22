<!-- cleaned up with google bard with minor correction -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import NoteList from '../../components/Notes/NotesListCtrl.vue';
import { useNotesStore } from '../../stores/NotesStore';
import { useRouter } from 'vue-router';
// import drawer from '../../components/drawer.vue';
import oc_drawer from 'src/components/oc_drawer.vue';
import { useQuasar } from 'quasar';
import OC_Header from 'src/components/OCcomponents/OC_Header.vue';
import OC_Loader from 'src/components/general/OC_Loader.vue';

const router = useRouter();
const selectedNoteBook = ref('');
const notesStore = useNotesStore();
const myDrawer = ref();
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
    <OC_Header
      title="All Notes"
      back-button-to="/homepage"
      :show-menu-button="true"
      @toggle-drawer="toggleLeftDrawer"
    />
    <oc_drawer ref="myDrawer" />
    <q-space class="q-mt-sm"></q-space>
    <q-page-container>
      <q-page>
        <OC_Loader :visible="loading" />
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
