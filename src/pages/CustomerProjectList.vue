<script setup>
import { onMounted } from 'vue';
import { useTimesheetListStore } from '../stores/TimesheetListStore';


const name = 'CustomerProjects'
const timesheetListStore = useTimesheetListStore();

onMounted(() => {
timesheetListStore.getTimesheetsList(name)
})

const customers = timesheetListStore.TimesheetList;


</script>

<template>
  <q-layout>
    <q-page-container>
      <q-page>
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label v-for="item in customers" :key="item.id">
                  {{ item.name }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
