<script setup lang="ts">
import { useQuasar } from 'quasar';

const $q = useQuasar();
const model = defineModel<string>();

withDefaults(
  defineProps<{
    placeholder?: string;
  }>(),
  {
    placeholder: 'enter description',
  },
);
</script>

<template>
  <q-editor
    min-height="6rem"
    dense
    class="q-mt-md full-width"
    v-model="model"
    paragraph-tag="div"
    :placeholder="placeholder"
    :toolbar="[
      [
        {
          icon: $q.iconSet.editor.formatting,
          fixedLabel: true,
          fixedIcon: true,
          list: 'no-icons',
          options: ['h5', 'h6', 'p', 'code'],
        },
        {
          icon: $q.iconSet.editor.fontSize,
          fixedLabel: true,
          fixedIcon: true,
          list: 'no-icons',
          options: ['size-1', 'size-2', 'size-3', 'size-4', 'size-5'],
        },
        'removeFormat',
        'link',
        'bold',
        'italic',
        'unordered',
        'ordered',

        {
          icon: $q.iconSet.editor.align,
          fixedLabel: true,
          list: 'only-icons',
          options: ['left', 'center', 'right', 'justify'],
        },
      ],
    ]"
  ></q-editor>
</template>
