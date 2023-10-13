<!-- eslint-disable vue/no-mutating-props -->
<!-- eslint-disable vue/no-setup-props-destructure -->
<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import EventsRecurrenceDialog from 'components/Events/EventsRecurrenceDialog.vue';
import EventsReminderDialog from 'components/Events/EventsReminderDialog.vue';
import FilePicker from 'components/Events/FilePicker.vue';
import { useEventDetailsStore } from 'stores/event/eventDetailsStore';
import { useEventListsStore } from 'stores/event/eventListsStore';
import dateTimeHelper from '../../helpers/dateTimeHelper';
import RegardingAll from '../../components/general/RegardingAll.vue';

// eslint-disable-next-line vue/no-dupe-keys
const props = defineProps(['event']);
const emit = defineEmits([
  'rrule-generated',
  'reminder-generated',
  'rrule-text-generated',
]);

const startDateTime = ref(props.event.startDateTime);
const endDateTime = ref(props.event.endDateTime);
const startDate = ref('');
const startTime = ref('');
const endDate = ref('');
const endTime = ref('');
function extractDateAndTime(
  dateTimeValue: any,
  dateX = ref(''),
  timeX = ref('')
) {
  if (dateTimeValue) {
    const dateObj = new Date(dateTimeValue);
    dateX.value = dateObj.toISOString().split('T')[0]; // Extract startDate (YYYY-MM-DD)
    timeX.value = dateObj.toISOString().split('T')[1].split('.')[0]; // Extract startTime (HH:mm:ss)
  }
  return;
}
// Initial extraction
extractDateAndTime(startDateTime.value, startDate, startTime);
extractDateAndTime(endDateTime.value, endDate, endTime);
watch(
  [startDate, startTime, endDate, endTime],
  ([newStartDate, newStartTime, newEndDate, newEndTime]) => {
    const utcDateStart = new Date(`${newStartDate}T${newStartTime}Z`);
    const utcDateEnd = new Date(`${newEndDate}T${newEndTime}Z`);

    props.event.startDateTime = utcDateStart.toISOString();
    props.event.endDateTime = utcDateEnd.toISOString();
  }
);

const eventDetailsStore = useEventDetailsStore();
const eventListsStore = useEventListsStore();
onMounted(() => {
  eventDetailsStore.getAllMeetingAttendees();
  eventListsStore.getEventLists();
});
const meetingAttendee = computed(() => {
  return eventDetailsStore.MeetingAttendees;
});
const startsModelValue = computed(() => {
  return dateTimeHelper.extractDateandTimeFromUtc(
    props.event.startDateTime,
    props.event.isAllDayEvent
  );
});
const endsModelValue = computed(() => {
  return dateTimeHelper.extractDateandTimeFromUtc(
    props.event.endDateTime,
    props.event.isAllDayEvent
  );
});
const label = computed(() => {
  return eventListsStore.Labels;
});
const timeZone = computed(() => {
  return eventListsStore.TimeZones;
});
const ShowMyTimeAsOptions = computed(() => {
  return eventListsStore.ShowMyTimeAs;
});

const showTimeAs = ref('1');
// const repeatString = ref('Does not repeat');
const repeatString = props.event?.repeatInfoText
  ? ref(props.event?.repeatInfoText)
  : ref('Does not repeat');
// const reminderTextInfo = ref('Reminder');
const reminderTextInfo = props.event?.remindTo
  ? ref(
      `Remind ${props.event?.remindTo} ${props.event?.remindBeforeMinutes} before`
    )
  : ref('Reminder');

const recurrenceDialogOpened = ref(false);
const reminderDialogOpened = ref(false);

function handleRRuleString(rruleString: string) {
  // You can now use the rruleString in your parent component
  console.log('Received RRule String:', rruleString);
  emit('rrule-generated', rruleString);
}

function handleRRuleText(rruleText: string) {
  console.log('Received RRule Plain Text:', rruleText);
  const repeatText = rruleText.charAt(0).toUpperCase() + rruleText.slice(1); //capitalize first letter
  repeatString.value = repeatText;
  emit('rrule-text-generated', repeatText);
}

function handleReminderData(reminderString: []) {
  // You can now use the rruleString in your parent component
  console.log('Received Reminder String:', reminderString);
  emit('reminder-generated', reminderString);
}

function handleReminderText(reminderText: string) {
  console.log('Received reminder Plain Text:', reminderText);
  reminderTextInfo.value = reminderText;
}

const labelOptions = label;
const filterOptions = ref(meetingAttendee);

function filterFn(val: any, update: any) {
  // Filter the meetingAttendee array based on the search value.
  update(() => {
    if (val === '') {
      filterOptions.value = meetingAttendee;
    } else {
      const needle = val.toLowerCase();
      filterOptions.value = meetingAttendee.value.filter(
        (v: any) => v.name.toLowerCase().indexOf(needle) > -1
      );
    }
  });
}

