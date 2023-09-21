<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useEventDetailsStore } from '../../stores/event/eventDetailsStore';
import { useRoute, useRouter } from 'vue-router';
import EventForm from '../../components/Events/EventsFormCtrl.vue';
import dateTimeHelper from '../../helpers/dateTimeHelper';
import { eventDetails } from '../../models/event/eventDetails';

const eventDetailsStore = useEventDetailsStore();
const route1 = useRouter();

const id = ref<string | string[]>('0');

const eventDetails = computed(() => {
  return eventDetailsStore.EventDetails;
});

onMounted(() => {
  const route = useRoute();
  console.log('id=', route.params.id);
  id.value = route.params.id;
  eventDetailsStore.getEventDetailsById(route.params.id);
});

function onSubmit(e: any) {
  e.preventDefault();
  // from https://stackoverflow.com/a/70276438
  const formData: any = new FormData(e.target);

  const start = formData.get('startDateTime');
  const newStartDate = eventDetails.value?.isAllDayEvent
    ? dateTimeHelper.convertDateToUtc(start)
    : dateTimeHelper.convertGeneralToUtc(start);

  const end = formData.get('endDateTime');
  const newEndDate = eventDetails.value?.isAllDayEvent
    ? dateTimeHelper.convertDateToUtc(end)
    : dateTimeHelper.convertGeneralToUtc(end);

  console.log(`EditEvent: startDateTime: ${start}, ${end}`);

  // need to fix the model properties in this object
  // idea from https://stackoverflow.com/a/57611367
  const editEvent: eventDetails = {
    id: eventDetails.value?.id as string,
    parentServiceType: eventDetails.value?.parentServiceType as number,
    eventType: eventDetails.value?.eventType as number,
    eventName: eventDetails.value?.eventName as string,
    eventDescription: eventDetails.value?.eventDescription,
    startDateTime: newStartDate,
    endDateTime: newEndDate,
    isAllDayEvent: eventDetails.value?.isAllDayEvent as boolean,
    eventLocation: eventDetails.value?.eventLocation,
    createdDate: '',
    createdGroupSId: '',
    createdUserSid: '',
    parentSid: '',
    eventUserSid: '',
    isRsvp: false,
    repeatInfoText: '',
    recurrenceRule: '',
    modifiedDate: '',
    modifiedUserSid: '',
    timezoneId: -1,
    remindTo: '',
    remindBeforeMinutes: 0,
    label: -1,
    meetingAttendees: [],
    url: ''
  };
  eventDetailsStore.editEventDetails(editEvent);
  route1.push('/eventSummary');
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
          <EventForm :event="eventDetails" />
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
