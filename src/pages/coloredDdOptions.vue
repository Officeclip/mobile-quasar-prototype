<script setup>
import { ref } from 'vue';

const selectedDates = ref([]);
const showDatePicker = ref(false);
</script>

<template>
  <q-layout>
    <q-page-container>
      <q-page class="q-pa-md">
        <q-card>
          <q-card-section>
            <div class="text-h6">Select Multiple Dates</div>
          </q-card-section>
          <pre>{{ selectedDates }}</pre>
          <q-card-section>
            <q-input v-model="selectedDates" label="Selected Dates" readonly>
              <template v-slot:append>
                <q-icon
                  name="event"
                  class="cursor-pointer"
                  @click="showDatePicker = true"
                />
              </template>
            </q-input>
          </q-card-section>

          <q-dialog v-model="showDatePicker">
            <q-date v-model="selectedDates" multiple
              ><div class="row items-center justify-end">
                <q-btn v-close-popup color="primary" flat label="Close" /></div
            ></q-date>
          </q-dialog>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped></style>
