<script setup lang="ts">
import { ref, watch } from 'vue';
import { useSessionStore } from '../stores/SessionStore';
import util from 'src/helpers/util';
import { useRouter } from 'vue-router';
import { useNotification } from 'src/composables/useNotification';

const selectedEdition = ref('cloud');
const apiUrl = ref('');
const loading = ref(false);
const router = useRouter();
const { showNotification } = useNotification();
const sessionStore = useSessionStore();

const cloudUrl = import.meta.env.VITE_API_ENDPOINT_DEFAULT;

watch(selectedEdition, (newEdition) => {
  apiUrl.value = newEdition === 'cloud' ? cloudUrl : '';
});

apiUrl.value = cloudUrl;

async function connectApi(): Promise<void> {
  const url = apiUrl.value.trim();
  if (!url) {
    showNotification('API URL cannot be empty.', 'warning');
    return;
  }

  loading.value = true;
  try {
    const isValid = await sessionStore.isValidUrl(url);
    if (isValid) {
      util.setEndPointUrlInLocalStorage(url);
      showNotification('Connection successful!', 'positive', 'top', () =>
        router.push('/'),
      );
    } else {
      showNotification('Please enter valid Rest Api Url', 'negative');
    }
  } catch (error) {
    showNotification('Connection failed. Please try again');
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <q-layout view="lHh Lpr lFf" class="bg-white">
    <q-header class="bg-primary text-white" height-hint="60">
      <q-toolbar style="height: 60px">
        <q-btn flat round icon="west" :to="{ name: 'loginPage' }" />
        <q-toolbar-title class="text-weight-bold text-center text-subtitle1">
          Setup Connection
        </q-toolbar-title>
        <div style="width: 48px"></div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="q-pa-lg column no-wrap">
        <div class="toggle-container q-mb-xl">
          <div class="custom-toggle row no-wrap">
            <div
              class="toggle-option col-6 flex flex-center"
              :class="{ active: selectedEdition === 'cloud' }"
              @click="selectedEdition = 'cloud'"
            >
              Cloud
            </div>
            <div
              class="toggle-option col-6 flex flex-center"
              :class="{ active: selectedEdition === 'self-hosted' }"
              @click="selectedEdition = 'self-hosted'"
            >
              Self-Hosted
            </div>
          </div>
        </div>

        <div class="text-subtitle2 text-weight-bold text-grey-9 q-mb-xs">
          Server Address
        </div>
        <q-input
          v-model="apiUrl"
          outlined
          dense
          placeholder="company.officeclip.com"
          class="custom-input q-mb-sm"
          :readonly="selectedEdition === 'cloud'"
          @keyup.enter="connectApi"
        />
        <div class="text-caption text-grey-7 q-mb-xl">
          We will automatically configure the API URL.
        </div>

        <div class="row items-center q-mb-xl">
          <q-separator class="col" />
          <div class="q-px-md text-caption text-grey-6 text-weight-bold">
            OR
          </div>
          <q-separator class="col" />
        </div>

        <q-btn
          outline
          color="primary"
          class="qr-btn full-width q-py-md"
          no-caps
        >
          <div class="row items-center justify-center">
            <q-icon name="qr_code_scanner" size="sm" class="q-mr-md" />
            <span class="text-weight-bold">Scan Setup QR Code</span>
          </div>
        </q-btn>

        <q-space />

        <div class="q-pt-xl">
          <q-btn
            color="primary"
            unelevated
            rounded
            :loading="loading"
            label="CONNECT"
            class="full-width text-weight-bold"
            style="height: 50px; border-radius: 25px"
            @click="connectApi"
          />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
/* Custom Toggle Pill */
.custom-toggle {
  background: #e3f2fd;
  border-radius: 25px;
  height: 44px;
  padding: 4px;
  cursor: pointer;
  position: relative;
}

.toggle-option {
  border-radius: 20px;
  font-weight: bold;
  font-size: 14px;
  transition: all 0.3s ease;
  color: #1976d2;
  z-index: 1;
}

.toggle-option.active {
  background: #1976d2;
  color: white;
}

/* Custom Input Styling */
.custom-input :deep(.q-field__control) {
  border-radius: 8px;
  background: white;
}

/* QR Button Dashed Border */
.qr-btn {
  border: 2px dashed #1976d2 !important;
  border-radius: 8px;
  background: white !important;
}

/* Remove standard toolbar shadow to match flat SVG header */
.q-header {
  box-shadow: none;
}
</style>
