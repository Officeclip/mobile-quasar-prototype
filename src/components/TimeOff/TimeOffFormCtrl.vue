<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import { useTimeOffStore } from '../../stores/timeOff/timeOffStore';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const props = defineProps(['timeOff']);
const timeOffData = ref(props.timeOff);
const $q = useQuasar();
// const statusName = computed({
//   get: () => (timeOffData.value.status ? timeOffData.value.status.name : ''),
//   set: (value) => {
//     if (timeOffData.value.status) {
//       timeOffData.value.status.id = value;
//     }
//   },
// });
const payrollName = computed({
  get: () => (timeOffData.value.payroll ? timeOffData.value.payroll.id : ''),
  set: (value) => {
    if (timeOffData.value.payroll) {
      timeOffData.value.payroll.id = value.id;
      timeOffData.value.payroll.name = value.name;
    }
  },
});
const router = useRouter();

const timeOffStore = useTimeOffStore();
const timeOffCategoryLists = computed(() => timeOffStore.CategoryLists);

const loadTimeOffLists = async () => {
  try {
    await timeOffStore.getTimeOffLists();
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
});
</script>

<template>
  <q-page class="q-pa-md">
    <q-card>
      <!-- <pre>{{ timeOffData }}</pre> -->
      <q-card-section>
        <q-list>
          <q-item>
            <q-item-section>
              <q-input
                v-model="timeOffData.createdByUserName"
                label="Employee Name"
                required
              /> </q-item-section
          ></q-item>

          <q-item>
            <q-item-section>
              <!-- <pre>PP{{ timeOffCategoryLists }}</pre> -->
              <q-select
                label="Category"
                v-model="payrollName"
                :options="timeOffCategoryLists"
                :rules="[isDateValid]"
                hide-bottom-space
                ref="dateRef"
                option-label="name"
                option-value="id"
                map-options
              />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-input
                v-model="timeOffData.totalHours"
                label="Hours Requested"
                required
              /> </q-item-section
          ></q-item>
          <!-- <q-item>
            <q-item-section>
              <q-input
                v-model="statusName"
                label="Status"
                required
              /> </q-item-section
          ></q-item> -->
          <q-item>
            <q-item-section>
              <q-input
                v-model="timeOffData.startDate"
                label="Start Date"
                type="date"
                required
              />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-input
                v-model="timeOffData.endDate"
                label="End Date"
                type="date"
                required
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
      </q-card-section>
    </q-card>
  </q-page>
</template>
