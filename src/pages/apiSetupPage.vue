<script setup lang="ts">
import { ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useSessionStore } from '../stores/SessionStore';
import util from 'src/helpers/util';
import { useRouter } from 'vue-router';

// Simple reactive data
const selectedEdition = ref('cloud');
const apiUrl = ref('');
const loading = ref(false);
const router = useRouter();

// Composables
const $q = useQuasar();
const sessionStore = useSessionStore();

// Notification function
function showNotification(
  message: string,
  type: 'negative' | 'positive' = 'negative',
  position: 'top' | 'bottom' = 'top',
  onDismiss?: () => void,
): void {
  $q.notify({
    message,
    color: type === 'negative' ? 'negative' : 'positive',
    position: position,
    timeout: 1000,
    actions: [
      { icon: 'close', color: 'white', round: true, handler: () => {} },
    ],
    onDismiss,
  });
}

// Set default cloud URL
const cloudUrl = import.meta.env.VITE_API_ENDPOINT_DEFAULT;

// Watch edition changes
watch(selectedEdition, (newEdition) => {
  if (newEdition === 'cloud') {
    apiUrl.value = cloudUrl;
  } else {
    apiUrl.value = '';
  }
});

// Initialize with cloud URL
apiUrl.value = cloudUrl;

// Simple connect function
async function connectApi() {
  if (!apiUrl.value.trim()) return;

  loading.value = true;

  try {
    const isValid = await sessionStore.isValidUrl(apiUrl.value);

    if (isValid) {
      util.setEndPointUrlInLocalStorage(apiUrl.value);
      showNotification(
        'Connection successful! Redirecting...',
        'positive',
        'top',
        () => router.push('/'),
      );
    } else {
      showNotification(
        'Please enter valid Rest Api Url',
        'negative',
        'bottom',
        () => (apiUrl.value = ''),
      );
      // apiUrl.value = '';
    }
  } catch (error) {
    showNotification(
      `'Connection failed. Please try again'${error}`,
      'negative',
    );
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="bg-grey-2 flex justify-center">
        <q-card flat class="q-ma-lg shadow-4 card">
          <!-- Header -->
          <q-card-section class="bg-primary text-white q-pa-lg">
            <div class="flex items-center">
              <q-btn
                flat
                round
                icon="west"
                :to="{ name: 'loginPage' }"
                class="q-mr-md text-white"
              />
              <div>
                <div class="text-h6 text-weight-bold">API Configuration</div>
                <div class="text-body2 text-blue-2">
                  Connect your mobile app
                </div>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <!-- Edition Selection -->
          <q-card-section>
            <div class="text-subtitle1 text-weight-medium q-my-md">
              Select Your Edition:
            </div>

            <q-btn-toggle
              v-model="selectedEdition"
              toggle-color="primary"
              :options="[
                { label: 'OfficeClip Cloud', value: 'cloud' },
                { label: 'Self-Hosted', value: 'self-hosted' },
              ]"
              rounded
            />
          </q-card-section>

          <!-- API URL Input -->
          <q-card-section>
            <div class="text-subtitle1 text-weight-medium q-mb-md">
              API Endpoint URL:
            </div>

            <q-input
              v-model="apiUrl"
              placeholder="Enter valid REST API URL"
              :hint="
                selectedEdition === 'cloud'
                  ? 'Using OfficeClip cloud servers'
                  : 'e.g. https://your-domain.com/officeclip/api'
              "
              type="url"
              outlined
              :readonly="selectedEdition === 'cloud'"
              :bg-color="selectedEdition === 'cloud' ? 'grey-3' : ''"
              :rules="[
                (val) => {
                  if (!/^https?:\/\//.test(val)) {
                    return 'API URL must start with http or https';
                  }
                  return true;
                },
              ]"
              @keyup.enter="connectApi"
            >
              <template #prepend>
                <q-icon name="link" color="primary" />
              </template>
            </q-input>
          </q-card-section>

          <!-- Help Instructions -->
          <q-card-section v-if="selectedEdition === 'self-hosted'">
            <q-expansion-item
              icon="help_outline"
              label="How to find your API URL"
              class="bg-blue-1 rounded-borders"
              header-class="text-primary text-weight-medium q-pa-md"
            >
              <div class="q-pa-md">
                <div class="text-body2 q-mb-sm">
                  1. Login to OfficeClip on desktop
                </div>
                <div class="text-body2 q-mb-sm">
                  2. Click your profile picture (top right)
                </div>
                <div class="text-body2">
                  3. Select 'Mobile' to view your API URL
                </div>
              </div>
            </q-expansion-item>
          </q-card-section>

          <q-separator />

          <!-- Action Buttons -->
          <q-card-actions align="between">
            <q-btn flat color="grey-7" :to="{ name: 'loginPage' }">
              <q-icon left name="arrow_back" />
              Back
            </q-btn>
            <q-btn
              color="primary"
              unelevated
              rounded
              :disable="!apiUrl.trim() || loading"
              @click="connectApi"
              class="q-px-xl"
              :style="loading ? 'opacity: 0.6;' : ''"
            >
              <span>
                {{ loading ? 'Connecting...' : 'Connect' }}
                <q-spinner
                  v-if="loading"
                  size="20px"
                  color="white"
                  class="q-ml-sm"
                />
                <q-icon right name="arrow_forward" v-if="!loading" />
              </span>
            </q-btn>
          </q-card-actions>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.card {
  max-width: 480px;
  min-width: 380px;
  border-radius: 12px;
}
</style>
