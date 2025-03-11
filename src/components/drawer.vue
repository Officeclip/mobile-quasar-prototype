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
  setTimeout(() => {
    window.location.reload();
  }, 400); // 2000 milliseconds = 2 seconds
}

onMounted(async () => {
  if (util.isObjectNullOrEmpty(profileListsStore.profileLists)) {
    await profileListsStore.getProfileLists();
  }
  userIcon.value = profileListsStore.ProfilesUserGeneral?.userIcon;
});
</script>

<!-- see: https://forum.quasar-framework.org/topic/2911/width-attribute-on-q-layout-drawer-giving-error-in-browser-console/3 -->

<template>
  <q-drawer v-model="leftDrawerOpen" :mi-width="200" bordered show-if-above>
    <q-scroll-area style="margin-top: 80px; height: calc(100% - 80px)">
      <q-list>
        <q-item class="bg-grey-3">
          <q-item-section>
            <SelectOrganizations :dense="dense" />
          </q-item-section>
        </q-item>
        <!-- <q-separator color="grey-4"></q-separator> -->
        <q-item
          v-for="item in filteredHomeIcons"
          :key="item.name"
          clickable
          @click="goToApp(item.url)"
        >
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
        <q-item class="q-mt-sm">
          <q-item-section>
            <q-btn
              icon="logout"
              outline
              color="primary"
              dense
              @click="logout"
              label="Log out"
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <div class="flex justify-between bg-grey-3 q-px-sm">
              <div>
                <div>
                  <span class="text-italic">App Version:</span>
                  {{ packageJson.version }}
                </div>
              </div>
              <div>
                <div>
                  <span class="text-italic">OC Version:</span>
                  {{ Constants.getRestApiVersionFromSession() }}
                </div>
              </div>
            </div>
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
    <!-- <q-img
      src="src/images/2880x1800-smoky-black-solid-color-background.jpg"
      class="absolute-top"
      height="100px"
    > -->
    <div class="background-div">
      <q-item>
        <q-item-section side>
          <q-avatar size="xl" color="white">
            <q-img v-if="userIcon" v-bind:src="userIcon" />
            <q-icon v-else name="person" />
          </q-avatar>
        </q-item-section>
        <q-separator vertical color="white" inset></q-separator>
        <q-item-section class="q-ml-md text-white">
          <q-item-label class="text-subtitle1">
            {{ session?.userName }}
          </q-item-label>
          <q-item-label>
            {{ session?.userEmail }}
          </q-item-label>
        </q-item-section>
        <q-item-section side top>
          <q-icon name="settings" color="white" />
        </q-item-section>
      </q-item>
      <!-- <q-item dense class="text-white">
        <q-item-section>Version:</q-item-section>
        <q-item-section>{{ packageJson.version }}</q-item-section>
        <q-item-section>OC Version:</q-item-section>
        <q-item-section>{{
          Constants.getRestApiVersionFromSession()
        }}</q-item-section>
      </q-item> -->
      <!-- <div class="text-white flex justify-between q-ma-md">
        <div>
          <div>
            <span class="text-italic">Version:</span> {{ packageJson.version }}
          </div>
        </div>
        <div>
          <div>
            <span class="text-italic">OC Version:</span>
            {{ Constants.getRestApiVersionFromSession() }}
          </div>
        </div>
      </div> -->
    </div>

    <!-- <div>
      <div class="flex justify-center">
        <button @click="logout" class="text-primary">
          <span>Log out</span>
        </button>
      </div>
      <div class="flex justify-between">
        <div>
          <div>
            <span class="text-italic">Version:</span> {{ packageJson.version }}
          </div>
        </div>
        <div>
          <div>
            <span class="text-italic">OC Version:</span>
            {{ Constants.getRestApiVersionFromSession() }}
          </div>
        </div>
      </div>
    </div> -->
  </q-drawer>
</template>
<style scoped>
.background-div {
  background-color: #000; /* Replace with your desired color */
  height: 80px;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 1;
}
</style>
