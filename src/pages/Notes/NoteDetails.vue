<!-- cleaned up with google bard with minor correction -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useNotesStore } from '../../stores/NotesStore';
import { useRoute, useRouter } from 'vue-router';
import ConfirmDelete from '../../components/general/ConfirmDelete.vue';
import { useQuasar } from 'quasar';
// import drawer from '../../components/drawer.vue';
import OC_Drawer from 'src/components/OC_Drawer.vue';
import OC_Loader from 'src/components/general/OC_Loader.vue';
import OC_Header from 'src/components/OCcomponents/OC_Header.vue';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const myDrawer = ref();
const loading = ref(true);

const parentObjectId = route.params.objectId ? route.params.objectId : '';
const parentObjectServiceType = route.params.objectTypeId
  ? route.params.objectTypeId
  : '';

const notesStore = useNotesStore();
const isPrivate = ref<string>();

const id = route.params.id;

// const isLoaded = ref<boolean>(false);

const note = computed(() => {
  return notesStore.Note;
});

const loadNoteDetails = async () => {
  loading.value = true;
  try {
    await notesStore.getNote(id as string);
    isPrivate.value = note.value?.isPrivate ? 'Yes' : 'No';
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      await router.push({ path: `/contactDetails/${parentObjectId}` });
    });
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await loadNoteDetails();
});

const title = ref('Confirm');
const message = ref('Are you sure you want to delete this note?');

const isNoteDelete = ref(false);
const displayConfirmationDialog = () => {
  isNoteDelete.value = true;
};
const cancelConfirmation = () => {
  isNoteDelete.value = false;
};
const deleteNote = async (id: string) => {
  try {
    await notesStore.deleteNote(id);
    router.go(-1);
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    });
  }
  isNoteDelete.value = false;
};
function toggleLeftDrawer() {
  if (myDrawer.value == null) return;
  myDrawer.value.toggleLeftDrawer();
}

function editNote() {
  router.push({
    name: 'editNote',
    params: {
      id: id,
      objectTypeId: parentObjectServiceType,
      objectId: parentObjectId,
    },
  });
}
</script>

<style>
.q-dialog__backdrop {
  backdrop-filter: blur(7px);
}
.note-description {
  word-break: break-word;
  overflow-wrap: break-word;
  white-space: pre-line;
  max-width: 100%;
  overflow-x: hidden;
}
</style>

<template>
  <q-layout view="lHh Lpr lFf">
    <OC_Header
      title="Note details"
      :show-menu-button="true"
      @toggle-drawer="toggleLeftDrawer"
      :show-edit-button="true"
      @edit="editNote"
      :show-delete-button="true"
      @delete="displayConfirmationDialog"
    >
    </OC_Header>
    <OC_Drawer ref="myDrawer" />
    <q-page-container>
      <q-page>
        <OC_Loader :visible="loading" />
        <q-card
          v-if="note"
          class="relative-position card-example"
          flat
          bordered
        >
          <q-card-section class="q-pb-none">
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Title</q-item-label>
                  <q-item-label class="q-mb-sm">{{ note?.title }}</q-item-label>

                  <q-item-label caption>Description</q-item-label>
                  <q-item-label class="q-mb-sm">
                    <div
                      class="note-description"
                      v-html="note?.description"
                    ></div>
                  </q-item-label>

                  <q-item-label caption>Private</q-item-label>
                  <q-item-label class="q-mb-sm">{{ isPrivate }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card></q-page
      >
    </q-page-container>
  </q-layout>
  <ConfirmDelete
    v-if="isNoteDelete"
    :showConfirmationDialog="isNoteDelete"
    :id="route.params.id"
    :title="title"
    :message="message"
    @cancel="cancelConfirmation"
    @confirm="deleteNote"
  />
</template>
