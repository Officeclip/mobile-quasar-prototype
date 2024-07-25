<script setup lang="ts">
import { useNotesStore } from '../../stores/NotesStore';
import { computed, onBeforeMount } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const props = defineProps(['params']);
const notesStore = useNotesStore();
const router = useRouter();
const $q = useQuasar();

const parentObjectId = computed(() => props.params.parentObjectId);
const parentObjectServiceType = computed(
  () => props.params.parentObjectServiceType
);
const noteBookId = computed(() => props.params.selectedNoteBook);
const emit = defineEmits(['numberOfNotes']);

const getNotes = computed(() => {
  return notesStore.Notes;
});

const getNotesCount = computed(() => {
  return notesStore.NotesCount;
});

onBeforeMount(async () => {
  console.log(
    `NotesListCtrl: onBeforeMount Started, noteBookId: ${noteBookId.value}`
  );
  try {
    await notesStore.getNotes(
      parentObjectServiceType.value,
      parentObjectId.value,
      noteBookId.value
    );
    emit('numberOfNotes', getNotesCount);
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      await router.push({ path: '/HomePage' });
    });
  }
});
</script>
<template>
  <q-list v-for="note in getNotes" :key="note.id">
    <q-item
      :to="{
        name: 'noteDetails',
        params: {
          id: note.id,
          objectTypeId: parentObjectServiceType,
          objectId: parentObjectId,
        },
      }"
      clickable
      v-ripple
    >
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
