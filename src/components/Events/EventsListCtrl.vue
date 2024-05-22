<script lang="ts" setup>
import { useEventDetailsStore } from '../../stores/event/eventDetailsStore';
import { computed, onBeforeMount } from 'vue';

const props = defineProps(['params']);

const parentObjectId = computed(() => props.params.parentObjectId);

const eventDetailsStore = useEventDetailsStore();
onBeforeMount(() => {
  eventDetailsStore.getEventsByParent(parentObjectId.value);
});
</script>
<template>
  <!-- TODO: CR: 2024-05-17: nk: Fix the below type error? -->
  <q-list v-for="eventDetail in eventDetailsStore.EventDetails" :key="eventDetail?.id">
    <q-item v-ripple :to="{
    name: 'eventDetails',
    params: {
      id: eventDetail?.id
    },
  }" clickable>
      <q-item-section>
        <q-item-label>
          {{ eventDetail?.eventName }}
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-icon color="primary" name="chevron_right" />
      </q-item-section>
    </q-item>
    <q-separator></q-separator>
  </q-list>
</template>
