<script lang="ts" setup>
import {computed, ref, watch} from 'vue';
import {useRegardingStore} from 'stores/regarding/regardingStore';
import {regardingItem} from "src/models/general/regardingItem";


const props = defineProps<{
  modelValue: any,
  regardingParents: any
}>();

console.log('model', props.modelValue.type.id);
const regardingType = ref(props.modelValue.type.id || '');
const selectedRegItem = ref(props.modelValue.value.name || null);

const updateModelValue = () => {
  const regarding = {
    type: regardingType.value,
    value: selectedRegItem.value
  };
  emit('update:modelValue', regarding);
};

watch(regardingType, updateModelValue);
watch(selectedRegItem, updateModelValue);

const emit = defineEmits(['regarding-generated', 'update:modelValue'])


const regardingStore = useRegardingStore();
regardingStore.getMetaTypes();

const metaTypeOptions = computed(() => {
  return props.regardingParents;
});

const regardingItems = ref([] as regardingItem[]);


watch(selectedRegItem, (newValue, oldValue) => {
  // This function will be called whenever selectedRegItem changes
  console.log(regardingType.value);
  console.log(selectedRegItem.value);
  const regarding = {
    type: regardingType.value,
    value: selectedRegItem.value
  }
  emit('regarding-generated', regarding);
});

async function filterItems(
  val: string,
  update: (arg0: () => void) => void,
  abort: () => void
) {
  if (val.length < 2) {
    abort();
    return;
  } else if (val.length === 2) {
    regardingItems.value = [] as regardingItem[];
    await regardingStore.getRegardingItemsThatMatch(val, regardingType.value);
    regardingItems.value = regardingStore.regardingItems;
  }

  update(() => {
    console.log('update');
    const needle = val.toLowerCase();
    regardingItems.value = regardingStore.regardingItems.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  });
}

</script>

<template>
  <q-list>
    <q-item class="q-mt-none">
      <q-item-section class="q-mr-sm">
        <!-- <pre>{{ parentServiceType }}</pre> -->
        <q-select
          v-model="regardingType"
          :options="metaTypeOptions"
          dense
          label="Regarding"
          map-options
          option-label="name"
          option-value="id"
        />
      </q-item-section>
      <q-item-section class="q-mr-sm">
        <q-select
          v-model="selectedRegItem"
          :disable="regardingType==''"
          :options="regardingItems"
          dense
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
    </q-item>
  </q-list>
</template>
