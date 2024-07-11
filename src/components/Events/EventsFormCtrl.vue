<!-- eslint-disable vue/no-mutating-props -->
<!-- eslint-disable vue/no-setup-props-destructure -->
<script lang="ts" setup>
import { computed, onMounted, ref, Ref, watch } from 'vue';
import EventsRecurrenceDialog from 'components/Events/EventsRecurrenceDialog.vue';
import EventsReminderDialog from 'components/Events/EventsReminderDialog.vue';
import { useEventDetailsStore } from 'stores/event/eventDetailsStore';
import { useEventListsStore } from 'stores/event/eventListsStore';
import { useReminderDataStore } from 'stores/reminder/reminderData';
import dateTimeHelper from '../../helpers/dateTimeHelper';
import { userSummary } from 'src/models/userSummary';
import { useUserSummaryStore } from 'stores/userSummaryStore';
import Regarding from '../general/regardingComponent.vue';
import { useSessionStore } from 'src/stores/SessionStore';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const $q = useQuasar();
const router = useRouter();
const eventDetailsStore = useEventDetailsStore();
const eventListsStore = useEventListsStore();
const reminderDataStore = useReminderDataStore();
const userSummaryStore = useUserSummaryStore();
const sessionStore = useSessionStore();

const session = sessionStore.Session;

// eslint-disable-next-line vue/no-dupe-keys
const props = defineProps(['event']);
const emit = defineEmits([
  'rrule-generated',
  'reminder-generated',
  'rrule-text-generated',
]);

const startDateTime = props.event.startDateTime;
const endDateTime = props.event.endDateTime;

const startDateModelValue = ref();
startDateModelValue.value = dateTimeHelper.extractDateandTimeFromUtc(
  startDateTime,
  props.event.isAllDayEvent
);

const endDateModelValue = ref();
endDateModelValue.value = dateTimeHelper.extractDateandTimeFromUtc(
  endDateTime,
  props.event?.isAllDayEvent
);

let isAllDay = props.event.isAllDayEvent;

watch(props.event, () => {
  if (isAllDay !== props.event.isAllDayEvent) {
    startDateModelValue.value = dateTimeHelper.extractDateandTimeFromUtc(
      startDateTime,
      props.event.isAllDayEvent
    );
    endDateModelValue.value = dateTimeHelper.extractDateandTimeFromUtc(
      endDateTime,
      props.event?.isAllDayEvent
    );
    isAllDay = props.event.isAllDayEvent;
  }
});

watch(
  [startDateModelValue, endDateModelValue],
  ([newStartDateModelValue, newEndtDateModelValue]) => {
    // props.event.startDateTime = new Date(newStartDateModelValue).toISOString();
    // props.event.endDateTime = new Date(newEndtDateModelValue).toISOString();
    // console.log('props.event.startDateTime ZZZZZ', props.event.startDateTime);
    props.event.startDateTime = new Date(newStartDateModelValue);
    props.event.endDateTime = new Date(newEndtDateModelValue);
  }
);

const dateTimeMask = 'ddd, MMM D, YYYY hh:mm A';
const dateMask = 'ddd, MMM D, YYYY';
const mask = (x: boolean) => {
  return x ? dateMask : dateTimeMask;
};
onMounted(async () => {
  try {
    await userSummaryStore.getUserSummaries();
    await eventListsStore.getEventLists();
    await reminderDataStore.getReminderObject();
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      await router.push({ path: '/eventSummary' });
    });
  }
});

const meetingAttendee = computed(() => {
  return eventDetailsStore.MeetingAttendees;
});
const label = computed(() => {
  return eventListsStore.Labels;
});

const ShowMyTimeAsOptions = computed(() => {
  return eventListsStore.ShowMyTimeAs;
});

// Find the selected reminder option and time based on refs
const selectedOption = computed(() => {
  const reminderOptions = reminderDataStore.ReminderOptions;
  const obj = reminderOptions.find(
    (option: any) => option.value === props.event.reminder.to
  );
  return obj ? obj : 'null';
});

const selectedTime = computed(() => {
  const reminderTimes = reminderDataStore.ReminderTimes;
  const obj = reminderTimes.find(
    (time: any) => time.value === props.event.reminder.beforeMinutes
  );
  return obj ? obj : 'null';
});

const reminderTextInfo = props.event?.reminder.to
  ? ref(
      computed(() => {
        return `${selectedOption.value.label} ${selectedTime.value.label} before`;
      })
    )
  : ref('Reminder');

const reminderDialogOpened = ref(false);
const recurrenceDialogOpened = ref(false);
const repeatString = props.event?.recurrence.text
  ? ref(props.event?.recurrence.text)
  : ref('Does not repeat');

