<!--
  FIXME: sg: icons should be bigger, row spacing should be more, screen doesn't dance on hover [30]
  FIXME: sg: organization drop down should work [30]
 -->

<script setup lang="ts">
import { ref, onBeforeMount, computed } from 'vue';
import { useHomeIconsStore } from 'stores/HomeIconStore';
import { useRouter } from 'vue-router';
//import { HomeIcon } from '../models/homeIcon';

const router = useRouter();
const homeIconStore = useHomeIconsStore();

//const homeIcons = ref<HomeIcon[]>([]);
//const organizationItems = ref<string[]>([]);
const model = ref(null);

const homeIcons = computed(() => {
  return homeIconStore.HomeIcons;
});

const organizationItems = computed(() => {
  return homeIconStore.OrganizationItems;
});

onBeforeMount(() => {
  // See: https://github.com/vuejs/pinia/discussions/1078#discussioncomment-4240994
  homeIconStore.getHomeIcons();
  //homeIcons.value = homeIconStore.HomeIcons;
  //organizationItems.value = homeIconStore.OrganizationItems;
});

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function getColor(url: string) {
  return url !== '' ? 'primary' : 'dark';
}

function getClass(url: string) {
  return url !== '' ? 'pointer' : '';
}

function goToApp(url: string) {
  if (url !== '') {
    router.push({ path: url });
  }
}
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="toggleLeftDrawer"
          aria-label="Menu"
          icon="menu"
        />
        <q-toolbar-title> OfficeClip Suite </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <!-- see: https://forum.quasar-framework.org/topic/2911/width-attribute-on-q-layout-drawer-giving-error-in-browser-console/3 -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-2"
      :width="240"
    >
      <q-list>
        <q-item-label header>Test Links</q-item-label>
        <q-item clickable to="/simpleCalendar">
          <q-item-section avatar>
            <q-icon name="calendar_today" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Simple Calendar</q-item-label>
            <q-item-label caption>calendar using q-date</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <q-page>
        <div class="q-pa-lg text-center">
          <q-select
            outlined
            v-model="model"
            :options="organizationItems"
            label="Select Organization"
          />
        </div>
        <div>
          <div class="row">
            <div
              class="col-4 q-pa-xl text-center itemsCenter"
              v-for="item in homeIcons"
              :key="item.name"
              style="height: 150px"
            >
              <div>
                <q-icon
                  size="lg"
                  :color="getColor(item.url)"
                  :class="getClass(item.url)"
                  :name="item.icon"
                  @click="goToApp(item.url)"
                ></q-icon>
                <div>{{ item.name }}</div>
              </div>
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.pointer:hover {
  cursor: pointer;
  padding: 4px;
  border-radius: 50px;
  background-color: rgb(201, 201, 185);
  border: 1px solid rgb(24, 22, 22);
}

.itemsCenter {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
