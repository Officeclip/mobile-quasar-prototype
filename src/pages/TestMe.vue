<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// import drawer from '../components/drawer.vue';

const router = useRouter();
const myDrawer = ref();

const tab = ref('my-requests');
const myRequests = ref([
  {
    id: 1,
    title: 'Request 1',
    when: 'Jan 21, 2025 to Jan 21, 2025',
    hours: '8',
    status: 'Pending',
    description: 'Description for request 1',
  },
  {
    id: 2,
    title: 'Request 2',
    when: 'Jan 06, 2025 to Jan 07, 2025',
    hours: '16',
    status: 'Pending',
    description: 'Description for request 2',
  },
]);
const inbox = ref([
  { id: 1, title: 'Message 1', description: 'Description for message 1' },
  { id: 2, title: 'Message 2', description: 'Description for message 2' },
]);
const archived = ref([
  { id: 1, title: 'Archive 1', description: 'Description for archive 1' },
  { id: 2, title: 'Archive 2', description: 'Description for archive 2' },
]);

// function toggleLeftDrawer() {
//   if (myDrawer.value == null) return;
//   myDrawer.value.toggleLeftDrawer();
// }
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn flat round dense color="white" icon="arrow_back"> </q-btn>
        <q-toolbar-title>Time Off</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page>
        <q-tabs
          v-model="tab"
          indicator-color="teal"
          narrow-indicator
          no-caps
          align="justify"
          class="bg-pink-6 text-white text-h6"
        >
          <q-tab name="my-requests" label="My Requests" />
          <q-tab name="inbox" label="Inbox" />
          <q-tab name="archived" label="Archived" />
        </q-tabs>
        <pre>tab::{{ tab }}</pre>
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="my-requests">
            <div v-for="request in myRequests" :key="request.id">
              <q-list>
                <q-item class="q-my-md">
                  <q-item-section class="col-grow q-mr-lg">
                    <q-item-label class="text-h6">{{
                      request.title
                    }}</q-item-label>
                    <q-item-label>{{ request.when }}</q-item-label>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>
                      {{ request.hours }}
                      <span class="text-caption q-pl-xs">hrs</span>
                    </q-item-label>
                  </q-item-section>

                  <q-item-section style="align-items: end">
                    <q-chip dense>
                      <q-item-label caption class="q-px-sm">{{
                        request.status
                      }}</q-item-label>
                    </q-chip>
                  </q-item-section>
                  <q-item-section side>
                    <q-icon color="primary" name="chevron_right" />
                  </q-item-section>
                  <!-- <q-item-section class="col-12">
                    <q-item-label>{{ request.description }}</q-item-label>
                  </q-item-section> -->
                </q-item>
                <q-separator></q-separator>
              </q-list>
            </div>
          </q-tab-panel>

          <q-tab-panel name="inbox">
            <div v-for="message in inbox" :key="message.id" class="q-pa-sm">
              <q-card>
                <q-card-section>
                  <div class="text-h6">{{ message.title }}</div>
                  <div>{{ message.description }}</div>
                </q-card-section>
              </q-card>
            </div>
          </q-tab-panel>

          <q-tab-panel name="archived">
            <div v-for="archive in archived" :key="archive.id" class="q-pa-sm">
              <q-card>
                <q-card-section>
                  <div class="text-h6">{{ archive.title }}</div>
                  <div>{{ archive.description }}</div>
                </q-card-section>
              </q-card>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.q-pa-md {
  padding: 16px;
}
</style>