function createValue(val: string, done: any) {
  // create a new id value to add the id property for the new input string from user
  const id: number = Math.round(Math.random() * 100);
  // Add the new item to the meetingAttendee array.
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
</script>

<template>
  <!-- FIXME: remove the warning -->
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
            label="Private"
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
          name="eventName"
          placeholder="enter event name"
        />
      </q-item>
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
          name="isAllDayEvent"
        />
      </q-item>
      <q-item class="column">
        <q-input
          v-model="startDate"
          :rules="[(val: any) => !!val || 'Start Date is required']"
          label="Starts*"
          name="startDateTime"
          :model-value="startsModelValue"
        >
          <template v-slot:prepend>
            <q-icon class="cursor-pointer" name="event">
              <q-popup-proxy
                cover
                transition-hide="scale"
                transition-show="scale"
              >
                <q-date v-model="startDate" mask="YYYY-MM-DD">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup color="primary" flat label="Close" />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

          <template v-if="!props.event.isAllDayEvent" v-slot:append>
            <q-icon class="cursor-pointer" name="access_time">
              <q-popup-proxy
                cover
                transition-hide="scale"
                transition-show="scale"
              >
                <q-time
                  v-if="!props.event.isAllDayEvent"
                  v-model="startTime"
                  mask="HH:mm"
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup color="primary" flat label="Close" />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-input
          v-model="endDate"
          :rules="[(val: any) => !!val || 'End Date is required']"
          label="Ends*"
          name="endDateTime"
          :model-value="endsModelValue"
        >
          <template v-slot:prepend>
            <q-icon class="cursor-pointer" name="event">
              <q-popup-proxy
                cover
                transition-hide="scale"
                transition-show="scale"
              >
                <q-date v-model="endDate" mask="YYYY-MM-DD">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup color="primary" flat label="Close" />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

          <template v-if="!props.event.isAllDayEvent" v-slot:append>
            <q-icon class="cursor-pointer" name="access_time">
              <q-popup-proxy
                cover
                transition-hide="scale"
                transition-show="scale"
              >
                <q-time v-model="endTime" mask="HH:mm">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup color="primary" flat label="Close" />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
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
      <q-item>
        <q-select
          v-model="event.timezoneId"
          :options="timeZone"
          class="full-width"
          emit-value
          label="Timezone"
          map-options
          name="timeZone"
          option-label="name"
          option-value="id"
        />
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
          v-model="event.eventLocation"
          class="full-width"
          dense
          label="Location"
          placeholder="enter where the event will take place"
        >
        </q-input>
      </q-item>
      <q-item>
        <q-input
          v-model="event.eventDescription"
          autogrow
          class="full-width"
          dense
          label="Notes"
          name="eventDescription"
          placeholder="enter event description"
        />
      </q-item>
      <q-item>
        <q-input
          v-model="event.url"
          class="full-width"
          dense
          label="Url"
          map-options
          name="Url"
        >
          <template v-slot:append>
            <q-btn color="primary" dense flat label="test url" no-caps />
          </template>
        </q-input>
      </q-item>
      <q-item>
        <q-item-section class="q-pr-xl">
          <!-- <pre>{{ showTimeAs }}</pre> -->
          <q-select
            filled
            v-model="showTimeAs"
            :options="ShowMyTimeAsOptions"
            label="Show Time As"
            name="Show time as"
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
            name="label"
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

      <!-- <q-item class="q-mt-md text-subtitle1">Regarding</q-item> -->
      <!-- <q-item class="q-mt-none">
        <q-item-section class="q-mr-sm">
          <q-select
            label="Regardings"
            v-model="event.parentServiceType"
            :options="metaTypeOptions"
            dense
            option-label="name"
            option-value="id"
            emit-value
            map-options
          />
        </q-item-section>
        <q-item-section class="q-mr-sm">
          <q-select
            v-model="selectedRegContact"
            :options="regardingContacts"
            dense
            multiple
            option-label="name"
            option-value="id"
            use-input
            @filter="filterContacts"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-item-section>
        <q-item-section side>
          <q-icon color="primary" name="switch_access_shortcut" />
        </q-item-section>
      </q-item> -->
      <!-- <pre>{{ event.attachments }}</pre> -->
      <div>
        <RegardingAll />
      </div>
      <q-item>
        <!-- <FilePicker @get-attachments-generated="handleAttachments" /> -->
        <FilePicker />
      </q-item>

      <!-- <q-item>
        <q-btn
          color="primary"
          dense
          flat
          label="Add Attachments"
          no-caps
          @click="filePickerDialogOpened = true"
        />
      </q-item> -->
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
    <!-- <q-dialog v-model="filePickerDialogOpened">
      <Attachments />
    </q-dialog> -->
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
