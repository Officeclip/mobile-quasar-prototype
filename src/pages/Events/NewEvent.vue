<script lang="ts" setup>
import EventForm from '../../components/Events/EventsFormCtrl.vue';
import { useEventDetailsStore } from 'stores/event/eventDetailsStore';
import { ref, Ref } from 'vue';
import { useRouter } from 'vue-router';
import { eventDetails } from 'src/models/event/eventDetails';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const eventDetailsStore = useEventDetailsStore();
const router = useRouter();

const isValid = ref(false);

//TODO: CR: 2024-05-17: nk: Fix the below type error?
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
  eventType: { id: '2', name: '' },
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
  reminder: {},
  recurrence: {
    text: '',
    rule: '',
  },
  label: {},
  showTimeAs: {},
  meetingAttendees: [],
  url: '',
  security: {},
});

//TODO: CR: 2024-05-17: nk: Fix the below type error?
function handleRRule(rrule: string) {
  event.value.recurrence.rule = rrule;
}

//TODO: CR: 2024-05-17: nk: Fix the below type error?
function handleRRuleText(rruleText: string) {
  event.value.recurrence.text = rruleText;
}

//TODO: CR: 2024-05-17: nk: Fix the below type error?
function handleReminder(reminder: [string, number]) {
  event.value.reminder.to = reminder[0];
  event.value.reminder.beforeMinutes = reminder[1];
}

async function onSubmit(e: any) {
  e.preventDefault();
  try {
    const newEventDetails = ref(event);
    await eventDetailsStore.addEventDetails(newEventDetails.value);
    router.go(-1);
  } catch (error) {
    console.log(`*** New Event:onSubmit(...):catch: ${error} ***`);
    console.log(`---------${error}---------`);
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      console.log('*** New Event:onSubmit(...):onOK ***');
    });
  }
}

const handleValidation = (valid: boolean) => {
  console.log(`handleValidation: ${isValid.value}`);
  isValid.value = valid;
};
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn
          color="white"
          dense
          flat
          icon="arrow_back"
          round
          @click="$router.go(-1)"
        >
        </q-btn>
        <q-toolbar-title> New Event</q-toolbar-title>
        <q-btn
          class="q-px-md"
          dense
          label="Save"
          no-caps
          outline
          rounded
          type="submit"
          @click="onSubmit"
        />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form class="q-gutter-md" @submit="onSubmit">
        <div>
          <EventForm
            :event="event"
            @rrule-generated="handleRRule"
            @rrule-text-generated="handleRRuleText"
            @reminder-generated="handleReminder"
            @validation="handleValidation"
          />
          <q-btn
            class="q-ml-sm"
            color="primary"
            flat
            label="Reset"
            no-caps
            type="reset"
          />
        </div>
      </q-form>
    </q-page-container>
  </q-layout>
</template>
