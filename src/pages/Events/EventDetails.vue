<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue';
import { useEventDetailsStore } from '../../stores/event/eventDetailsStore';
import { useEventListsStore } from '../../stores/event/eventListsStore';
import { useReminderDataStore } from 'stores/reminder/reminderData';
import { useRoute, useRouter } from 'vue-router';
import dateTimeHelper from '../../helpers/dateTimeHelper';
import OCItem from '../../components/OCcomponents/OC-Item.vue';
import ConfirmationDialog from '../../components/general/ConfirmDelete.vue';
import { isAllowed } from 'src/helpers/security';
import { useQuasar } from 'quasar';
import logger from 'src/helpers/logger';

const route = useRoute();
const router = useRouter();
const eventDetailsStore = useEventDetailsStore();
const reminderDataStore = useReminderDataStore();
const $q = useQuasar();

const id = route.params.id;
reminderDataStore.getReminderObject();


onMounted(async () => {
  logger.log('*** Event Details:onMounted(async...) ***');
  try {
    await eventDetailsStore.getEventDetailsById(id);
  } catch (error) {
    logger.log(`*** Event Details:error:catch(${error}) ***`, 'error');

    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      logger.log('*** Event Details:onMounted:onOk ***');
      await router.push({ path: '/eventSummary' });
      await router.go(0);
    });
  }
});

const event = computed(() => {
  return eventDetailsStore.eventDetails;
});

// Find the selected reminder option and time based on refs
const selectedOption = computed(() => {
  const reminderOptions = reminderDataStore.ReminderOptions;
  const obj = reminderOptions.find(
    (option: any) => option.value === event.value?.reminder.to
  );
  return obj ? obj : 'null';
});

//TODO: CR: 2024-05-17: nk: Fix the below type error?
const selectedTime = computed(() => {
  const reminderTimes = reminderDataStore.ReminderTimes;
  const obj = reminderTimes.find(
    (time: any) => time.value === event.value?.reminder.beforeMinutes
  );
  return obj ? obj : 'null';
});

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
const startDate = computed(() => {
  if (event.value?.startDateTime) {
    const data = dateTimeHelper.extractDateandTimeFromUtc(
      event.value?.startDateTime,
      event.value?.isAllDayEvent
    );
    return data;
  }
  return 'YYYY';
});
const endDate = computed(() => {
  if (event.value?.endDateTime) {
    const data = dateTimeHelper.extractDateandTimeFromUtc(
      event.value?.endDateTime,
      event.value?.isAllDayEvent
    );
    return data;
  }
  return 'YYYY';
});
const createdDate = computed(() => {
  if (event.value?.createdDate) {
    const data = dateTimeHelper.extractDateandTimeFromUtc(
      event.value?.createdDate,
      event.value?.isAllDayEvent
    );
    return data;
  }
  return 'YYYY';
});
const lastModifiedDate = computed(() => {
  if (event.value?.modifiedDate) {
    const data = dateTimeHelper.extractDateandTimeFromUtc(
      event.value?.modifiedDate,
      event.value?.isAllDayEvent
    );
    return data;
  }
  return 'YYYY';
});
const attendeesList = computed(() => {
  if (event.value?.meetingAttendees) {
    const data = event.value?.meetingAttendees;
    return data;
  }
  return 'No attendees added yet';
});

//filter and get the single label object by labelId
const eventListStore = useEventListsStore();
eventListStore.getEventLists();
const labelNameById = computed(() => {
  const labelData = eventListStore.Labels;
  const obj = labelData.find((obj: any) => obj.id === event.value?.label);
  return obj ? obj : null;
});

const showTimeAsById = computed(() => {
  const data = eventListStore.ShowMyTimeAs;
  const obj = data.find((obj: any) => obj.id === event.value?.showTimeAs);
  return obj ? obj : null;
});

const title = ref('Confirm');
const message = ref('Are you sure you want to delete this event?');
const showConfirmationDialog = ref(false);
const displayConfirmationDialog = () => {
  showConfirmationDialog.value = true;
};
const cancelConfirmation = () => {
  showConfirmationDialog.value = false;
};
const confirmDeletion = async () => {
  // eventDetailsStore.deleteEventDetails(event.value?.id).then(() => {
  //   showConfirmationDialog.value = false;
  //   router.go(-1);
  //}
  try {
    await eventDetailsStore.deleteEventDetails(event.value?.id)
    showConfirmationDialog.value = false;
    router.go(-1);
  }
  catch (error) {
    //console.log('Error in deleting the task detail')
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      console.log('*** Delete event :onSubmit(...):onOK ***');
      showConfirmationDialog.value = false;
      //router.go(0);
    });
  }
};
const openUrl = () => {
  const url = event.value?.url;
  window.open('http://' + url, '_blank');
};
const projectServiceItem = computed(() => {
  return `${event.value?.parent.type.name} : ${event.value?.parent.value.name}`;
});

