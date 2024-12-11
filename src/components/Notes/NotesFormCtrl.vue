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
          hide-bottom-space
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
              :toolbar="[
                [
                  {
                    label: $q.lang.editor.formatting,
                    icon: $q.iconSet.editor.formatting,
                    list: 'no-icons',
                    options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code'],
                  },
                  {
                    label: $q.lang.editor.fontSize,
                    icon: $q.iconSet.editor.fontSize,
                    fixedLabel: true,
                    fixedIcon: true,
                    list: 'no-icons',
                    options: [
                      'size-1',
                      'size-2',
                      'size-3',
                      'size-4',
                      'size-5',
                      'size-6',
                      'size-7',
                    ],
                  },
                  'removeFormat',
                ],
                [
                  'link',
                  'bold',
                  'italic',
                  'fullscreen',
                  'unordered',
                  'ordered',
                ],
                [
                  {
                    label: $q.lang.editor.align,
                    icon: $q.iconSet.editor.align,
                    fixedLabel: true,
                    list: 'only-icons',
                    options: ['left', 'center', 'right', 'justify'],
                  },
                ],
              ]"
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