function handleRRuleString(rruleString: string) {
  // You can now use the rruleString in your parent component
  emit('rrule-generated', rruleString);
}

function handleRRuleText(rruleText: string) {
  const repeatText = rruleText.charAt(0).toUpperCase() + rruleText.slice(1); //capitalize first letter
  repeatString.value = repeatText;
  emit('rrule-text-generated', repeatText);
}

function handleReminderData(reminderString: []) {
  // You can now use the rruleString in your parent component
  emit('reminder-generated', reminderString);
}

function handleReminderText(reminderText: string) {
  //TODO: CR: 2024-05-17: nk: Fix the below error?
  reminderTextInfo.value = reminderText;
}

const labelOptions = label;
const filterOptions: Ref<userSummary[]> = ref([]);

function filterFn(val: string, update: any) {
  update(() => {
    const needle = val.toLowerCase();
    filterOptions.value = userSummaryStore.userSummaries.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  });
}

function createValue(val: string, done: any) {
  // create a new id value to add the id property for the new input string from user
  const id: number = Math.round(Math.random() * 100);
  // Add the new item to the meetingAttendee array.
  //TODO: CR: 2024-05-17: nk: Fix the below error?
  if (val.length > 0) {
    if (!meetingAttendee.value.includes(val)) {
      meetingAttendee.value.push({
        id: id,
        eventId: -1,
        email: val,
        name: '',
      }); // push the new item as an object into the list
    }
    done({ id: id, email: val }, 'toggle'); // added the new input as an new item into the dropdown
  }
}

if (props.event.eventType == '2') {
  props.event.meetingAttendees = [
    {
      id: session.userId,
      name: session.userName,
      email: session.userEmail,
    },
  ];
}

const testUrl = () => {
  const url = props.event.url;
  if (!url) {
    alert('URL cannot be empty');
  } else if (isValidURL(url)) {
    window.open('http://' + url, '_blank');
  } else {
    alert('Invalid URL');
  }
};

