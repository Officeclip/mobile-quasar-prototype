<!-- eslint-disable vue/multi-word-component-names -->
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useSessionStore } from 'stores/SessionStore';
import { useRouter } from 'vue-router';
import packageJson from '../../package.json';
import { useProfileListsStore } from 'stores/profileListsStore';
import { Constants } from 'stores/Constants';
import util from 'src/helpers/util';
import SelectOrganizations from './general/SelectOrganizations.vue';

const sessionStore = useSessionStore();
const leftDrawerOpen = ref(false);
const router = useRouter();
const profileListsStore = useProfileListsStore();
const userIcon = ref();
const dense = true;

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
      color: '',
    },
    {
      id: 34,
      icon: 'do_disturb',
      name: 'Reset',
      url: '/settings',
      color: '',
    },
  ];
  const newHomeIcons = [newIcons[0], ...homeIcons];
  newHomeIcons.push(newIcons[1]);
  return newHomeIcons;
});

// function getColor(url: string) {
//   return url !== '' ? 'primary' : 'dark';
// }

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
  userIcon.value = profileListsStore.ProfilesUserGeneral?.userIcon;
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
  <q-drawer v-model="leftDrawerOpen" :mi-width="250" bordered show-if-above>
    <q-scroll-area style="margin-top: 100px; height: calc(100% - 160px)">
      <q-list>
        <q-item dense class="q-pa-none">
          <q-item-section>
            <SelectOrganizations :dense="dense" class="bg-grey-2" />
          </q-item-section>
        </q-item>
        <q-separator color="grey-4"></q-separator>
        <q-item
          v-for="item in filteredHomeIcons"
          :key="item.name"
          clickable
          @click="goToApp(item.url)"
        >
          <q-item-section avatar>
            <q-icon
              :class="getClass(item.url)"
              :color="item.color"
              :name="item.icon"
              size="md"
            ></q-icon>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ item.name }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
    <!-- <q-img
      src="src/images/dark-pastel-blue-solid-color-background.jpg"
      class="absolute-top"
      height="150px"
    > -->
    <!-- <q-img
      src="src/images/jet-solid-color-background.jpg"
      class="absolute-top"
      height="150px"
    > -->
    <!-- <q-img
      src="src/images/ruddy-pink-solid-color-background.jpg"
      class="absolute-top"
      height="150px"
    > -->
    <!-- <q-img
      src="src/images/soap-solid-color-background.jpg"
      class="absolute-top"
      height="150px"
    > -->
    <q-img
      src="src/images/2880x1800-smoky-black-solid-color-background.jpg"
      class="absolute-top"
      height="100px"
    >
      <q-item class="q-px-none">
        <q-item-section side>
          <q-avatar size="xl" color="white">
            <q-img v-if="userIcon" v-bind:src="userIcon" />
            <q-icon v-else name="person" />
          </q-avatar>
        </q-item-section>
        <q-separator vertical color="white" inset></q-separator>
        <q-item-section class="q-ml-md">
          <q-item-label class="text-subtitle1">
            {{ session?.userName }}
          </q-item-label>
          <q-item-label>
            {{ session?.userEmail }}
          </q-item-label>
        </q-item-section>
      </q-item>
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
