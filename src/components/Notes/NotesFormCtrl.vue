<script lang="ts" setup>
import { defineProps, ref } from 'vue';

const props = defineProps(['note']);

const notesDetail = ref(props.note);

const isPrivate = ref('');
isPrivate.value = notesDetail.value?.isPrivate ? 'Yes' : 'No';

const descriptionRef = ref(null);

const ruleNotEmpty = (val: string) => {
  const condition = val && val.length > 0;
  return condition ? true : 'Please enter description';
};
const options = ref([
  {
    label: 'Yes',
    value: true,
  },
  {
    label: 'No',
    value: false,
  },
]);

const validateAll = () => {
  descriptionRef.value.validate();
  return !descriptionRef.value.hasError;
};

defineExpose({
  validateAll,
});
</script>

<template>
  <div>
    <div class="q-pa-md">
      <div class="q-gutter-y-md column">
        <q-input
          v-model="notesDetail.title"
          label="Title"
          placeholder="enter note title"
        >
        </q-input>
        <q-field
          class="q-mt-md"
          v-model="notesDetail.description"
          label-slot
          borderless
          :rules="[ruleNotEmpty]"
          ref="descriptionRef"
        >
          <template #label>Description</template>
          <template #control>
            <q-editor
              style="color: black"
              class="q-mt-md full-width"
              v-model="notesDetail.description"
              paragraph-tag="div"
              placeholder="enter description"
            ></q-editor>
          </template>
        </q-field>
        <q-select
          v-model="notesDetail.isPrivate"
          :options="options"
          map-options
          emit-value
          label="Private"
        />
      </div>
    </div>
  </div>
</template>
