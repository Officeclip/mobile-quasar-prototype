<!-- eslint-disable vue/no-setup-props-destructure -->
<script setup lang="ts">
import { useMetaListsStore } from 'src/stores/MetaListsStore';
import dateTimeHelper from '../../../helpers/dateTimeHelper';
import { computed, onMounted, ref } from 'vue';
import { MetaLists } from 'src/models/Meta/metaLists';
const props = defineProps(['params']);

const metaModel = props.params;

// const metaModel = ref('');
// metaModel.value = props.params?.value;
const getType = computed(() => props.params?.type);

if (getType.value === 'Boolean') {
  // Ensure the value is a boolean
  metaModel.value = Boolean(props.params?.value);
}
const labelName = computed(() => props.params?.visibleName);
const controlName = computed(() => `name_${props.params?.metaId}`);

const formattedDateTime = computed(() => {
  let dateValue = dateTimeHelper.extractDateFromUtc(metaModel.value);
  let timeValue = dateTimeHelper.extractTimeFromUtc(metaModel.value);
  return `${dateValue} ${timeValue}`;
});

//get the metaList items from store
const metaLists = ref<MetaLists[]>([]);
const metaListsStore = useMetaListsStore();
const loadMetaLists = async () => {
  await metaListsStore.getMetaListsDemo();
};
onMounted(async () => {
  await loadMetaLists();
  const response = metaListsStore.MetaLists;
  metaLists.value = response;
});

const getMetaListOptions = (metaId: number) => {
  const metaList = metaLists.value.find((list) => list.metaId === metaId);
  return metaList ? metaList.listItems : [];
};
</script>

<template>
  <!-- <pre>metaModel::{{ metaModel }}</pre> -->
  <div v-if="!['Identifier', 'ForeignKey'].includes(getType)">
    <div v-if="props.params?.editable" class="q-mb-md">
      <!-- Text Inputs -->
      <q-input
        v-if="
          [
            'ShortText',
            'Text',
            'HugeText',
            'LongText',
            'Email',
            'Hyperlink',
          ].includes(getType)
        "
        :name="controlName"
        class="min-width"
        type="text"
        :label="labelName"
        v-model="metaModel.value"
      />

      <!-- Number Input -->
      <q-input
        v-else-if="getType === 'Number'"
        :name="controlName"
        class="min-width"
        type="number"
        :label="labelName"
        v-model="metaModel.value"
      />

      <!-- Boolean Toggle -->
      <q-toggle
        v-else-if="getType === 'Boolean'"
        :name="controlName"
        :label="labelName"
        :false-value="false"
        :true-value="true"
        color="primary"
        keep-color
        v-model="metaModel.value"
      />

      <!-- List Selects -->
      <q-select
        v-else-if="
          ['List', 'PickList', 'AccountList', 'OwnerList'].includes(getType)
        "
        :name="controlName"
        class="min-width"
        v-model="metaModel.value"
        :options="getMetaListOptions(props.params?.metaId)"
        option-label="name"
        option-value="value"
        map-options
        emit-value
        :label="labelName"
      />

      <!-- Date Input -->
      <q-input
        v-else-if="getType === 'Date'"
        :name="controlName"
        class="min-width"
        filled
        v-model="metaModel.value"
        mask="date"
        :rules="['date']"
        hide-bottom-space
        :label="labelName"
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date v-model="metaModel.value">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup color="primary" flat label="Close" />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>

      <!-- Datetime Input -->
      <q-input
        v-else-if="getType === 'datetime'"
        :name="controlName"
        v-model="formattedDateTime"
        :label="labelName"
      >
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date v-model="metaModel.value" mask="YYYY-MM-DD HH:mm">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup color="primary" flat label="Close" />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-time v-model="metaModel.value" mask="YYYY-MM-DD HH:mm">
                <div class="row items-center justify-end">
                  <q-btn
                    v-close-popup
                    label="Close"
                    color="primary"
                    flat
                  ></q-btn>
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
        {{ metaModel.value }}
      </q-item-label>
      <q-icon name="hide_source" /> You do not permission to edit this item
    </div>
  </div>
</template>
