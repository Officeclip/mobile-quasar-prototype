<script setup>
import { ref } from 'vue';
import { Notify } from 'quasar';

const emit = defineEmits(['get-attachments-generated']);
const fileModel = ref();
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

function getAttachments() {
  const data = fileModel.value;
  emit('get-attachments-generated', data);
  fileModel.value = '';
}
</script>

<template>
  <q-card>
    <q-item>
      <q-file
        v-model="fileModel"
        dense
        label="Attachments"
        color="primary"
        outlined
        bottom-slots
        counter
        use-chips
        multiple
        append
        max-files="5"
        accept="jpg,image/*"
        @rejected="onRejected"
        style="max-width: 300px"
      >
        <template v-slot:prepend>
          <q-icon name="attach_file" size="xs"></q-icon>
        </template>
        <template v-slot:append>
          <q-btn
            color="primary"
            dense
            flat
            label="Add"
            no-caps
            @click="getAttachments"
          />
        </template>
      </q-file> </q-item
  ></q-card>
</template>
