<!-- Cleaned up using Google Bard -->
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useNotesStore } from '../../stores/NotesStore';
import { useRouter, useRoute } from 'vue-router';
import NotesForm from '../../components/Notes/NotesFormCtrl.vue';
import { useQuasar } from 'quasar';
import OCSaveButton from 'src/components/OCcomponents/OC-SaveButton.vue';

const $q = useQuasar();
const notesStore = useNotesStore();
const route = useRoute();
const router = useRouter();

const id = ref<string | string[]>(route.params.id);

const note = computed(() => {
  return notesStore.Note;
});

onMounted(() => {
  notesStore.getNote(id.value as string);
});

const childComponent = ref(null);

async function onSubmit(e: Event) {
  // e.preventDefault();
  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (!childComponent.value.validateAll()) return;
    await notesStore.editNote(note.value!);
    //router.push(`/noteDetails/${note.value?.id}`); // FIXME: This does not seem right... use standard form
    router.go(-2);
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      console.log('*** Edit notes:onSubmit(...):onOK ***');
    });
  }
}
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn
          @click="$router.go(-1)"
          flat
          round
          dense
          color="white"
          icon="arrow_back"
        >
        </q-btn>
        <q-toolbar-title> Edit Notes</q-toolbar-title>
        <OCSaveButton @handleClick="onSubmit"></OCSaveButton>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form @submit="onSubmit" class="q-gutter-md">
        <div>
          <NotesForm :note="note" ref="childComponent" />
          <!-- <q-btn class="q-ml-md q-mb-md" label="Submit" type="submit" color="primary">
          </q-btn> -->
        </div>
      </q-form>
    </q-page-container>
  </q-layout>
</template>

<style></style>
