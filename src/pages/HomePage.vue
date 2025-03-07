<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSessionStore } from 'stores/SessionStore';
import { useProfileListsStore } from 'stores/profileListsStore';
import { useQuasar } from 'quasar';
import drawer from '../components/drawer.vue';
import SelectOrganizations from 'src/components/general/SelectOrganizations.vue';

const router = useRouter();
const sessionStore = useSessionStore();
const profileListsStore = useProfileListsStore();

const $q = useQuasar();
const isLoaded = ref<boolean>(false);
const myDrawer = ref();

const filteredHomeIcons = computed(() => {
  return sessionStore.getHomeIcons();
});

const loadProfileList = async () => {
  $q.loading.show();
  try {
    // See: https://github.com/vuejs/pinia/discussions/1078#discussioncomment-4240994
    await sessionStore.getSession();
    await profileListsStore.getProfileLists();
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      await router.push({ path: '/LoginPage' });
      router.go(0);
    });
  } finally {
    $q.loading.hide();
    isLoaded.value = true;
  }
};

onMounted(async () => {
  await loadProfileList();
});

function toggleLeftDrawer() {
  if (myDrawer.value == null) return;
  myDrawer.value.toggleLeftDrawer();
}

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
</script>
<style>
.q-dialog__backdrop {
  backdrop-filter: blur(7px);
}
</style>
<template>
  <q-layout view="lHh Lpr lFf" v-if="isLoaded">
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

    <drawer ref="myDrawer" />

    <q-page-container>
      <q-page>
        <div>
          <SelectOrganizations />
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
                  :color="item.color"
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
