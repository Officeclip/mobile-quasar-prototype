<!-- eslint-disable vue/no-side-effects-in-computed-properties -->
<script setup>
import { defineProps, onMounted, ref, computed, watch } from 'vue';
import { useTimeOffStore } from '../../stores/timeOff/timeOffStore';
import { useTimeOffgroupProfile } from 'src/stores/timeOff/timeOffGroupProfile';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const props = defineProps(['timeOff']);
const timeOffData = ref(props.timeOff);
const $q = useQuasar();
const showDatePicker = ref(false);
const showBalanceInfo = ref(true); // State to control the temporary message
const router = useRouter();
const userId = ref();

const timeOffStore = useTimeOffStore();
const timeOffgroupProfile = useTimeOffgroupProfile();

const payrollName = computed({
  get: () => (timeOffData.value.payroll ? timeOffData.value.payroll.id : ''),
  set: (value) => {
    if (timeOffData.value.payroll) {
      timeOffData.value.payroll.id = value.id;
      timeOffData.value.payroll.name = value.name;
    }
  },
});

const loadTimeOffLists = async () => {
  watch(
    () => props.timeOff,
    (newTimeOff) => {
      userId.value = newTimeOff?.createdUserSid;
      try {
        timeOffStore.getTimeOffLists(userId.value);
      } catch (error) {
        $q.dialog({
          title: 'Alert',
          message: error,
        }).onOk(async () => {
          await router.push({ path: '/HomePage' });
        });
      }
    },
    { immediate: true }
  );
  // try {
  //   await timeOffStore.getTimeOffLists(userId.value);
  // } catch (error) {
  //   $q.dialog({
  //     title: 'Alert',
  //     message: error,
  //   }).onOk(async () => {
  //     await router.push({ path: '/HomePage' });
  //   });
  // }
};
const getTimeOffGroupProfile = async () => {
  try {
    await timeOffgroupProfile.getTimeOffGroupProfile();
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error,
    }).onOk(async () => {
      await router.push({ path: '/HomePage' });
    });
  }
};

watch(
  () => props.timeOff,
  (newTimeOff) => {
    timeOffData.value = newTimeOff;
  }
);

onMounted(async () => {
  await loadTimeOffLists();
  await getTimeOffGroupProfile();
  if (timeOffData.value?.startDate === timeOffData.value?.endDate) {
    calculateNumberOfDays(); // Call the function to set the initial number of days
  }
  // Hide the balance information after a few seconds
  setTimeout(() => {
    showBalanceInfo.value = false;
  }, 3000);
});
const requestForOptions = [
  { label: 'Full Day (8h)', value: 'full_day' },
  { label: 'Half Day (4h)', value: 'half_day' },
  { label: 'Hourly', value: 'hourly' },
];

const profileData = computed(() => {
  return timeOffgroupProfile?.TimeOffgroupProfile;
});
const timeOffCategoryLists = computed(() => {
  return timeOffStore.CategoryLists.map((category) => {
    return {
      ...category,
      name: `${category.name} (${category.balance} ${category.balanceType})`,
    };
  });
});

const calculateNumberOfDays = () => {
  if (
    timeOffData.value.datesRequested &&
    timeOffData.value.datesRequested.length > 0
  ) {
    const dates = timeOffData.value.datesRequested.map(
      (date) => new Date(date)
    );
    const uniqueDates = [...new Set(dates.map((date) => date.toDateString()))];
    timeOffData.value.totalDays = uniqueDates.length;
  } else if (
    timeOffData.value.startDate &&
    timeOffData.value.endDate &&
    profileData.value.mode === 'continuousDates'
  ) {
    const startDate = new Date(timeOffData.value.startDate);
    const endDate = new Date(timeOffData.value.endDate);
    const timeDiff = endDate - startDate;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1; // Including both start and end dates
    timeOffData.value.totalDays = daysDiff;
  } else {
    // timeOffData.value.totalDays = 8;
    return;
  }
};

watch(
  () => [
    timeOffData.value.datesRequested,
    timeOffData.value.startDate,
    timeOffData.value.endDate,
  ],
  () => {
    calculateNumberOfDays();
  }
);
const totalHours = computed({
  get: () => {
    if (timeOffData.value.requestedFor === 'full_day') {
      const totalDays = timeOffData.value.totalDays;
      return (timeOffData.value.totalHours = totalDays * 8);
      // return (timeOffData.value.totalHours = 8);
    }
    if (timeOffData.value.requestedFor === 'half_day') {
      return (timeOffData.value.totalHours = 4);
    }
    return timeOffData.value.totalHours;
  },
  set: (value) => {
    timeOffData.value.totalHours = value;
  },
});

