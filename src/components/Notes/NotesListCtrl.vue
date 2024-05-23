<script setup lang="ts">
import { useNotesStore } from '../../stores/NotesStore';
import { computed, onBeforeMount } from 'vue';

const props = defineProps(['params']);
const parentObjectId = computed(() => props.params.parentObjectId);
const parentObjectServiceType = computed(
  () => props.params.parentObjectServiceType
);
const noteBookId = computed(() => props.params.selectedNoteBook);
const notesStore = useNotesStore();
const emit = defineEmits(['numberOfNotes']);

const getNotes = computed(() => {
  return notesStore.Notes;
});

const getNotesCount = computed(() => {
  return notesStore.NotesCount;
});

onBeforeMount(() => {
  notesStore.getNotes(
    parentObjectServiceType.value,
    parentObjectId.value,
    noteBookId.value
  );
  emit('numberOfNotes', getNotesCount);
});
</script>
<template>
  <q-list v-for="note in getNotes" :key="note.id">
    <q-item :to="{
    name: 'noteDetails',
    params: {
      id: note.id,
      objectTypeId: parentObjectServiceType,
      objectId: parentObjectId
    },
  }" clickable v-ripple>
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
