<script setup lang="ts">
import { useEventsStore } from '../../stores/EventsStore';
import { computed, onBeforeMount } from 'vue';

const props = defineProps(['params']);

const parentObjectId = computed(() => props.params.parentObjectId);
const parentObjectServiceType = computed(
  () => props.params.parentObjectServiceType
);

const eventsStore = useEventsStore();
onBeforeMount(() => {
  eventsStore.getEventsById(
    Number(parentObjectId.value),
    parentObjectServiceType.value
  );
});
</script>
<template>
      <q-list v-for="event in eventsStore.Events" :key="event.id">
        <q-item
          :to="{
            name: 'eventDetails',
            params: {
              id: event.id,
            },
          }"
          clickable
          v-ripple
        >
          <q-item-section>
            <q-item-label>
              {{ event.eventName }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon color="primary" name="chevron_right" />
          </q-item-section>
        </q-item>
        <q-separator></q-separator>
      </q-list>
</template>
