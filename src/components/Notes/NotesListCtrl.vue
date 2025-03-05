<script setup lang="ts">
import { useNotesStore } from '../../stores/NotesStore';
import { computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const props = defineProps(['params']);
const notesStore = useNotesStore();
const router = useRouter();
const $q = useQuasar();

const parentObjectId = computed(() => {
  return props.params.parentObjectId;
});
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

const loadNotesList = async () => {
  $q.loading.show();
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
  } finally {
    $q.loading.hide();
  }
};

onMounted(async () => {
  await loadNotesList();
});

// onBeforeMount(async () => {
//   try {
//     await notesStore.getNotes(
//       parentObjectServiceType.value,
//       parentObjectId.value,
//       noteBookId.value
//     );
//     emit('numberOfNotes', getNotesCount);
//   } catch (error) {
//     $q.dialog({
//       title: 'Alert',
//       message: error as string,
//     }).onOk(async () => {
//       await router.push({ path: '/HomePage' });
//     });
//   }
// });

const errorMsg = computed(() => {
  return notesStore.errorMsg;
});
</script>
<template>
  <q-item-section v-if="errorMsg">
    <div class="flex justify-center">
      <span class="text-subtitle1 text-weight-medium inline q-mr-xs">{{
        errorMsg
      }}</span>
    </div>
  </q-item-section>
  <q-list v-for="note in getNotes" :key="note.id">
    <q-item
      :to="{
        name: 'noteDetails',
        params: {
          id: note.id,
          objectTypeId:
            parentObjectServiceType === '' ? '-1' : parentObjectServiceType,
          objectId: parentObjectId === '' ? '-1' : parentObjectId,
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
