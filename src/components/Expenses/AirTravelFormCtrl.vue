<script setup>
import { defineProps, ref } from 'vue';

const props = defineProps(['airTravel']);

const dense = ref(false);
</script>

<template>
  <div>
    <div class="q-pa-md">
      <!-- <div class="q-gutter-y-md column">
        <q-input v-model="props.airTravel.departureAirport" label="Departure Airport *"
          placeholder="enter departure airport name" :dense="dense" lazy-rules :rules="[
            (val) => (val && val.length > 0) || 'enter departure airport name',
          ]">
        </q-input>
        <q-input v-model="airTravel.arrivalAirport" label="Arrival Airport *" placeholder="enter arrival airport name"
          :dense="dense" lazy-rules :rules="[
            (val) => (val && val.length > 0) || 'enter arrival airport name',
          ]">
        </q-input>
        <q-input name="departureDate" v-model="formattedDueDate2" label="Departure Date" :rules="[
          (val) => (val && val.length > 0) || 'please select departure date',
        ]">
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="dueDate" mask='YYYY-MM-DD'>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-input name="arrivalDate" v-model="formattedDueDate2" label="Arrival Date" :rules="[
          (val) => (val && val.length > 0) || 'please select arival date',
        ]">
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="dueDate" mask='YYYY-MM-DD'>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div> -->
      <q-list>
        <q-item-label>Testing</q-item-label>
      </q-list>
    </div>
  </div>
</template>
