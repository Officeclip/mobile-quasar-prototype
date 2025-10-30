<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSessionStore } from '../stores/SessionStore';
import { useProfileListsStore } from '../stores/profileListsStore';
import { useQuasar } from 'quasar';
import SelectOrganizations from 'src/components/general/SelectOrganizations.vue';
import OC_Drawer from 'src/components/OC_Drawer.vue';
import OC_Header from 'src/components/OCcomponents/OC_Header.vue';

// Constants

const title = 'OfficeClip Suite';
// Store and router initialization
const router = useRouter();
const sessionStore = useSessionStore();
const profileListsStore = useProfileListsStore();
const $q = useQuasar();

// Reactive state
const isLoadingData = ref<boolean>(false);
const hasError = ref<boolean>(false);
const errorMessage = ref<string>('');
const myDrawer = ref();
const viewMode = ref<'grid' | 'list'>('grid');

// Computed properties
const filteredHomeIcons = computed(() => {
  try {
    const icons = sessionStore.getHomeIcons();
    if (!icons || icons.length === 0) return [];

    return icons;
  } catch (error) {
    console.error('Error filtering home icons:', error);
    return [];
  }
});

const isSessionLoaded = computed(() => {
  const session = sessionStore.Session;
  return session && session.applicationIds && session.applicationIds.length > 0;
});

// Utility functions
function showNotification(
  message: string,
  type: 'negative' | 'positive' | 'info' = 'info',
): void {
  $q.notify({
    message,
    color: type,
    position: 'top',
    timeout: 2500,
    actions: [
      { icon: 'close', color: 'white', round: true, handler: () => {} },
    ],
  });
}

async function handleAppClick(item: any): Promise<void> {
  if (item.url === '') {
    showNotification(`${item.name} is currently unavailable`, 'info');
    return;
  }

  try {
    await router.push({ path: item.url });
  } catch (error) {
    console.error('Navigation error:', error);
    showNotification(`Failed to open ${item.name}`, 'negative');
  }
}

async function loadProfileList(): Promise<void> {
  if (isLoadingData.value) return; // Prevent multiple calls

  isLoadingData.value = true;

  try {
    await sessionStore.getSession();
    await profileListsStore.getProfileLists();
  } catch (error) {
    console.error('Failed to load profile data:', error);
    hasError.value = true;
    errorMessage.value =
      (error as string) || 'Failed to load dashboard data. Please try again.';

    $q.dialog({
      title: 'Connection Error',
      message: errorMessage.value,
      persistent: true,
      ok: {
        label: 'Go to Login',
        color: 'primary',
        unelevated: true,
      },
    }).onOk(async () => {
      await router.push({ path: '/LoginPage' });
      router.go(0);
    });
  } finally {
    isLoadingData.value = false;
  }
}

function toggleLeftDrawer(): void {
  if (myDrawer.value) {
    myDrawer.value.toggleLeftDrawer();
  }
}

function toggleViewMode(): void {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid';
}

async function refreshDashboard(): Promise<void> {
  await loadProfileList();
}

