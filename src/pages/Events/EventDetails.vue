<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue';
import { useEventDetailsStore } from '../../stores/event/eventDetailsStore';
import { useReminderDataStore } from 'stores/reminder/reminderData';
import { useRoute, useRouter } from 'vue-router';
import dateTimeHelper from '../../helpers/dateTimeHelper';
import OCItem from '../../components/OCcomponents/OC-Item.vue';
import ConfirmationDialog from '../../components/general/ConfirmDelete.vue';
import { isAllowed } from 'src/helpers/security';
import { useQuasar } from 'quasar';
import logger from 'src/helpers/logger';
import { getEventShowTimeAsColor } from 'src/helpers/colorIconHelper';

const route = useRoute();
const router = useRouter();
const eventDetailsStore = useEventDetailsStore();
const reminderDataStore = useReminderDataStore();
const $q = useQuasar();

const id = route.params.id;
const appName = route.params.appName;

onMounted(async () => {
  logger.log('*** Event Details:onMounted(async...) ***');
  try {
    await eventDetailsStore.getEventDetailsById(id);
    await reminderDataStore.getReminderObject();
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

const isAllowEdit = computed(() => {
  return isAllowed({
    security: { write: event.value?.security?.write },
  });
});

const isAllowDelete = computed(() => {
  return isAllowed({
    security: { delete: event.value?.security?.delete },
  });
});

const event = computed(() => {
  return eventDetailsStore?.eventDetails;
});

//TODO: CR: 2024-05-17: nk: Fix the below type error?
const selectedTime = computed(() => {
  const reminderTimes = reminderDataStore.ReminderTimes;
  const obj = reminderTimes.find(
    (time: any) => time.value === event.value?.reminder?.beforeMinutes
  );
  return obj ? obj : 'null';
});

const startDate = computed(() => {
  if (event.value?.startDateTime) {
    const formattedDate = dateTimeHelper.formatDateTimeFromRestAPIForUI(
      event.value?.startDateTime,
      event.value?.isAllDayEvent
    );
    return formattedDate;
  }
  return null;
});

const endDate = computed(() => {
  if (event.value?.endDateTime) {
    const formattedDate = dateTimeHelper.formatDateTimeFromRestAPIForUI(
      event.value?.endDateTime,
      event.value?.isAllDayEvent
    );
    return formattedDate;
  }
  return null;
});

const createdDate = computed(() => {
  if (event.value?.createdDate) {
    const data = dateTimeHelper.formatDateandTimeFromUtc(
      event.value?.createdDate
    );
    return data;
  }
  return null;
});

const lastModifiedDate = computed(() => {
  if (event.value?.modifiedDate) {
    const data = dateTimeHelper.formatDateandTimeFromUtc(
      event.value?.modifiedDate
    );
    return data;
  }
  return null;
});
const attendeesList = computed(() => {
  if (event.value?.meetingAttendees) {
    const data = event.value?.meetingAttendees;
    return data;
  }
  return null;
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
  try {
    await eventDetailsStore.deleteEventDetails(event.value?.id);
    showConfirmationDialog.value = false;
    router.go(-1);
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      console.log('*** Delete event :onSubmit(...):onOK ***');
      showConfirmationDialog.value = false;
    });
  }
};
const openUrl = () => {
  const url = event.value?.url;
  window.open('http://' + url, '_blank');
};
const projectServiceItem = computed(() => {
  return `${event.value?.parent.type?.name} : ${event.value?.parent.value?.name}`;
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
        <q-btn
          color="white"
          dense
          flat
          icon="arrow_back"
          round
          @click="$router.go(-1)"
        />
        <q-toolbar-title>
          <OCItem :value="event?.eventType?.name" />
        </q-toolbar-title>
        <div>
          <q-btn
            v-if="isAllowEdit"
            :to="{ name: 'editEvent', params: { id: id, appName: appName } }"
            color="white"
            dense
            flat
            icon="edit"
            round
          />
          <q-btn v-else dense disable flat icon="edit" round>
            <q-tooltip class="bg-accent">Editing is disabled</q-tooltip>
          </q-btn>
        </div>
        <div>
          <q-btn
            v-if="isAllowDelete"
            color="white"
            dense
            flat
            icon="delete"
            round
            @click="displayConfirmationDialog"
          />
          <q-btn v-else dense disable flat icon="delete" round>
            <q-tooltip class="bg-accent">Deleting is disabled</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-list>
        <OCItem :value="event?.eventName" class="text-weight-regular text-h6" />
        <OCItem
          v-if="event?.eventDescription !== ''"
          :value="event?.eventDescription"
        />
        <OCItem
          v-if="event?.eventLocation"
          title="Location"
          :value="event?.eventLocation"
        />
        <!-- TODO CR: 2024-05-17: nk: Fix the below type errors. -->
        <OCItem title="Start Date" :value="startDate" />
        <OCItem title="End Date" :value="endDate" />
        <OCItem
          title="Is All Day Event ?"
          :value="event?.isAllDayEvent ? 'Yes' : 'No'"
        />
        <q-item v-if="event?.meetingAttendees?.length">
          <q-item-section>
            <q-item-label caption> Attendees </q-item-label>
            <div style="display: inline-flex; align-items: baseline">
              <q-item-label
                v-for="attendee in attendeesList"
                :key="attendee.id"
              >
                <q-chip dense class="q-px-sm">{{ attendee?.name }}</q-chip>
                <q-tooltip>{{ attendee?.email }}</q-tooltip>
              </q-item-label>
            </div>
          </q-item-section>
        </q-item>
        <q-item v-else>
          <q-item-section> No Attendees selected </q-item-section>
        </q-item>
        <q-item v-if="event?.url">
          <q-item-section>
            <q-item-label caption>Url </q-item-label>
            <q-item-label class="cursor-pointer" @click="openUrl"
              >{{ event?.url }}
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="event?.label?.id !== '-1'">
          <q-item-section>
            <q-item-label caption> Label </q-item-label>
            <q-item-label>
              <span
                class="q-py-xs q-px-sm"
                :style="{ backgroundColor: event?.label?.backColor }"
                >{{ event?.label?.name }}</span
              >
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="event?.showTimeAs?.id !== '-1'">
          <q-item-section>
            <q-item-label caption> Show Time As </q-item-label>
            <q-item-label>
              <span
                class="q-py-xs q-px-sm"
                :style="{
                  backgroundColor: getEventShowTimeAsColor(
                    event?.showTimeAs?.name
                  ) as string,
                }"
                >{{ event?.showTimeAs?.name }}</span
              >
            </q-item-label>
          </q-item-section>
        </q-item>
        <OCItem
          v-if="event?.recurrence?.rule"
          title="Repeat"
          :value="event?.recurrence?.text"
        />
        <OCItem
          v-if="event?.reminder?.to"
          title="Reminder"
          :value="`${event?.reminder?.to} ${selectedTime?.label} Before`"
        />
        <q-item>
          <q-item-section>
            <q-item-label caption> Created </q-item-label>
            <q-item-label>
              {{ createdDate }}
              <span class="text-italic">by</span>
              {{ event?.createdUserName }}
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label caption> Last Modified </q-item-label>
            <q-item-label>
              {{ lastModifiedDate }}
              <span class="text-italic">by</span>
              {{ event?.modifiedUserName }}
            </q-item-label>
          </q-item-section>
        </q-item>
        <OCItem
          v-if="event?.parent?.value?.id"
          title="Regarding"
          :value="projectServiceItem"
        />
      </q-list>
    </q-page-container>
  </q-layout>

  <ConfirmationDialog
    v-if="showConfirmationDialog"
    :showConfirmationDialog="showConfirmationDialog"
    :title="title"
    :message="message"
    @cancel="cancelConfirmation"
    @confirm="confirmDeletion"
  />
</template>
