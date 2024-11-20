<!-- cleaned up with google bard with minor correction -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useNotesStore } from '../../stores/NotesStore';
import { useRoute, useRouter } from 'vue-router';
import ConfirmDelete from '../../components/general/ConfirmDelete.vue';
import { useQuasar } from 'quasar';
import logger from 'src/helpers/logger';
import drawer from '../../components/drawer.vue';

logger.log('noteDetails:setup');
const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const myDrawer = ref();

const parentObjectId = route.params.objectId ? route.params.objectId : '';
const parentObjectServiceType = route.params.objectTypeId
  ? route.params.objectTypeId
  : '';

const notesStore = useNotesStore();
const isPrivate = ref<string>();

const id = ref<string | string[]>('0');

const isLoaded = ref<boolean>(false);

const note = computed(() => {
  return notesStore.Note;
});

onMounted(async () => {
  logger.log(`noteDetails:onMounted:id= ${route.params.id}`);
  try {
    id.value = route.params.id;
    await notesStore.getNote(route.params.id as string);
    isPrivate.value = note.value?.isPrivate ? 'Yes' : 'No';
  } catch (error) {
    logger.log(`*** noteDetails:error:catch(${error}) ***`, 'error');
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      logger.log('*** noteDetails:onMounted:onOk ***');
      await router.push({ path: `/contactDetails/${parentObjectId}` });
    });
  } finally {
    isLoaded.value = true;
  }
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
    }).onOk(async () => {
      logger.log('*** Delete task:onSubmit(...):onOK ***');
    });
  }
  isNoteDelete.value = false;
};
function toggleLeftDrawer() {
  if (myDrawer.value == null) return;
  myDrawer.value.toggleLeftDrawer();
}
</script>

<style>
.q-dialog__backdrop {
  backdrop-filter: blur(7px);
}
</style>

<template>
  <q-layout view="lHh Lpr lFf" v-if="isLoaded">
    <q-header reveal bordered class="bg-primary text-white" height-hint="98">
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
        <q-btn
          aria-label="Menu"
          dense
          flat
          icon="menu"
          round
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title> Note details </q-toolbar-title>

        <q-btn
          :to="{
            name: 'editNote',
            params: {
              id: id,
              objectTypeId: parentObjectServiceType,
              objectId: parentObjectId,
            },
          }"
          flat
          round
          dense
          color="white"
          icon="edit"
        />
        <q-btn
          @click="displayConfirmationDialog"
          flat
          round
          dense
          color="white"
          icon="delete"
        />
      </q-toolbar>
    </q-header>
    <drawer ref="myDrawer" />
    <q-page-container>
      <q-card class="relative-position card-example" flat bordered>
        <q-card-section class="q-pb-none">
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label caption>Title</q-item-label>
                <q-item-label class="q-mb-sm">{{ note?.title }}</q-item-label>

                <q-item-label caption>Description</q-item-label>
                <q-item-label class="q-mb-sm">
                  <div v-html="note?.description"></div>
                </q-item-label>

                <q-item-label caption>Private</q-item-label>
                <q-item-label class="q-mb-sm">{{ isPrivate }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <ConfirmDelete
        v-if="isNoteDelete"
        :showConfirmationDialog="isNoteDelete"
        :id="route.params.id"
        :title="title"
        :message="message"
        @cancel="cancelConfirmation"
        @confirm="deleteNote"
      />
    </q-page-container>
  </q-layout>
</template>
