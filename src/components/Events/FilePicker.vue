<script setup>
import { ref } from 'vue';
import { Notify } from 'quasar';

// const emit = defineEmits(['get-attachments-generated']);
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
const closePreview = () => {
  isPreviewing.value = false;
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

// function getAttachments() {
//   const data = fileModel.value;
//   emit('get-attachments-generated', data);
//   fileModel.value = '';
// }
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
      <!-- <template v-slot:append>
      <q-btn
        color="primary"
        dense
        flat
        label="Add"
        no-caps
        @click="getAttachments"
      />
    </template> -->
    </q-file>
    <q-list>
      <q-item
        v-for="file in files"
        :key="file.name"
        clickable
        v-ripple
        dense
        class="items-center justify-between"
      >
        <a @click="showPreview(file)">{{ file.name }}</a>
        <q-icon
          class="q-ml-xs"
          color="primary"
          name="arrow_downward"
          size="xs"
          @click="downloadFile(file)"
        />
      </q-item>
    </q-list>
    <q-img
      v-if="isPreviewing"
      :src="imageUrl"
      spinner-color="white"
      style="height: 140px; max-width: 150px"
    />
    <q-icon
      v-if="isPreviewing"
      color="primary"
      name="close"
      size="xs"
      @click="closePreview()"
    ></q-icon>
  </div>
</template>