// Lifecycle hooks
onMounted(async () => {
  await loadProfileList();
});
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Loading Screen -->
    <div v-if="isLoadingData" class="fixed-full flex flex-center bg-primary">
      <div class="text-center text-white">
        <q-spinner-orbit size="2.5rem" color="white" />
        <div class="q-mt-md text-h6">Loading Dashboard...</div>
      </div>
    </div>

    <!-- Error Screen -->
    <div v-else-if="hasError" class="fixed-full flex flex-center bg-negative">
      <div class="text-center text-white q-pa-lg">
        <q-icon name="error_outline" size="3rem" />
        <div class="q-mt-md text-h6">Error Loading Dashboard</div>
        <div class="q-mt-sm text-body2">{{ errorMessage }}</div>
        <q-btn
          class="q-mt-lg"
          color="white"
          text-color="negative"
          @click="refreshDashboard"
        >
          Try Again
        </q-btn>
      </div>
    </div>

    <!-- Main Layout -->
    <template v-else-if="isSessionLoaded">
      <OC_Header
        :title="title"
        :show-back-button="false"
        :show-menu-button="true"
        @toggle-drawer="toggleLeftDrawer"
        :show-refresh-button="true"
        @refresh="refreshDashboard"
        :show-log-out-button="true"
      />

      <!-- Navigation Drawer -->
      <OC_Drawer ref="myDrawer" />

      <!-- Page Container -->
      <q-page-container>
        <q-page class="q-pa-md">
          <div class="row justify-center">
            <div class="col-12" style="max-width: 1200px">
              <!-- Organization Selection -->
              <q-card flat>
                <q-card-section class="q-pa-md">
                  <div class="row items-center q-col-gutter-md">
                    <div class="col">
                      <SelectOrganizations />
                    </div>
                    <div class="col-auto">
                      <q-btn
                        flat
                        dense
                        round
                        :icon="viewMode === 'grid' ? 'view_list' : 'grid_view'"
                        @click="toggleViewMode"
                      >
                        <q-tooltip>
                          {{ viewMode === 'grid' ? 'List View' : 'Grid View' }}
                        </q-tooltip>
                      </q-btn>
                    </div>
                  </div>
                </q-card-section>
              </q-card>

              <!-- Apps Container -->
              <q-card flat>
                <!-- No Apps Available -->
                <div
                  v-if="filteredHomeIcons.length === 0"
                  class="q-pa-xl text-center"
                >
                  <q-icon name="apps" size="3rem" color="grey-5" />
                  <div class="text-h6 q-mt-md q-mb-sm text-grey-7">
                    No applications available
                  </div>
                  <div class="text-body2 text-grey-5 q-mb-md">
                    Contact your administrator to enable applications
                  </div>
                </div>

                <!-- Grid View -->
                <div v-else-if="viewMode === 'grid'" class="q-pa-md">
                  <div class="row q-col-gutter-md">
                    <div
                      v-for="item in filteredHomeIcons"
                      :key="item.id"
                      class="col-4 col-sm-4 col-md-3 col-lg-2"
                    >
                      <q-card
                        :class="[
                          'cursor-pointer transition-all',
                          item.url === '' ? 'opacity-60' : 'hover-lift',
                        ]"
                        flat
                        bordered
                        @click="handleAppClick(item)"
                      >
                        <q-card-section class="text-center q-pa-md">
                          <q-avatar
                            :color="
                              item.color ||
                              (item.url !== '' ? 'primary' : 'grey-4')
                            "
                            text-color="white"
                            :icon="item.icon"
                            size="2.5rem"
                            class="q-mb-sm"
                          />
                          <div
                            class="text-subtitle2 text-weight-medium ellipsis"
                          >
                            {{ item.name }}
                          </div>
                        </q-card-section>

                        <q-chip
                          v-if="item.url === ''"
                          size="sm"
                          color="orange"
                          text-color="white"
                          label="Soon"
                          class="absolute"
                          style="
                            top: 4px;
                            right: 4px;
                            font-size: 10px;
                            padding: 2px 6px;
                            height: auto;
                          "
                        />

                        <!-- Hover Overlay -->
                        <div
                          v-if="item.url !== ''"
                          class="absolute-full bg-primary text-white flex flex-center transition-all hover-overlay"
                        >
                          <q-icon name="open_in_new" size="sm" />
                        </div>
                      </q-card>
                    </div>
                  </div>
                </div>

                <!-- List View -->
                <div v-else>
                  <q-list separator padding>
                    <q-item
                      v-for="item in filteredHomeIcons"
                      :key="item.id"
                      :class="[
                        'cursor-pointer',
                        item.url === '' ? 'opacity-60' : '',
                      ]"
                      clickable
                      @click="handleAppClick(item)"
                    >
                      <q-item-section avatar>
                        <q-avatar
                          :color="
                            item.color ||
                            (item.url !== '' ? 'primary' : 'grey-4')
                          "
                          text-color="white"
                        >
                          <q-icon :name="item.icon" />
                        </q-avatar>
                      </q-item-section>

                      <q-item-section>
                        <q-item-label class="text-weight-medium">
                          {{ item.name }}
                        </q-item-label>
                      </q-item-section>

                      <q-item-section side>
                        <q-icon
                          v-if="item.url !== ''"
                          name="chevron_right"
                          color="grey-6"
                        />
                        <q-chip
                          v-else
                          size="sm"
                          color="orange"
                          text-color="white"
                          label="Soon"
                        />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </q-card>
            </div>
          </div>
        </q-page>
      </q-page-container>
    </template>

    <!-- Session Not Loaded -->
    <div v-else class="fixed-full flex flex-center bg-warning">
      <div class="text-center text-white q-pa-lg">
        <q-icon name="warning" size="3rem" />
        <div class="q-mt-md text-h6">Session Not Available</div>
        <div class="q-mt-sm text-body2">Please login again</div>
        <q-btn
          class="q-mt-lg"
          color="white"
          text-color="warning"
          @click="router.push('/LoginPage')"
        >
          Go to Login
        </q-btn>
      </div>
    </div>
  </q-layout>
</template>

<style>
.q-dialog__backdrop {
  backdrop-filter: blur(4px);
}

.transition-all {
  transition: all 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.hover-overlay {
  opacity: 0;
}

.hover-overlay:hover {
  opacity: 0.9;
}

.opacity-60 {
  opacity: 0.6;
}
</style>
