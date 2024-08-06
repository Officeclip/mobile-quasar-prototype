<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps(['showConfirmationDialog', 'id', 'title', 'message']);
const showConfirmationDialog = ref(props.showConfirmationDialog);
const emit = defineEmits(['cancel', 'confirm']);

const cancel = () => {
  emit('cancel');
};

const confirm = () => {
  emit('confirm', props.id);
};
</script>
<template>
  <q-dialog v-model="showConfirmationDialog">
    <q-card>
      <q-card-section>
        <q-item-label>{{ title }}</q-item-label>
        <q-item-label>{{ message }}</q-item-label>
        <q-card-actions align="right">
          <q-btn no-caps dense color="primary" label="Cancel" @click="cancel" />
          <q-btn
            no-caps
            dense
            color="negative"
            label="Delete"
            @click="confirm"
          />
        </q-card-actions>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
