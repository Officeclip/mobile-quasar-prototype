<!--
  FIXME: sg: icons should be bigger, row spacing should be more, screen doesn't dance on hover [30]
  FIXME: sg: organization drop down should work [30]
 -->

<script lang="ts" setup>
import { computed, ComputedRef, onBeforeMount, ref } from 'vue';
import { useHomeIconsStore } from 'stores/HomeIconStore';
import { useRouter } from 'vue-router';
import { useSessionStore } from 'stores/SessionStore';
import { Session } from '../models/session';
import { useUserProfileStore } from 'stores/UserProfileStore';
import { UserProfile } from 'src/models/UserProfile';

const router = useRouter();
const homeIconStore = useHomeIconsStore();
const sessionStore = useSessionStore();
const userProfileStore = useUserProfileStore();
// const userIcon = ref('');
// const userName = ref('');
// const userEmail = ref('');
//const homeIcons = ref<HomeIcon[]>([]);
//const organizationItems = ref<string[]>([]);
// const model = ref(null);

const model = ref('OfficeClip Work');

// const homeIcons = computed(() => {
//   return homeIconStore.HomeIcons;
// });

const filteredHomeIcons = computed(() => {
  return homeIconStore.homeIcons.filter((item) => {
    return session.value.applicationIds.includes(item.id);
  });
});

const session: ComputedRef<Session> = computed(() => {
  console.log('Sessions stores', sessionStore.Sessions[0]);
  return sessionStore.Sessions[0];
});

const userProfile: ComputedRef<UserProfile> = computed(() => {
  console.log('UserProfile store', userProfileStore.UserProfiles[0]);
  return userProfileStore.UserProfiles[0];
});

const organizationItems = computed(() => {
  return homeIconStore.OrganizationItems;
});

onBeforeMount(() => {
  // See: https://github.com/vuejs/pinia/discussions/1078#discussioncomment-4240994
  sessionStore.getSessions();
  homeIconStore.getHomeIcons();
  userProfileStore.getUserProfiles();
  homeIconStore.getOrganizationItems();
});

function getOrgApplications() {
  homeIconStore.getHomeIcons();
}

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
        </q-list>
      </q-scroll-area>
      <q-img
        :src="userProfile?.background"
        class="absolute-top"
        style="height: 150px"
      >
        <div class="absolute-bottom bg-transparent">
          <q-avatar class="q-mb-sm" size="56px">
            <img :src="userProfile?.userIcon" />
          </q-avatar>
          <div class="text-weight-bold">{{ session?.userName }}</div>
          <div>{{ session?.userEmail }}</div>
        </div>
      </q-img>
    </q-drawer>

    <q-page-container>
      <q-page>
        <div class="q-pa-lg text-center">
          <q-select
            v-model="model"
            :options="organizationItems"
            label="Select Organization"
            option-label="name"
            outlined
            @update:model-value="getOrgApplications"
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
