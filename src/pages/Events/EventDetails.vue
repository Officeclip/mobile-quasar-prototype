<script setup lang="ts">
import { ref, computed } from 'vue';
import { useEventsStore } from '../../stores/EventsStore';
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';
import dateTimeHelper from '../../helpers/dateTimeHelper';

const eventsStore = useEventsStore();

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
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal bordered class="bg-primary text-white" height-hint="98">
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
        <q-toolbar-title> Event details </q-toolbar-title>

        <q-btn
          :to="{ name: 'editEvent', params: { id: id } }"
          flat
          round
          dense
          color="white"
          icon="edit"
        />
        <q-btn
          @click="eventsStore.deleteEvent(event?.id); $router.go(-1)"
          flat
          round
          dense
          color="white"
          icon="delete"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-card class="relative-position card-example" flat bordered>
        <q-card-section class="q-pb-none">
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label caption>Event Name</q-item-label>
                <q-item-label class="q-mb-sm">{{
                  event?.eventName
                }}</q-item-label>

                <q-item-label caption>Description</q-item-label>
                <q-item-label class="q-mb-sm">{{
                  event?.eventDescription
                }}</q-item-label>

                <q-item-label caption>Event Location</q-item-label>
                <q-item-label class="q-mb-sm">{{
                  event?.eventLocation
                }}</q-item-label>

                <q-item-label caption>Start Date</q-item-label>
                <q-item-label class="q-mb-sm">{{
                  event?.startDateTime
                    ? dateTimeHelper.extractDateFromUtc(event.startDateTime)
                    : 'YYYY'
                }}</q-item-label>

                <q-item-label caption>End Date</q-item-label>
                <q-item-label class="q-mb-sm">{{
                  event?.endDateTime
                    ? dateTimeHelper.extractDateFromUtc(event?.endDateTime)
                    : 'YYYY'
                }}</q-item-label>

                <q-item-label caption>Is All Day Event ?</q-item-label>
                <q-item-label class="q-mb-sm">{{
                  event?.isAllDayEvent ? 'Yes' : 'No'
                }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-page-container>
  </q-layout>
</template>