function isValidURL(url: string) {
  const pattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  return pattern.test(url);
}
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <div>
    <q-list>
      <q-item>
        <q-item-section>
          <q-radio
            v-model="event.eventType"
            color="teal"
            keep-color
            label="Group"
            val="1"
            size="sm"
          />
        </q-item-section>
        <q-item-section>
          <q-radio
            v-model="event.eventType"
            color="red"
            keep-color
            label="Meeting"
            val="2"
            size="sm"
          />
        </q-item-section>
        <q-item-section>
          <q-radio
            v-model="event.eventType"
            color="cyan"
            keep-color
            label="Personal"
            val="3"
            size="sm"
          />
        </q-item-section>
      </q-item>

      <q-item v-if="event.eventType == '1'" class="column">
        <q-checkbox
          v-model="event.sendNotifications"
          label="Send notifications to the group?"
          color="teal"
          size="xs"
        />
        <q-checkbox
          v-model="event.isRsvp"
          label="Ask for RSVP's"
          color="orange"
          size="xs"
        />
      </q-item>
      <q-item>
        <q-input
          v-model="event.eventName"
          :rules="[(val: string | any[]) => (val && val.length > 0) || 'Please type something']"
          class="full-width"
          label="Event Name*"
          lazy-rules
          placeholder="enter event name"
        />
      </q-item>
      <pre>event.isAllDayEvent::{{ event.isAllDayEvent }}</pre>
      <pre>startDateModelValue::{{ startDateModelValue }}</pre>
      <pre>mask::{{ mask(event.isAllDayEvent) }}</pre>
      <q-item>
        <q-toggle
          v-model="event.isAllDayEvent"
          :false-value="false"
          :true-value="true"
          color="primary"
          dense
          keep-color
          label="All Day Event"
          left-label
        />
      </q-item>

      <q-item class="column">
        <q-input v-model="startDateModelValue" label="Starts*">
          <template v-slot:prepend>
            <q-icon class="cursor-pointer" name="event">
              <q-popup-proxy
                cover
                transition-hide="scale"
                transition-show="scale"
              >
                <q-date
                  v-model="startDateModelValue"
                  :mask="mask(event.isAllDayEvent)"
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup color="primary" flat label="Close" />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

          <template v-if="!event.isAllDayEvent" v-slot:append>
            <q-icon class="cursor-pointer" name="access_time">
              <q-popup-proxy
                cover
                transition-hide="scale"
                transition-show="scale"
              >
                <q-time
                  v-model="startDateModelValue"
                  :mask="mask(event.isAllDayEvent)"
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup color="primary" flat label="Close" />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-item>

      <q-item class="column">
        <q-input v-model="endDateModelValue" label="Ends*">
          <template v-slot:prepend>
            <q-icon class="cursor-pointer" name="event">
              <q-popup-proxy
                cover
                transition-hide="scale"
                transition-show="scale"
              >
                <q-date
                  v-model="endDateModelValue"
                  :mask="mask(event.isAllDayEvent)"
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup color="primary" flat label="Close" />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

          <template v-if="!event.isAllDayEvent" v-slot:append>
            <q-icon class="cursor-pointer" name="access_time">
              <q-popup-proxy
                cover
                transition-hide="scale"
                transition-show="scale"
              >
                <q-time
                  v-model="endDateModelValue"
                  :mask="mask(event.isAllDayEvent)"
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup color="primary" flat label="Close" />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-item>
      <q-item>
        <q-input
          v-model="event.eventDescription"
          autogrow
          class="full-width"
          dense
          label="Notes"
          placeholder="enter event description"
        />
      </q-item>
      <q-item>
        <q-input
          v-model="event.eventLocation"
          class="full-width"
          dense
          label="Location"
          placeholder="enter where the event will take place"
        >
        </q-input>
      </q-item>
      <q-item v-ripple clickable @click="recurrenceDialogOpened = true">
        <q-item-section avatar>
          <q-icon color="primary" name="repeat" size="sm" />
        </q-item-section>
        <q-item-section> {{ repeatString }}</q-item-section>
        <q-item-section side>
          <q-icon color="primary" name="chevron_right" />
        </q-item-section>
      </q-item>
      <q-item v-if="event.eventType == '2'">
        <q-select
          v-model="event.meetingAttendees"
          :options="filterOptions"
          class="full-width"
          input-debounce="0"
          label="Attendees"
          multiple
          option-label="email"
          option-value="id"
          style="min-width: 250px"
          use-chips
          use-input
          @filter="filterFn"
          @new-value="createValue"
        ></q-select>
      </q-item>
      <q-item v-ripple clickable @click="reminderDialogOpened = true">
        <q-item-section avatar>
          <q-icon color="primary" name="alarm" size="sm" />
        </q-item-section>
        <q-item-section>{{ reminderTextInfo }}</q-item-section>
        <q-item-section side>
          <q-icon color="primary" name="chevron_right" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-input
          v-model="event.url"
          class="full-width"
          dense
          label="Url"
          map-options
        >
          <template v-slot:append>
            <q-btn
              color="primary"
              dense
              flat
              label="Test URL"
              no-caps
              @click="testUrl"
            />
          </template>
        </q-input>
      </q-item>
      <q-item>
        <q-item-section class="q-pr-xl">
          <q-select
            filled
            v-model="event.showTimeAs"
            :options="ShowMyTimeAsOptions"
            label="Show Time As"
            emit-value
            map-options
            option-label="name"
            option-value="id"
          >
            <template #option="scope">
              <q-item
                class="q-my-xs"
                v-bind="scope.itemProps"
                v-bind:style="{ backgroundColor: scope.opt.color }"
              >
                {{ scope.opt.name }}
              </q-item>
            </template>
            <template #selected-item="scope">
              <q-item
                dense
                class="q-selectedItem"
                v-bind:style="{
                  backgroundColor: scope.opt.color,
                }"
              >
                {{ scope.opt.name }}
              </q-item>
            </template>
          </q-select>
        </q-item-section>
        <q-item-section>
          <q-select
            filled
            v-model="event.label"
            :options="labelOptions"
            emit-value
            label="Label"
            map-options
            option-label="name"
            option-value="id"
          >
            <template #option="scope">
              <q-item
                dense
                class="q-my-xs"
                v-bind="scope.itemProps"
                v-bind:style="{ backgroundColor: scope.opt.color }"
              >
                {{ scope.opt.name }}
              </q-item>
            </template>
            <template #selected-item="scope">
              <q-item
                dense
                class="q-selectedItem"
                v-bind:style="{
                  backgroundColor: scope.opt.color,
                }"
              >
                {{ scope.opt.name }}
              </q-item>
            </template>
          </q-select>
        </q-item-section>
      </q-item>
      <q-item>
        <Regarding
          v-model="event.parent"
          :regarding-parents="eventListsStore.RegardingParent"
        />
      </q-item>
    </q-list>

    <q-dialog v-model="recurrenceDialogOpened">
      <EventsRecurrenceDialog
        @rrule-string-generated="handleRRuleString"
        @rrule-text-generated="handleRRuleText"
      />
    </q-dialog>
    <q-dialog v-model="reminderDialogOpened">
      <EventsReminderDialog
        @reminder-text-generated="handleReminderText"
        @reminder-data-generated="handleReminderData"
      />
    </q-dialog>
  </div>
</template>

<style scoped>
.q-selectedItem {
  width: inherit;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
}
</style>
