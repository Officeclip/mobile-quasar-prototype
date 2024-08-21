<!-- eslint-disable vue/multi-word-component-names -->
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
// import { Session } from '../models/session';
import { useSessionStore } from 'stores/SessionStore';
import { useRouter } from 'vue-router';
import packageJson from '../../package.json';
import { useProfileListsStore } from 'stores/profileListsStore';
import { Constants } from 'stores/Constants';
import logger from 'src/helpers/logger';
import util from 'src/helpers/util';

const sessionStore = useSessionStore();
const leftDrawerOpen = ref(false);
const router = useRouter();
const profileListsStore = useProfileListsStore();
const session = ref();
const userIcon = ref();

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

defineExpose({ toggleLeftDrawer });

// const userIcon = computed(() => {
//   return profileListsStore.ProfilesUserGeneral.userIcon;
// });

const filteredHomeIcons = computed(() => {
  return sessionStore.getHomeIcons();
});

function getColor(url: string) {
  return url !== '' ? 'primary' : 'dark';
}

function getClass(url: string) {
  return url !== '' ? 'pointer' : '';
}

// const session: ComputedRef<Session> = computed(() => {
//   return sessionStore.session;
// });

function goToApp(url: string) {
  if (url !== '') {
    router.push({ path: url });
  }
}

function logout() {
  router.push({ path: '/loginPage' });
}

onMounted(async () => {
  session.value = sessionStore.Session;
  if (util.isObjectNullOrEmpty(profileListsStore.profileLists)) {
    await profileListsStore.getProfileLists();
  }
  //debugger;
  userIcon.value = profileListsStore.ProfilesUserGeneral.userIcon;
});
</script>

<style>
.q-list--dense > .q-item,
.q-item--dense {
  min-height: 12px !important;
}
</style>

<!-- see: https://forum.quasar-framework.org/topic/2911/width-attribute-on-q-layout-drawer-giving-error-in-browser-console/3 -->

<template>
  <q-drawer
    v-model="leftDrawerOpen"
    :width="240"
    bordered
    class="bg-grey-2"
    show-if-above
  >
    <q-scroll-area
      style="
        height: calc(100% - 150px);
        margin-top: 150px;
        border-right: 1px solid #ddd;
      "
    >
      <q-list>
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
        <q-btn
          color="primary"
          style="margin-top: 16px; margin-left: 16px"
          @click="logout"
        >
          <q-icon left name="logout"></q-icon>
          <div>Logout</div>
        </q-btn>
      </q-list>

      <q-list class="absolute-bottom-right text-caption dense">
        <q-item dense>
          <q-item-section>Version: </q-item-section>
          <q-item-section side>{{ packageJson.version }}</q-item-section>
        </q-item>
        <q-item dense>
          <q-item-section>OfficeClip Version: </q-item-section>
          <q-item-section side>{{
            Constants.getRestApiVersionFromSession()
          }}</q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
    <q-img
      src="https://cdn.quasar.dev/img/material.png"
      class="absolute-top"
      style="height: 150px"
    >
      <div class="absolute-bottom bg-transparent">
        <q-avatar class="q-mb-sm" size="56px">
          <img :src="userIcon" />
        </q-avatar>
        <div class="text-weight-bold">{{ session?.userName }}</div>
        <div>{{ session?.userEmail }}</div>
      </div>
    </q-img>
  </q-drawer>
</template>
