<!-- eslint-disable vue/no-side-effects-in-computed-properties -->
<script lang="ts" setup>
import { onMounted, ref, computed, watch } from 'vue';
import { useTimeOffStore } from '../../stores/timeOff/timeOffStore';
import { useTimeOffgroupProfile } from 'src/stores/timeOff/timeOffGroupProfile';
import { useQuasar, QInput } from 'quasar';
import { useRouter } from 'vue-router';

const props = defineProps(['timeOff']);
const timeOffData = ref(props.timeOff);
const $q = useQuasar();
const showDatePicker = ref(false);
const datePickerTarget = ref<'startDate' | 'endDate' | 'datesRequested' | null>(
  null,
);

const openDatePicker = (
  target: 'startDate' | 'endDate' | 'datesRequested',
) => {
  datePickerTarget.value = target;
  showDatePicker.value = true;
};

const datePickerModel = computed({
  get: () => {
    if (datePickerTarget.value) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return timeOffData.value[datePickerTarget.value];
    }
    return null;
  },
  set: (value) => {
    if (datePickerTarget.value) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      timeOffData.value[datePickerTarget.value] = value;
    }
  },
});
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
      } catch (error: any) {
        $q.dialog({
          title: 'Alert',
          message: error,
        }).onOk(async () => {
          await router.push({ path: '/HomePage' });
        });
      }
    },
    { immediate: true },
  );
};
const getTimeOffGroupProfile = async () => {
  try {
    await timeOffgroupProfile.getTimeOffGroupProfile();
  } catch (error: any) {
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
  },
);

onMounted(async () => {
  await loadTimeOffLists();
  await getTimeOffGroupProfile();
  if (timeOffData.value?.startDate === timeOffData.value?.endDate) {
    calculateNumberOfDays(); // Call the function to set the initial number of days
  }
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
      disable: category.balance <= 0,
    };
  });
});

const calculateNumberOfDays = () => {
  if (timeOffData.value.requestedFor === 'full_day') {
    if (profileData.value.mode === 'specificDates') {
      const dates = timeOffData.value.datesRequested.map(
        (date: any) => new Date(date),
      );
      const uniqueDates = [
        ...new Set(dates.map((date: any) => date.toDateString())),
      ];
      timeOffData.value.totalDays = uniqueDates.length;
    } else {
      const startDate = new Date(timeOffData.value.startDate);
      const endDate = new Date(timeOffData.value.endDate);
      const timeDiff = endDate - startDate;
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1; // Including both start and end dates
      timeOffData.value.totalDays = daysDiff;
    }
  } else {
    return (timeOffData.value.totalDays = 0);
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
  },
);
const totalHours = computed({
  get: () => {
    if (timeOffData.value.requestedFor === 'full_day') {
      calculateNumberOfDays();
      const totalDays = timeOffData.value.totalDays;
      return (timeOffData.value.totalHours = totalDays * 8);
    }
    if (timeOffData.value.requestedFor === 'half_day') {
      timeOffData.value.endDate = timeOffData.value.startDate; // Set end date to start date for half day
      timeOffData.value.datesRequested = [];
      return (timeOffData.value.totalHours = 4);
    } else if (timeOffData.value.requestedFor === 'hourly') {
      timeOffData.value.endDate = timeOffData.value.startDate; // Set end date to start date for hourly
      timeOffData.value.datesRequested = [];
      return timeOffData.value.totalHours; // Allow user-modified value to persist
    }
    return timeOffData.value.totalHours;
  },
  set: (value) => {
    timeOffData.value.totalHours = value;
  },
});

const formattedDates = computed(() => {
  if (Array.isArray(timeOffData.value.datesRequested)) {
    return timeOffData.value.datesRequested.join(', ');
  }
  return timeOffData.value.datesRequested;
});

const readonly = computed(() => {
  return (
    timeOffData.value.requestedFor === 'full_day' ||
    timeOffData.value.requestedFor === 'half_day'
  );
});

