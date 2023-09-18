<script lang="ts" setup>
import {computed, onBeforeMount, ref} from 'vue';
import {useEventsStore} from '../../stores/EventsStore';
import {useRoute, useRouter} from 'vue-router';
import dateTimeHelper from '../../helpers/dateTimeHelper';

const eventsStore = useEventsStore();

const router = useRouter();

const id = ref<string | string[]>('0');

const event = computed(() => {
  return eventsStore.Event;
});

onBeforeMount(() => {
  const route = useRoute();
  console.log('id=', route.params.id);
  id.value = route.params.id;
  eventsStore.getEventDetails(Number(route.params.id));
});

function displayDateorBoth(x: string) {
  if (event.value?.isAllDayEvent) {
    return dateTimeHelper.extractDateFromUtc(x);
  } else {
    return dateTimeHelper.extractDateandTimeFromUtc(x);
  }
}

const showConfirmationDialog = ref(false);

function displayConfirmationDialog() {
  showConfirmationDialog.value = true;
}

function confirmDeleteEvent() {
  eventsStore.deleteEvent(event.value?.id).then(() => {
    showConfirmationDialog.value = false;
    router.go(-1);
  });
}
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
                <q-item-label caption>Event Name</q-item-label>
                <q-item-label class="q-mb-sm">{{
                    event?.eventName
                  }}
                </q-item-label>

                <q-item-label caption>Description</q-item-label>
                <q-item-label class="q-mb-sm">{{
                    event?.eventDescription
                  }}
                </q-item-label>

                <q-item-label caption>Event Location</q-item-label>
                <q-item-label class="q-mb-sm">{{
                    event?.eventLocation
                  }}
                </q-item-label>

                <q-item-label caption>Start Date</q-item-label>
                <q-item-label class="q-mb-sm">{{
                    event?.startDateTime
                      ? displayDateorBoth(event?.startDateTime)
                      : 'YYYY'
                  }}
                </q-item-label>

                <q-item-label caption>End Date</q-item-label>
                <q-item-label class="q-mb-sm">{{
                    event?.endDateTime
                      ? displayDateorBoth(event?.endDateTime)
                      : 'YYYY'
                  }}
                </q-item-label>

                <q-item-label caption>Is All Day Event ?</q-item-label>
                <q-item-label class="q-mb-sm">{{
                    event?.isAllDayEvent ? 'Yes' : 'No'
                  }}
                </q-item-label>
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
          <q-btn
            color="negative"
            label="Delete"
            @click="confirmDeleteEvent"
          />
        </q-card-actions>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
