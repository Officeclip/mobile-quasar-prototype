<!-- eslint-disable vue/no-setup-props-destructure -->
<script setup lang="ts">
import dateTimeHelper from '../../../src/helpers/dateTimeHelper';
import { ref, computed } from 'vue';
const props = defineProps(['params']);
const newValue = ref('');
newValue.value = props.params?.value;
const getType = computed(() => props.params?.type);
const labelName = computed(() => props.params?.visibleName);
const controlName = computed(() => `name_${props.params?.metaId}`);

const formattedDateTime = computed(() => {
  let dateValue = dateTimeHelper.extractDateFromUtc(newValue.value);
  let timeValue = dateTimeHelper.extractTimeFromUtc(newValue.value);
  return `${dateValue} ${timeValue}`;
});
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->

  <div v-if="props.params?.editable" class="q-mb-md">
    <q-input
      v-if="getType === 'string'"
      :name="controlName"
      class="min-width"
      type="text"
      :label="labelName"
      v-model="newValue"
    />

    <q-input
      v-if="getType === 'number'"
      name="controlName"
      class="min-width"
      type="number"
      :label="labelName"
      v-model="newValue"
    />

    <q-toggle
      v-if="getType === 'boolean'"
      name="controlName"
      :label="labelName"
      :false-value="false"
      :true-value="true"
      color="primary"
      keep-color
      v-model="newValue"
    ></q-toggle>

    <q-select
      v-if="getType === 'select'"
      name="controlName"
      map-options
      class="min-width"
      v-model="newValue"
      :options="props.params?.options"
      option-label="name"
      :label="labelName"
    />

    <q-input
      v-if="getType === 'date'"
      name="controlName"
      class="min-width"
      filled
      v-model="newValue"
      mask="date"
      :rules="['date']"
      :label="labelName"
    >
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-close-popup v-model="newValue"> </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>

    <q-input
      v-if="getType === 'datetime'"
      name="controlName"
      v-model="formattedDateTime"
      :label="labelName"
    >
      <template v-slot:prepend>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-close-popup v-model="newValue" mask="YYYY-MM-DD HH:mm">
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>

      <template v-slot:append>
        <q-icon name="access_time" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-time v-model="newValue" mask="YYYY-MM-DD HH:mm">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
              </div>
            </q-time>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
  <div v-else caption class="q-mb-md text-italic">
    <q-item-label caption>
      {{ labelName }}
    </q-item-label>
    <q-item-label class="q-mb-sm">
      {{ newValue }}
    </q-item-label>
    <q-icon name="hide_source" /> You do not permission to edit this item
  </div>
</template>
