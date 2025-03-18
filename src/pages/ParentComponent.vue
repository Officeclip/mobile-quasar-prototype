<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>Sample Data </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page>
        <q-btn @click="toggleList">{{
          showList ? 'Hide List' : 'Show List'
        }}</q-btn>

        <q-card v-if="showList">
          <q-card-section>
            <q-list bordered>
              <q-item v-for="(item, index) in itemList" :key="index">
                <q-item-section>{{ item }}</q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue';

const showList = ref(false);
const itemList = ref(['Item 1', 'Item 2', 'Item 3']);

const toggleList = () => {
  showList.value = !showList.value;
};
</script>
