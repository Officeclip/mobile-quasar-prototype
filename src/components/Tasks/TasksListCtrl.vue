<script lang="ts" setup>
import {useTasksStore} from '../../stores/TasksStore';
import {computed, onBeforeMount} from 'vue';

const props = defineProps(['params', 'owner', 'ownerFilter']);

const parentObjectId = computed(() => props.params.parentObjectId);
const parentObjectServiceType = computed(
  () => props.params.parentObjectServiceType
);
const tasksStore = useTasksStore();

const getTasks = computed(() => {
  const tasks = tasksStore.Tasks;
  if (props.ownerFilter === true) {
    return tasks.filter((e) => {
      return e.taskOwnerName === props.owner;
    });
  } else {
    return tasks;
  }

});

onBeforeMount(() => {
  tasksStore.getTasks(Number(parentObjectId.value), Number(parentObjectServiceType.value));
});

</script>
<template>
  <q-list v-for="task in getTasks" :key="task.id">
    <q-item
      v-ripple
      :to="{
        name: 'taskDetails',
        params: {
          id: task.id,
        },
      }"
      clickable
    >
      <q-item-section>
        <q-item-label>
          {{ task.subject }}
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-icon color="primary" name="chevron_right"/>
      </q-item-section>
    </q-item>
    <q-separator></q-separator>
  </q-list>
</template>
