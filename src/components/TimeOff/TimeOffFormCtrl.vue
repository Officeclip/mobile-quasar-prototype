<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import { useTimeOffStore } from '../../stores/timeOff/timeOffStore';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const props = defineProps(['timeOff']);
const timeOffData = ref(props.timeOff);
const $q = useQuasar();
const router = useRouter();

const timeOffStore = useTimeOffStore();
const timeOffCategoryLists = computed(() => timeOffStore.TimeOffLists);

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
      <q-card-section>
        <q-list>
          <q-item>
            <q-item-section>
              <q-input
                v-model="timeOffData.createdBy"
                label="Employee Name"
                required
              /> </q-item-section
          ></q-item>

          <q-item>
            <q-item-section>
              <q-select
                label="Category"
                v-model="timeOffData.payrollSid"
                :options="timeOffCategoryLists"
                :rules="[isDateValid]"
                hide-bottom-space
                ref="dateRef"
                option-label="name"
                option-value="id"
                emit-value
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
          <q-item>
            <q-item-section>
              <q-input
                v-model="timeOffData.status"
                label="Status"
                required
              /> </q-item-section
          ></q-item>
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
