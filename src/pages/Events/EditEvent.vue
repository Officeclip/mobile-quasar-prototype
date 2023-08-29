<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useEventsStore } from '../../stores/EventsStore';
import { useRoute, useRouter } from 'vue-router';
import EventForm from '../../components/Events/EventsFormCtrl.vue';
import { Event } from '../../models/event';

const eventsStore = useEventsStore();
const route1 = useRouter();

//const isAllDayEvent = filterValue[0].isAllDayEvent ? 'Yes' : 'No'

const id = ref<string | string[]>('0');

const event = computed(() => {
  return eventsStore.Event;
});

onMounted(() => {
  const route = useRoute();
  console.log('id=', route.params.id);
  id.value = route.params.id;
  eventsStore.getEventDetails(Number(route.params.id));
});

function onSubmit(e: any) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const start = formData.get('startDateTime');
  const end = formData.get('endDateTime');
  console.log(`EditEvent: startDateTime: ${start}, ${end}`);
  // console.log(
  //   `onSubmit Event Value: ${event.value?.startDateTime}, ${event.value?.endDateTime}`
  // );
const newEvent = {
  id: event.value?.id,
  parentObjectServiceType: event.value?.parentObjectServiceType,
  eventType: event.value?.eventType,
  eventName: event.value?.eventName,
  eventDescription: event.value?.eventDescription,
  startDateTime: start,
  endDateTime: end,
  isAllDayEvent: event.value?.isAllDayEvent,
  eventLocation: event.value?.eventLocation



}
  eventsStore.editEvent(newEvent);
  route1.push('/simpleCalendar');
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn
          @click="$router.go(-1)"
          flat
          round
          dense
          color="white"
          icon="arrow_back"
        >
        </q-btn>
        <q-toolbar-title> Edit Event</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form @submit="onSubmit" class="q-gutter-md">
        <div>
          <EventForm :event="event" />
          <q-btn
            class="q-ml-md q-mb-md"
            label="Submit"
            type="submit"
            color="primary"
          >
          </q-btn>
        </div>
      </q-form>
    </q-page-container>
  </q-layout>
</template>

<style></style>
