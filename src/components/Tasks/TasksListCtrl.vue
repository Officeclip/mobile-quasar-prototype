<script setup lang="ts">
import { useTasksStore } from '../../stores/TasksStore';
import { computed, onBeforeMount } from 'vue';

const props = defineProps(['params']);

const parentObjectId = computed(() => props.params.parentObjectId);
const parentObjectServiceType = computed(
  () => props.params.parentObjectServiceType
);
const tasksStore = useTasksStore();

const getTasks = computed(() => {
  return tasksStore.Tasks;
});

onBeforeMount(() => {
  tasksStore.getTasks(Number(parentObjectId.value), Number(parentObjectServiceType.value));
});

</script>
<template>
  <q-list v-for="task in getTasks" :key="task.id">
    <q-item
      :to="{
        name: 'taskDetails',
        params: {
          id: task.id,
        },
      }"
      clickable
      v-ripple
    >
      <q-item-section>
        <q-item-label>
          {{ task.subject }}
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-icon color="primary" name="chevron_right" />
      </q-item-section>
    </q-item>
    <q-separator></q-separator>
  </q-list>
</template>
