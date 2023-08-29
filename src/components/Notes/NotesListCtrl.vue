<script setup lang="ts">
console.log('NoteList: Setup Started');
import { useNotesStore } from '../../stores/NotesStore';
import { computed, onBeforeMount, onUpdated } from 'vue';

const props = defineProps(['params']);
console.log(`NoteList: Setup: props: ${props}`);
const parentObjectId = computed(() => props.params.parentObjectId);
const parentObjectServiceType = computed(
  () => props.params.parentObjectServiceType
);
const noteBookId = computed(() => props.params.selectedNoteBook);

console.log(
  'NoteList: setup: parameter values',
  parentObjectId.value,
  parentObjectServiceType.value,
  noteBookId.value
);

const notesStore = useNotesStore();

const emit = defineEmits(['numberOfNotes']);

const getNotesCount = computed(() => {
  return notesStore.NotesCount;
});

const getNotes = computed(() => {
  return notesStore.Notes;
});

onUpdated(async () => {
  console.log('NoteList: onUpdated Started');
  console.log('NoteList: onUpdated Ended');
});

onBeforeMount(() => {
  console.log('NoteList: onBeforeMount Started');
  notesStore.getNotes(
    Number(parentObjectServiceType.value),
    Number(parentObjectId.value),
    Number(noteBookId.value)
  );
  console.log('NoteList: onBeforeMount ended:');
  emit('numberOfNotes', getNotesCount);
});
console.log('NoteList: Setup Ended');
</script>
<template>
  <!-- <pre>NoteList: GetNotes: {{ getNotes }}</pre> -->
  <q-list v-for="note in getNotes" :key="note.id">
    <q-item
      :to="{
        name: 'noteDetails',
        params: {
          id: note.id,
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
