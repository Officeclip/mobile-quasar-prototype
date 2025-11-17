<script setup lang="ts">
import { useNotesStore } from '../../stores/NotesStore';
import { computed, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import OC_Loader from 'src/components/general/OC_Loader.vue';
import { Note } from 'src/models/Notes/note';

const props = defineProps({
  parentObjectId: {
    type: String,
    default: '',
  },
  parentObjectServiceType: {
    type: String,
    default: '',
  },
  notebookId: {
    type: String,
    default: '',
  },
});

const notesStore = useNotesStore();
const router = useRouter();
const $q = useQuasar();
const loading = ref(true);

const emit = defineEmits(['notes-loaded']);

const notes = computed(() => {
  return notesStore.Notes;
});

const notesCount = computed(() => {
  return notesStore.NotesCount;
});

const errorMsg = computed(() => {
  return notesStore.errorMsg;
});

const loadNotes = async () => {
  loading.value = true;
  try {
    await notesStore.getNotes(
      props.parentObjectServiceType,
      props.parentObjectId,
      props.notebookId,
    );
    emit('notes-loaded', notesCount.value);
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      await router.push({ path: '/HomePage' });
    });
  } finally {
    loading.value = false;
  }
};

watch(
  () => [props.parentObjectId, props.parentObjectServiceType, props.notebookId],
  async () => {
    await loadNotes();
  },
  { immediate: true },
);

const getNoteRoute = (note: Note) => {
  return {
    name: 'noteDetails',
    params: {
      id: note.id,
      objectTypeId:
        props.parentObjectServiceType === ''
          ? '-1'
          : props.parentObjectServiceType,
      objectId: props.parentObjectId === '' ? '-1' : props.parentObjectId,
    },
  };
};
</script>
<template>
  <OC_Loader :visible="loading" />
  <q-item-section v-if="errorMsg">
    <div class="flex justify-center">
      <span class="text-subtitle1 text-weight-medium inline q-mr-xs">{{
        errorMsg
      }}</span>
    </div>
  </q-item-section>
  <q-list v-for="note in notes" :key="note.id">
    <q-item :to="getNoteRoute(note)" clickable v-ripple>
      <q-item-section>
        <q-item-label>
          {{ note.title }}
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-icon color="primary" name="chevron_right" />
      </q-item-section>
    </q-item>
    <q-separator></q-separator>
  </q-list>
</template>
