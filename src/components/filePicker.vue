<script setup>
import { ref } from 'vue';
import { Notify } from 'quasar';

const files = ref([]);
const imageUrl = ref('');
const isPreviewing = ref(false);
const isDownloading = ref(false);
const updateFile = () => {
  if (files.value.length > 0) {
    imageUrl.value = URL.createObjectURL(files.value[0]);
  }
};

const showPreview = (file) => {
  isPreviewing.value = true;
  imageUrl.value = URL.createObjectURL(file);
};
const downloadFile = async (file) => {
  isDownloading.value = true;

  const blob = await new Blob([file]);
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = file.name;

  document.body.appendChild(a);
  a.click();
  a.remove();

  isDownloading.value = false;
};
const errorsMap = {
  accept: 'File type not accepted',
  'max-file-size': 'Max file size exceeded',
  'max-total-size': 'Max total size exceeded',
};
function onRejected(rejectedFiles) {
  rejectedFiles.forEach((rejectedFile) => {
    const errorMessage = errorsMap[rejectedFile.failedPropValidation];
    if (!errorMessage) {
      return;
    }
    if (rejectedFile.failedPropValidation) {
      Notify.create({
        message: errorMessage,
        type: 'negative',
      });
    }
  });
}
const closePreview = () => {
  isPreviewing.value = false;
};
</script>

<template>
  <div>
    <q-file
      v-model="files"
      dense
      label="Pick a file"
      color="primary"
      filled
      bottom-slots
      counter
      use-chips
      multiple
      append
      max-files="5"
      accept="jpg,image/*"
      @rejected="onRejected"
      @update:model-value="updateFile()"
      style="max-width: 350px"
    >
      <template v-slot:prepend>
        <q-icon name="attach_file" size="xs"></q-icon>
      </template>
    </q-file>
    <q-list>
      <q-item v-for="file in files" :key="file.name">
        <a @click="showPreview(file)">{{ file.name }}</a>
        <q-icon
          class="q-ml-sm"
          color="primary"
          name="arrow_downward"
          size="xs"
          @click="downloadFile(file)"
        />
      </q-item>
    </q-list>

    <!-- Full-Screen Preview Dialog -->
    <q-dialog v-model="isPreviewing" fullscreen no-backdrop no-route-dismiss>
      <q-card style="width: 100%; height: 100%">
        <q-card-actions
          align="right"
          style="position: absolute; top: 0; right: 0; z-index: 1"
        >
          <q-btn
            flat
            round
            dense
            icon="close"
            color="red"
            @click="closePreview"
          />
        </q-card-actions>
        <q-card-section style="height: 100%">
          <q-img :src="imageUrl" spinner-color="white" style="height: 100%" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