const onClick = () => {
  showBalanceInfo.value = true;
};
</script>

<template>
  <q-page class="q-pa-md">
    <!-- <pre>profileData:{{ profileData }}</pre>
    <pre>Request for:{{ timeOffData.requestedFor }}</pre> -->
    <!-- <pre>timeOffData::{{ timeOffData }}</pre> -->
    <!-- <pre>userId:: {{ userId }}</pre> -->
    <q-list>
      <q-item>
        <q-item-section>
          <div class="q-pa-sm rounded-borders bg-grey-3">
            Request For:
            <q-option-group
              v-model="timeOffData.requestedFor"
              :options="requestForOptions"
              type="radio"
              inline
              required
            />
          </div>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-select
            label="Category"
            v-model="payrollName"
            :options="timeOffCategoryLists"
            hide-bottom-space
            option-label="name"
            option-value="id"
            map-options
          />
        </q-item-section>
        <q-item-section side>
          <q-btn
            icon="info"
            flat
            color="primary"
            label="Balances"
            @click="showBalanceInfo = true"
          />
        </q-item-section>
      </q-item>

      <q-item
        v-if="
          profileData.mode === 'specificDates' &&
          timeOffData.requestedFor === 'full_day'
        "
      >
        <q-item-section>
          <q-input
            v-model="timeOffData.datesRequested"
            label="Request Dates"
            readonly
          >
            <template v-slot:append>
              <q-icon
                name="event"
                class="cursor-pointer"
                @click="showDatePicker = true"
              />
            </template>
          </q-input> </q-item-section
      ></q-item>

      <q-item
        v-if="
          profileData.mode !== 'specificDates' ||
          timeOffData.requestedFor === 'half_day' ||
          timeOffData.requestedFor === 'hourly'
        "
      >
        <q-item-section>
          <q-input
            v-model="timeOffData.startDate"
            label="Start Date"
            type="date"
            required
          />
        </q-item-section>
      </q-item>

      <q-item
        v-if="
          timeOffData.requestedFor === 'full_day' &&
          profileData.mode !== 'specificDates'
        "
      >
        <q-item-section>
          <q-input
            v-model="timeOffData.endDate"
            label="End Date"
            type="date"
            required
          /> </q-item-section
      ></q-item>
      <q-item
        v-if="
          timeOffData.requestedFor === 'half_day' ||
          timeOffData.requestedFor === 'hourly'
        "
      >
        <q-item-section>
          <q-input
            v-model="timeOffData.startTime"
            label="Start Time"
            type="time"
            required
          /> </q-item-section
      ></q-item>

      <q-item
        v-if="
          profileData.timeoffUnit === 'Days' &&
          timeOffData.requestedFor === 'full_day'
        "
      >
        <q-item-section>
          <q-input
            v-model="timeOffData.totalDays"
            label="# of Days"
            required
          /> </q-item-section
      ></q-item>
      <q-item v-else>
        <q-item-section>
          <q-input
            v-model="totalHours"
            label="Hours"
            required
            :readonly="timeOffData.requestedFor === 'half_day'"
          /> </q-item-section
      ></q-item>

      <q-item>
        <q-item-section>
          <q-input
            v-model="timeOffData.description"
            label="Reason"
            required
          /> </q-item-section
      ></q-item>
    </q-list>
    <q-dialog v-model="showDatePicker">
      <q-date v-model="timeOffData.datesRequested" multiple
        ><div class="row items-center justify-end">
          <q-btn v-close-popup color="primary" flat label="Close" /></div
      ></q-date>
    </q-dialog>
    <q-dialog v-model="showBalanceInfo">
      <q-card>
        <q-card-section>
          <div v-for="category in timeOffCategoryLists" :key="category.id">
            <q-item>
              <q-item-section>{{ category.name }}</q-item-section>
            </q-item>
            <q-separator
              inset
              v-if="
                category !==
                timeOffCategoryLists[timeOffCategoryLists.length - 1]
              "
            />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Close" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
