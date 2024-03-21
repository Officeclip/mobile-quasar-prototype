<script lang="ts" setup>
import { useEventDetailsStore } from '../../stores/event/eventDetailsStore';
import { computed, onBeforeMount } from 'vue';

const props = defineProps(['params']);

const parentObjectId = computed(() => props.params.parentObjectId);
// const parentObjectServiceType = computed(
//   () => props.params.parentObjectServiceType
// );

const eventDetailsStore = useEventDetailsStore();
onBeforeMount(() => {
  eventDetailsStore.getEventsByParent(
    Number(parentObjectId.value)
  );
});
</script>
<template>
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
