<script lang="ts" setup>
import { computed, onBeforeMount, ref } from 'vue';
import { useEventDetailsStore } from '../../stores/event/eventDetailsStore';
import { useEventListsStore } from '../../stores/event/eventListsStore';
import { useRoute, useRouter } from 'vue-router';
import dateTimeHelper from '../../helpers/dateTimeHelper';

const eventDetailsStore = useEventDetailsStore();
const router = useRouter();

const id = ref<string | string[]>('0');

const event = computed(() => {
  console.log('details page:', eventDetailsStore.EventDetails);
  return eventDetailsStore.EventDetails;
});

onBeforeMount(() => {
  const route = useRoute();
  console.log('id=', route.params.id);
  id.value = route.params.id;
  eventDetailsStore.getEventDetailsById(route.params.id);
});

const showConfirmationDialog = ref(false);

function displayConfirmationDialog() {
  showConfirmationDialog.value = true;
}

function confirmDeleteEvent() {
  console.log('deleted event id is :', event.value?.id);
  eventDetailsStore.deleteEventDetails(event.value?.id).then(() => {
    showConfirmationDialog.value = false;
    router.go(-1);
  });
}
function showMeetingType(eventType: string | undefined) {
  switch (eventType) {
    case '1':
      return 'Group';
    case '2':
      return 'Meeting';
    case '3':
      return 'Private';
    default:
      return '';
  }
}
const attendeesList = computed(() => {
  const data = event.value?.meetingAttendees;
  return data;
});
const eventListStore = useEventListsStore();
eventListStore.getEventLists();
const labelNameById = computed(() => {
  const labelData = eventListStore.Labels;
  const obj = labelData.find((obj: any) => obj.id === event.value?.label);
  return obj ? obj.name : null;
});
console.log('Testing the label name by labelis::', labelNameById);
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header bordered class="bg-primary text-white" height-hint="98" reveal>
      <q-toolbar>
        <q-btn
          color="white"
          dense
          flat
          icon="arrow_back"
          round
          @click="$router.go(-1)"
        />
        <q-toolbar-title> Event details</q-toolbar-title>

        <q-btn
          :to="{ name: 'editEvent', params: { id: id } }"
          color="white"
          dense
          flat
          icon="edit"
          round
        />
        <q-btn
          color="white"
          dense
          flat
          icon="delete"
          round
          @click="displayConfirmationDialog"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-card bordered class="relative-position card-example" flat>
        <q-card-section class="q-pb-none">
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label
                  >{{ showMeetingType(event?.eventType) }} event</q-item-label
                >
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>Created On</q-item-label>
                <q-item-label>{{
                  dateTimeHelper.convertDateTimeUTCtoLocal(event?.createdDate)
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>Event Name</q-item-label>
                <q-item-label>{{ event?.eventName }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="event?.eventDescription">
              <q-item-section>
                <q-item-label caption>Description</q-item-label>
                <q-item-label>{{ event?.eventDescription }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="event?.eventLocation">
              <q-item-section>
                <q-item-label caption>Event Location</q-item-label>
                <q-item-label>{{ event?.eventLocation }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label caption>Start Date</q-item-label>
                <q-item-label
                  >{{
                    event?.startDateTime
                      ? dateTimeHelper.convertDateTimeUTCtoLocal(
                          event?.startDateTime,
                          event?.isAllDayEvent
                        )
                      : 'YYYY'
                  }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label caption>End Date</q-item-label>
                <q-item-label
                  >{{
                    event?.endDateTime
                      ? dateTimeHelper.convertDateTimeUTCtoLocal(
                          event?.endDateTime,
                          event?.isAllDayEvent
                        )
                      : 'YYYY'
                  }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label caption>Is All Day Event ?</q-item-label>
                <q-item-label>{{
                  event?.isAllDayEvent ? 'Yes' : 'No'
                }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="event?.meetingAttendees">
              <q-item-section>
                <q-item-label caption> Attendees </q-item-label>
                <q-item-label
                  v-for="attendee in attendeesList"
                  :key="attendee.name"
                >
                  {{ attendee.name }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="event?.label">
              <q-item-section>
                <q-item-label caption> Label </q-item-label>
                <q-item-label> {{ labelNameById }} </q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="event?.repeatInfoText">
              <q-item-section>
                <q-item-label caption> Repeat </q-item-label>
                <q-item-label> {{ event?.repeatInfoText }} </q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="event?.recurrenceRule">
              <q-item-section>
                <q-item-label caption> Recurrence </q-item-label>
                <q-item-label> {{ event?.recurrenceRule }} </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-page-container>
  </q-layout>

  <q-dialog v-model="showConfirmationDialog">
    <q-card>
      <q-card-section>
        <q-item-label>Confirm</q-item-label>
        <q-item-label>Are you sure you want to delete this event?</q-item-label>
        <q-card-actions align="right">
          <q-btn
            color="primary"
            label="Cancel"
            @click="showConfirmationDialog = false"
          />
          <q-btn color="negative" label="Delete" @click="confirmDeleteEvent" />
        </q-card-actions>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
