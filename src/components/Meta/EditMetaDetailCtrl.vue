<script setup lang="ts">
console.log('Components/EditContactDetails: Setup');
import { onMounted, computed } from 'vue';
import { useMetaDetailStore } from '../../stores/MetaDetailStore';
import MetaDetailsEditItem from '../../components/Meta/MetaDetailsEditItem.vue';
import { useRoute } from 'vue-router';
const metaDetailStore = useMetaDetailStore();
// const props = defineProps(['params']);

// const contactId = computed(() => props.params.parentObjectId);

const route = useRoute();

const contactDetails = computed(() => {
  return metaDetailStore.MetaDetails;
});

onMounted(() => {
  //contactsStore.$reset(); // FIXME: This is a safeguard and can be removed
  metaDetailStore.getMetaDetail(Number(route.params.id), false);
  console.log(`onMounted: Contacts - ${metaDetailStore.MetaDetails}`);
});
</script>

<template>
  <q-card
    v-for="(section, index) in contactDetails?.sections"
    :key="index"
    flat
    bordered
    class="relative-position card-example"
  >
    <q-card-section class="q-pb-none">
      <div class="text-h6">{{ section.sectionName }}</div>
    </q-card-section>
    <q-card-section class="q-pb-none">
      <q-list>
        <q-item>
          <q-item-section class="rowItems align-content-left">
            <!-- From: https://stackoverflow.com/a/62785796/89256 -->
            <div v-for="(sectionEntry, i) in section.sectionEntries" :key="i">
              <MetaDetailsEditItem :params="sectionEntry" />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
  <q-card>
    <div>
      <!-- <pre>{{ contactDetails }}</pre> -->
    </div>
  </q-card>
</template>

<!-- eslint-disable vue/no-setup-props-destructure -->
<!-- <script setup>
import { ref, computed } from 'vue';
import dateTimeHelper from '../../helpers/dateTimeHelper';

const props = defineProps(['contact']);
console.log(`Props: ${props.contact}`);
const newValue = ref('');
newValue.value = props.testProps.value;

const dateTime = ref('');
dateTime.value = props.testProps.value;

const formattedDateTime = computed(() => {
  let dateValue = dateTimeHelper.extractDateFromUtc(dateTime.value);
  let timeValue = dateTimeHelper.extractTimeFromUtc(dateTime.value);
  return `${dateValue} ${timeValue}`;
});

const multiSelect = ref('');
multiSelect.value = props.testProps.value;

const getType = computed(() => props.testProps.type);
const labelName = props.testProps.visibleName;
</script> -->

<!-- <template>
   eslint-disable vue/no-mutating-props
  <q-input
    v-if="getType === 'string'"
    name="stringnewValue"
    class="min-width"
    type="text"
    :label="labelName"
    placeholder="enter task subject"
    v-model="newValue"
  />

  <q-input
    v-if="getType === 'numeric'"
    name="numericnewValue"
    class="min-width"
    type="number"
    label="Number type Input"
    placeholder="enter task subject"
    v-model="newValue"
  />

  <q-input
    v-if="getType === 'date'"
    name="dateValue"
    class="min-width"
    filled
    v-model="newValue"
    mask="date"
    :rules="['date']"
  >
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-date v-model="newValue">
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>

  <q-input
    v-if="getType === 'datetime'"
    name="dateTime"
    v-model="formattedDateTime"
    label="Date and Time"
  >
    <template v-slot:prepend>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-date v-model="dateTime" mask="YYYY-MM-DD HH:mm">
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>

    <template v-slot:append>
      <q-icon name="access_time" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-time v-model="dateTime" mask="YYYY-MM-DD HH:mm">
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
            </div>
          </q-time>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>

  <q-select
    v-if="getType === 'select'"
    name="selectnewValue"
    map-options
    class="min-width"
    v-model="newValue"
    :options="testProps.options"
    option-label="name"
    label="Single Option Select"
  />

  <q-toggle
    v-if="getType === 'boolean'"
    name="selectbooleanValue"
    :false-value="false"
    :label="`Model is ${newValue} (flipped boolean)`"
    :true-value="true"
    color="primary"
    keep-color
    v-model="newValue"
  ></q-toggle>


  <q-select
    v-if="getType === 'multi-select'"
    name="multi-selectnewvalue"
    map-options
    multiple
    class="min-width"
    v-model="multiSelect"
    :options="testProps.options"
    option-label="name"
    label="Multi Option Select"
  />
</template> -->

<style scoped>
/* .min-width {
  min-width: 250px;
} */
</style>
