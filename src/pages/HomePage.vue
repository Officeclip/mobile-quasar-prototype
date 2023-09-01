<!--
  FIXME: sg: icons should be bigger, row spacing should be more, screen doesn't dance on hover [30]
  FIXME: sg: organization drop down should work [30]
 -->

<script lang="ts" setup>
import {ref, onBeforeMount, computed, ComputedRef} from 'vue';
import {useHomeIconsStore} from 'stores/HomeIconStore';
import {useRouter} from 'vue-router';
import {useSessionStore} from 'stores/SessionStore';
import { Session } from '../models/session';

const router = useRouter();
const homeIconStore = useHomeIconsStore();
const sessionStore = useSessionStore();
const userIcon = ref('');
const userName = ref('');
const userEmail = ref('');
//const homeIcons = ref<HomeIcon[]>([]);
//const organizationItems = ref<string[]>([]);
// const model = ref(null);

const model = ref('OfficeClip Work');

const homeIcons = computed(() => {
  return homeIconStore.HomeIcons;
});

const filteredHomeIcons = computed(() => {
  return homeIconStore.homeIcons.filter(item => {
    return session.value.applicationIds.includes(item.id);
  })
});

const session: ComputedRef<Session> = computed(() => {
  console.log("Sessions stores", sessionStore.Sessions[0]);
  return sessionStore.Sessions[0];
})

const organizationItems = computed(() => {
  return homeIconStore.OrganizationItems;
});

onBeforeMount(() => {
  // See: https://github.com/vuejs/pinia/discussions/1078#discussioncomment-4240994
  sessionStore.getSessions();
  homeIconStore.getHomeIcons();
  fetchUserIcon();
  fetchUserData();
  homeIconStore.getOrganizationItems();
  //homeIcons.value = homeIconStore.HomeIcons;
  //organizationItems.value = homeIconStore.OrganizationItems;
});

function getOrgApplications(){
  homeIconStore.getHomeIcons();
}

const leftDrawerOpen = ref(false);

function fetchUserIcon() {
  // Make an HTTP request to your API
  fetch("http://localhost:4000/generalUserProfile")
    .then((response) => response.json())
    .then((data) => {
      // Set the userIcon data from the API response
      userIcon.value = data[0].userIcon;
      console.log(userIcon.value);
    })
    .catch((error) => {
      console.error("Error fetching userIcon:", error);
    });
}

function fetchUserData() {
  fetch("http://localhost:4000/session")
    .then((response) => {
      response.json()
        .then((data) => {
          userName.value = data[0].userName;
          userEmail.value = data[0].userEmail;
        })
    })
    .catch((error) => {
      console.error("Error fetching userDetails:", error);
    });
}

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
          aria-label="Menu"
          dense
          flat
          icon="menu"
          round
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title> OfficeClip Suite</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <!-- see: https://forum.quasar-framework.org/topic/2911/width-attribute-on-q-layout-drawer-giving-error-in-browser-console/3 -->
    <q-drawer
      v-model="leftDrawerOpen"
      :width="240"
      bordered
      class="bg-grey-2"
      show-if-above
    >
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
        <q-list>
          <q-item-label header>{{session?.userEmail}}</q-item-label>
          <div v-for="item in filteredHomeIcons" :key="item.name">
            <q-item clickable @click="goToApp(item.url)">
              <q-item-section avatar>
                <q-icon
                  :class="getClass(item.url)"
                  :color="getColor(item.url)"
                  :name="item.icon"
                  size="md"
                ></q-icon>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ item.name }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <!--        <q-item clickable to="/simpleCalendar">-->
          <!--          <q-item-section avatar>-->
          <!--            <q-icon name="calendar_today"/>-->
          <!--          </q-item-section>-->
          <!--          <q-item-section>-->
          <!--            <q-item-label>Simple Calendar</q-item-label>-->
          <!--            <q-item-label caption>calendar using q-date</q-item-label>-->
          <!--          </q-item-section>-->
          <!--        </q-item>-->
        </q-list>
      </q-scroll-area>
      <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
        <div class="absolute-bottom bg-transparent">
          <q-avatar class="q-mb-sm" size="56px">
            <img :src="userIcon">
          </q-avatar>
          <div class="text-weight-bold">{{ userName }}</div>
          <div>{{ userEmail }}</div>
        </div>
      </q-img>
    </q-drawer>

    <q-page-container>
      <q-page>
        <div class="q-pa-lg text-center">
          <q-select
            v-model="model"
            :options="organizationItems"
            @update:model-value="getOrgApplications"
            option-label="name"
            label="Select Organization"
            outlined
          />
        </div>
        <div>
          <div class="row">
            <div
              v-for="item in filteredHomeIcons"
              :key="item.name"
              class="col-4 q-pa-xl text-center itemsCenter"
              style="height: 150px"
            >
              <div>
                <q-icon
                  :class="getClass(item.url)"
                  :color="getColor(item.url)"
                  :name="item.icon"
                  size="lg"
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
