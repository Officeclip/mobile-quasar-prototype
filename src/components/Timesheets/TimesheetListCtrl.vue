<script setup lang="ts">
import { useTimesheetsStore } from '../../stores/TimesheetsStore';
import dateTimeHelper from '../../helpers/dateTimeHelper';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const id = ref<string | string[]>('0');
const status = ref<string  | string[]>('')
const timesheetsStore = useTimesheetsStore();

onMounted(() => {
  const route = useRoute();
  console.log('id=', route.params.id);
  console.log('status=', route.params.status)
  id.value = route.params.id;
  status.value = route.params.status
  timesheetsStore.getTimesheetsByStatus(String(route.params.status));
});

const getTimesheets = computed(() => {
  return timesheetsStore.Timesheets;
});

</script>
<template>
  <q-list v-for="timesheet in getTimesheets" :key="timesheet.id">
    <q-item
      :to="{
        name: 'timesheetDetails',
        params: {
          id: timesheet.id,
        },
      }"
      clickable
      v-ripple
    >
      <q-item-section>
        <q-item-label>
          {{ timesheet.createdByUserName }}
        </q-item-label>
        <q-item-label caption>{{ timesheet.fromDate
        ? dateTimeHelper.extractMonthFromUtc(timesheet.fromDate)
        : 'NoData msg' }} - {{ timesheet.totalHours }}</q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-icon color="primary" name="chevron_right" />
      </q-item-section>
    </q-item>
    <q-separator></q-separator>
  </q-list>
</template>

<style scoped>
.q-router-link--active {
  color: black
}

.q-list:nth-child(odd) {
  background: rgb(238, 238, 238)
}
</style>