const reasonRef = ref<QInput>(); // from: https://stackoverflow.com/a/65106524
const startDateRef = ref<QInput>();
const endDateRef = ref<QInput>();
const categoryRef = ref<QInput>();
const hoursRef = ref<QInput>();

const ruleNotEmpty = (val: string) => {
  const condition = val && val.length > 0;
  return condition ? true : 'This field is required';
};

const hoursNotEmpty = (val: number) => {
  const condition = val > 0;
  return condition ? true : 'This field is required';
};

const ruleEndDateGreaterThanStartDate = (val: string) => {
  if (!timeOffData.value.startDate || timeOffData.value.startDate.length === 0)
    return true;
  const startDate = new Date(timeOffData.value.startDate);
  const endDate = new Date(val);
  return endDate >= startDate
    ? true
    : 'End Date should be more than or equal to Start Date';
};

const isCategoryValid = () => {
  const condition = timeOffData.value.payroll.name != '';
  return condition ? true : 'Please select category';
};

const validateAll = () => {
  reasonRef.value?.validate();
  startDateRef.value?.validate();
  endDateRef.value?.validate();
  categoryRef.value?.validate();
  hoursRef.value?.validate();

  if (
    reasonRef.value?.hasError ||
    startDateRef.value?.hasError ||
    endDateRef.value?.hasError ||
    categoryRef.value?.hasError ||
    hoursRef.value?.hasError
  ) {
    return false;
  } else {
    return true;
  }
};

defineExpose({
  validateAll,
});
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
          <div class="q-pa-sm">
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
            label="Category*"
            v-model="payrollName"
            :rules="[isCategoryValid]"
            :options="timeOffCategoryLists"
            hide-bottom-space
            ref="categoryRef"
            option-label="name"
            option-value="id"
            map-options
            option-disable="disable"
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
          <q-input :model-value="formattedDates" label="Request Dates" readonly>
            <template v-slot:append>
              <q-icon
                name="event"
                class="cursor-pointer"
                @click="openDatePicker('datesRequested')"
              />
            </template>
          </q-input>
        </q-item-section>
      </q-item>

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
            label="Start Date*"
            readonly
            required
            :rules="[ruleNotEmpty]"
            ref="startDateRef"
          >
            <template v-slot:append>
              <q-icon
                name="event"
                class="cursor-pointer"
                @click="openDatePicker('startDate')"
              />
            </template>
          </q-input>
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
            label="End Date*"
            :rules="[ruleNotEmpty, ruleEndDateGreaterThanStartDate]"
            readonly
            required
            ref="endDateRef"
          >
            <template v-slot:append>
              <q-icon
                name="event"
                class="cursor-pointer"
                @click="openDatePicker('endDate')"
              />
            </template>
          </q-input>
        </q-item-section>
      </q-item>
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
            readonly
            required
          >
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-time v-model="timeOffData.startTime" mask="h:mm A">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-item-section>
      </q-item>
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
            readonly
          /> </q-item-section
      ></q-item>
      <q-item v-else>
        <q-item-section>
          <q-input
            v-model="totalHours"
            label="Hours*"
            required
            type="number"
            :readonly="readonly"
            ref="hoursRef"
            :rules="[hoursNotEmpty]"
          /> </q-item-section
      ></q-item>

      <q-item>
        <q-item-section>
          <q-input
            ref="reasonRef"
            v-model="timeOffData.description"
            :rules="[ruleNotEmpty]"
            label="Reason*"
            required
          /> </q-item-section
      ></q-item>
    </q-list>
    <q-dialog v-model="showDatePicker">
      <q-date
        v-model="datePickerModel"
        :multiple="datePickerTarget === 'datesRequested'"
        mask="YYYY-MM-DD"
        ><div class="row items-center justify-end">
          <q-btn v-close-popup color="primary" flat label="Close" /></div
      ></q-date>
    </q-dialog>
  </q-page>
</template>
