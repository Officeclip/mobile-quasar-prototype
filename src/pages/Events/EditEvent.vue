<script setup lang="ts">
import { computed } from 'vue';
import { useEventDetailsStore } from '../../stores/event/eventDetailsStore';
import { useRoute, useRouter } from 'vue-router';
import EventForm from '../../components/Events/EventsFormCtrl.vue';
import dateTimeHelper from '../../helpers/dateTimeHelper';

const route = useRoute();
const router = useRouter();
const eventDetailsStore = useEventDetailsStore();

const paramsId = route.params.id;
eventDetailsStore.getEventDetailsById(paramsId);
const event = computed(() => {
  return eventDetailsStore.EventDetails;
});
console.log('testing from edit screen eventXXXXXX:', event.value);
function handleRRule(rrule: string) {
  event.value.recurrenceRule = rrule;
}

function handleRRuleText(rruleText: string) {
  event.value.repeatInfoText = rruleText;
}

function handleReminder(reminder: [string, number]) {
  event.value.remindTo = reminder[0];
  event.value.remindBeforeMinutes = reminder[1];
}

function onSubmit(e: any) {
  e.preventDefault();
  // from https://stackoverflow.com/a/70276438
  // const formData: any = new FormData(e.target);

  // const start = formData.get('startDateTime');
  // const newStartDate = event.value?.isAllDayEvent
  //   ? dateTimeHelper.convertDateToUtc(start)
  //   : dateTimeHelper.convertGeneralToUtc(start);

  // const end = formData.get('endDateTime');
  // const newEndDate = event.value?.isAllDayEvent
  //   ? dateTimeHelper.convertDateToUtc(end)
  //   : dateTimeHelper.convertGeneralToUtc(end);

  // console.log(`EditEvent: startDateTime: ${start}, ${end}`);

  // need to fix the model properties in this object
  // idea from https://stackoverflow.com/a/57611367

  // convert local start/end datetime to utc while saving into the json
  const startDateTime = event.value?.startDateTime;
  const newStartDateTime = dateTimeHelper.convertLocalDateToUTC(startDateTime);

  const endDateTime = event.value?.endDateTime;
  const newEndDateTime = dateTimeHelper.convertLocalDateToUTC(endDateTime);

  const editEvent: event = {
    id: event.value?.id as string,
    parentServiceType: event.value?.parentServiceType as number,
    eventType: event.value?.eventType as string,
    eventName: event.value?.eventName as string,
    eventDescription: event.value?.eventDescription,
    startDateTime: newStartDateTime,
    endDateTime: newEndDateTime,
    isAllDayEvent: event.value?.isAllDayEvent as boolean,
    eventLocation: event.value?.eventLocation,
    createdDate: event.value?.createdDate,
    createdGroupSId: event.value?.createdGroupSId,
    createdUserSid: event.value?.createdUserSid,
    parentSid: event.value?.parentSid,
    eventUserSid: event.value?.eventUserSid,
    isRsvp: event.value?.isRsvp,
    sendNotifications: event.value?.sendNotifications,
    repeatInfoText: event.value?.repeatInfoText,
    recurrenceRule: event.value?.recurrenceRule,
    modifiedDate: event.value?.modifiedDate,
    modifiedUserSid: event.value?.modifiedUserSid,
    timezoneId: event.value?.timezoneId,
    remindTo: event.value?.remindTo,
    remindBeforeMinutes: event.value?.remindBeforeMinutes,
    label: event.value?.label,
    meetingAttendees: event.value?.meetingAttendees,
    url: event.value?.url,
  };
  eventDetailsStore.editEventDetails(editEvent);
  router.push('/eventSummary');
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
      <q-form @submit="onSubmit" class="q-gutter-md">
        <div>
          <EventForm
            :event="event"
            @rrule-generated="handleRRule"
            @rrule-text-generated="handleRRuleText"
            @reminder-generated="handleReminder"
          />
          <!-- <q-btn
            class="q-ml-md q-mb-md"
            label="Submit"
            type="submit"
            color="primary"
          >
          </q-btn> -->
        </div>
      </q-form>
    </q-page-container>
  </q-layout>
</template>

<style></style>