const isAllowEdit = computed(() => {
  //TODO: CR: 2024-05-17: nk: Fix the below type error?
  return isAllowed({
    security: { write: event.value?.security.write },
  });
});

const isAllowDelete = computed(() => {
  //TODO: CR: 2024-05-17: nk: Fix the below type error?
  return isAllowed({
    security: { delete: event.value?.security.delete },
  });
});
</script>

<style>
.q-dialog__backdrop {
  backdrop-filter: blur(7px);
}
</style>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header bordered class="bg-primary text-white" height-hint="98" reveal>
      <q-toolbar>
        <q-btn color="white" dense flat icon="arrow_back" round @click="$router.go(-1)" />
        <q-toolbar-title>
          <OCItem :value="`${showMeetingType(event?.eventType)} event`" />
        </q-toolbar-title>
        <div>
          <q-btn v-if="isAllowEdit" :to="{ name: 'editEvent', params: { id: id } }" color="white" dense flat icon="edit"
            round />
          <q-btn v-else dense disable flat icon="edit" round>
            <q-tooltip class="bg-accent">Editing is disabled</q-tooltip>
          </q-btn>
        </div>
        <div>
          <q-btn v-if="isAllowDelete" color="white" dense flat icon="delete" round @click="displayConfirmationDialog" />
          <q-btn v-else dense disable flat icon="delete" round>
            <q-tooltip class="bg-accent">Deleting is disabled</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-list>
        <OCItem :value="event?.eventName" class="text-weight-regular text-h6" />
        <OCItem v-if="event?.eventDescription" :value="event?.eventDescription" />

        <OCItem v-if="event?.eventLocation" title="Location" :value="event?.eventLocation" />
        <!-- TODO CR: 2024-05-17: nk: Fix the below type errors. -->
        <OCItem title="Start Date" :value="startDate" />
        <OCItem title="End Date" :value="endDate" />
        <OCItem title="Is All Day Event ?" :value="event?.isAllDayEvent ? 'Yes' : 'No'" />
        <q-item v-if="event?.meetingAttendees.length">
          <q-item-section>
            <q-item-label caption> Attendees </q-item-label>
            <div style="display: inline-flex; align-items: baseline">
              <q-item-label v-for="attendee in attendeesList" :key="attendee.name">
                <q-chip dense class="q-px-sm">{{ attendee.name }}</q-chip>
                <q-tooltip>{{ attendee.email }}</q-tooltip>
              </q-item-label>
            </div>
          </q-item-section>
        </q-item>
        <q-item v-if="event?.url">
          <q-item-section>
            <q-item-label caption>Url </q-item-label>
            <q-item-label class="cursor-pointer" @click="openUrl">{{ event.url }}
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="labelNameById">
          <q-item-section>
            <q-item-label caption> Label </q-item-label>
            <q-item-label>
              <span class="q-py-xs q-px-sm" :style="{ backgroundColor: labelNameById?.color }">{{ labelNameById?.name
                }}</span>
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="showTimeAsById">
          <q-item-section>
            <q-item-label caption> Show Time As </q-item-label>
            <q-item-label>
              <span class="q-py-xs q-px-sm" :style="{ backgroundColor: showTimeAsById?.color }">{{ showTimeAsById?.name
                }}</span>
            </q-item-label>
          </q-item-section>
        </q-item>
        <!-- TODO: CR: 2024-05-17: nk: Fix the below type error? -->
        <OCItem v-if="event?.recurrence.rule" title="Repeat" :value="event?.recurrence.text" />
        <OCItem v-if="event?.reminder.to" title="Reminder"
          :value="`${selectedOption?.label} ${selectedTime?.label} Before`" />
        <q-item>
          <q-item-section>
            <q-item-label caption> Created </q-item-label>
            <q-item-label>
              {{ event?.createdUserName }} <span class="text-italic">On</span>
              {{ createdDate }}
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label caption> Last Modified </q-item-label>
            <q-item-label>
              {{ event?.modifiedUserName }} <span class="text-italic">On</span>
              {{ lastModifiedDate }}
            </q-item-label>
          </q-item-section>
        </q-item>
        <OCItem title="Regarding" :value="projectServiceItem" />
      </q-list>
    </q-page-container>
  </q-layout>

  <ConfirmationDialog v-if="showConfirmationDialog" :showConfirmationDialog="showConfirmationDialog" :title="title"
    :message="message" @cancel="cancelConfirmation" @confirm="confirmDeletion" />
</template>
