<script setup lang="ts">
import { computed, Ref, ref } from 'vue';
import { useEventDetailsStore } from '../../stores/event/eventDetailsStore';
import { useRoute, useRouter } from 'vue-router';
import EventForm from '../../components/Events/EventsFormCtrl.vue';
import { eventDetails } from 'src/models/event/eventDetails';
import { useQuasar } from 'quasar';
import OCSaveButton from '../../components/OCcomponents/OC-SaveButton.vue';

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const eventDetailsStore = useEventDetailsStore();

const paramsId = route.params.id;
const appName = route.params.appName;
eventDetailsStore.getEventDetailsById(paramsId);

//TODO: CR: 2024-05-17: nk: Fix the below type error?

const event: Ref<eventDetails> = eventDetailsStore.EventDetails;
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
const childComponent = ref(null);

async function onSubmit(e: any) {
  //e.preventDefault();
  try {
    if (!childComponent.value.validateAll()) return;
    const editEventDetails = ref(event);
    await eventDetailsStore.editEventDetails(editEventDetails.value);
    router.go(-2);
  } catch (error) {
    console.log(`*** Edit Event:onSubmit(...):catch: ${error} ***`);
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      console.log('*** Edit Event:onSubmit(...):onOK ***');
    });
  }
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
        <OCSaveButton @handleClick="onSubmit"></OCSaveButton>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form @submit="onSubmit" class="q-gutter-md">
        <div>
          <EventForm
            v-if="event"
            :event="event"
            :appName="appName"
            ref="childComponent"
            @rrule-generated="handleRRule"
            @rrule-text-generated="handleRRuleText"
            @reminder-generated="handleReminder"
          />
        </div>
      </q-form>
    </q-page-container>
  </q-layout>
</template>
