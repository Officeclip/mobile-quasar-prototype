<!-- eslint-disable vue/multi-word-component-names -->
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useSessionStore } from 'stores/SessionStore';
import { useRouter } from 'vue-router';
import packageJson from '../../package.json';
import { useProfileListsStore } from 'stores/profileListsStore';
import { Constants } from 'stores/Constants';
import util from 'src/helpers/util';

const sessionStore = useSessionStore();
const leftDrawerOpen = ref(false);
const router = useRouter();
const profileListsStore = useProfileListsStore();
const userIcon = ref();

const session = computed(() => {
  return sessionStore.session;
});

console.log('Session info: ', session.value);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

defineExpose({ toggleLeftDrawer });

const filteredHomeIcons = computed(() => {
  const homeIcons = sessionStore.getHomeIcons();
  const newIcons = [
    {
      id: 14,
      icon: 'home',
      name: 'Home Page',
      url: '/homePage',
    },
    {
      id: 34,
      icon: 'do_disturb',
      name: 'Reset',
      url: '/settings',
    },
  ];
  const newHomeIcons = [newIcons[0], ...homeIcons];
  newHomeIcons.push(newIcons[1]);
  return newHomeIcons;
});

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

function logout() {
  router.push({ path: '/loginPage' });
}

onMounted(async () => {
  if (util.isObjectNullOrEmpty(profileListsStore.profileLists)) {
    await profileListsStore.getProfileLists();
  }
  userIcon.value = profileListsStore.ProfilesUserGeneral.userIcon;
});
</script>

<style>
.q-list--dense > .q-item,
.q-item--dense {
  min-height: 12px !important;
}
.left-zero {
  left: 0px !important;
}
</style>

<!-- see: https://forum.quasar-framework.org/topic/2911/width-attribute-on-q-layout-drawer-giving-error-in-browser-console/3 -->

<template>
  <q-drawer
    v-model="leftDrawerOpen"
    :width="250"
    bordered
    class="bg-grey-2"
    show-if-above
  >
    <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px">
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
      </q-list>
      <div style="height: 50px"></div>
    </q-scroll-area>
    <q-img
      src="https://cdn.quasar.dev/img/material.png"
      class="absolute-top"
      style="height: 150px"
    >
      <div class="absolute-bottom bg-transparent">
        <q-avatar class="q-mb-sm" size="56px">
          <q-icon v-if="userIcon === ''" name="person" size="xl"></q-icon>
          <img v-if="userIcon !== ''" :src="userIcon" />
        </q-avatar>
        <div class="text-weight-bold">{{ session?.userName }}</div>
        <div>{{ session?.userEmail }}</div>
      </div>
    </q-img>

    <q-footer bordered class="bg-white text-primary left-zero">
      <q-separator color="red-6"></q-separator>
      <q-list>
        <q-item class="q-mb-xs">
          <q-item-section>
            <q-item-label
              ><q-btn
                class="q-px-md"
                outline
                color="primary"
                no-caps
                rounded
                dense
                @click="logout"
                label="Logout"
              ></q-btn>
            </q-item-label>
          </q-item-section>
          <q-item-section>
            <q-list class="absolute-bottom-right text-caption dense">
              <q-item dense>
                <q-item-section>Version:</q-item-section>
                <q-item-section side>{{ packageJson.version }}</q-item-section>
              </q-item>
              <q-item dense>
                <q-item-section>OC Version:</q-item-section>
                <q-item-section side>{{
                  Constants.getRestApiVersionFromSession()
                }}</q-item-section>
              </q-item>
            </q-list>
          </q-item-section>
        </q-item>
      </q-list>
    </q-footer>
  </q-drawer>
</template>
