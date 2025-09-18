<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useRegardingStore } from '../../stores/regarding/regardingStore';
import { regardingItem } from 'src/models/general/regardingItem';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const props = defineProps<{
  modelValue: any;
  regardingParents: any;
}>();

const regardingType = ref(props.modelValue.type || '');
const selectedRegItem = ref(props.modelValue.value || null);

const updateModelValue = () => {
  const regarding = {
    type: regardingType.value,
    value: selectedRegItem.value,
  };
  emit('update:modelValue', regarding);
};

watch(regardingType, updateModelValue);
watch(selectedRegItem, updateModelValue);

const emit = defineEmits(['regarding-generated', 'update:modelValue']);

const regardingStore = useRegardingStore();
regardingStore.getMetaTypes();

const metaTypeOptions = computed(() => {
  return props.regardingParents;
});

const regardingItems = ref([] as regardingItem[]);

watch(selectedRegItem, (newValue, oldValue) => {
  // This function will be called whenever selectedRegItem changes
  const regarding = {
    type: regardingType.value,
    value: selectedRegItem.value,
  };
  emit('regarding-generated', regarding);
});

async function filterItems(val: string, update: (arg0: () => void) => void) {
  regardingItems.value = [] as regardingItem[];
  try {
    await regardingStore.getRegardingItemsThatMatch(val, regardingType.value);
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    });
  }
  regardingItems.value = regardingStore.regardingItems;
  update(() => {
    const needle = val.toLowerCase();
    regardingItems.value = regardingStore.regardingItems.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1,
    );
  });
}
watch(regardingType, (newValue) => {
  if (newValue) {
    selectedRegItem.value = '';
  }
});
</script>

<template>
  <q-item-section>
    <q-select
      v-model="regardingType"
      :options="metaTypeOptions"
      label="Regarding"
      map-options
      option-label="name"
      option-value="id"
    />
  </q-item-section>
  <q-item-section>
    <q-select
      v-model="selectedRegItem"
      :disable="regardingType.id == '-1'"
      :options="regardingItems"
      option-label="name"
      option-value="id"
      use-input
      @filter="filterItems"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">No results</q-item-section>
        </q-item>
      </template>
    </q-select>
  </q-item-section>
</template>
