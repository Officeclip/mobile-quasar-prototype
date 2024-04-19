<script lang="ts" setup>
import EventForm from '../../components/Events/EventsFormCtrl.vue';
import { useEventDetailsStore } from 'stores/event/eventDetailsStore';
import { ref, Ref } from 'vue';
import { useRouter } from 'vue-router';
import { eventDetails } from 'src/models/event/eventDetails';

const eventDetailsStore = useEventDetailsStore();

const router = useRouter();

const event: Ref<eventDetails> = ref({
  id: '',
  createdDate: new Date().toISOString(),
  createdGroupSid: '',
  createdUserSid: '',
  createdUserName: '',
  parent: {
    type: {
      id: '',
      name: '',
    },
    value: {
      id: '',
      name: '',
    },
  },
  eventType: '2',
  eventName: '',
  eventDescription: '',
  startDateTime: new Date().toISOString(),
  endDateTime: new Date().toISOString(),
  isAllDayEvent: false,
  eventUserSid: '',
  isRsvp: false,
  sendNotifications: false,
  eventLocation: '',
  modifiedDate: '',
  modifiedUserSid: '',
  modifiedUserName: '',
  reminder: {
    to: '',
    beforeMinutes: '',
  },
  recurrence: {
    text: '',
    rule: '',
  },
  label: '',
  showTimeAs: '',
  meetingAttendees: [],
  url: '',
  security: [],
});

function handleRRule(rrule: string) {
  event.value.recurrence.rule = rrule;
}

function handleRRuleText(rruleText: string) {
  event.value.recurrence.text = rruleText;
}

function handleReminder(reminder: [string, number]) {
  event.value.reminder.to = reminder[0];
  event.value.reminder.beforeMinutes = reminder[1];
}

function onSubmit(e: any) {
  e.preventDefault();
  const newEventDetails = ref(event);
  eventDetailsStore.addEventDetails(newEventDetails.value);
  router.go(-1);
  //router.push('/eventSummary');
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn color="white" dense flat icon="arrow_back" round @click="$router.go(-1)">
        </q-btn>
        <q-toolbar-title> New Event</q-toolbar-title>
        <q-btn class="q-px-md" dense label="Save" no-caps outline rounded type="submit" @click="onSubmit" />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form class="q-gutter-md" @submit="onSubmit">
        <div>
          <EventForm :event="event" @rrule-generated="handleRRule" @rrule-text-generated="handleRRuleText"
            @reminder-generated="handleReminder" />
          <!-- <q-btn
            class="q-ml-md"
            color="primary"
            label="Save"
            no-caps
            type="submit"
          /> -->
          <q-btn class="q-ml-sm" color="primary" flat label="Reset" no-caps type="reset" />
        </div>
      </q-form>
    </q-page-container>
  </q-layout>
</template>

<style scoped></style>
