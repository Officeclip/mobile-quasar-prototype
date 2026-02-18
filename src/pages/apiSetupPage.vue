<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useSessionStore } from '../stores/SessionStore';
import util from 'src/helpers/util';
import { useRouter } from 'vue-router';
import { useNotification } from 'src/composables/useNotification';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Html5Qrcode, Html5QrcodeScanner } from 'html5-qrcode';
import { useQuasar } from 'quasar';

const selectedEdition = ref('cloud');
const apiUrl = ref('');
const loading = ref(false);
const router = useRouter();
const { showNotification } = useNotification();
const sessionStore = useSessionStore();
const $q = useQuasar();
const isPwa = ref(false);
const showScanner = ref(false);
let html5QrcodeScanner: Html5QrcodeScanner | null = null;

const cloudUrl = 'https://app.officeclip.com';

watch(selectedEdition, (newEdition) => {
  apiUrl.value = newEdition === 'cloud' ? cloudUrl : '';
});

onMounted(() => {
  isPwa.value = $q.platform.is.pwa || $q.platform.is.mobile === false;
  if (selectedEdition.value === 'cloud') {
    apiUrl.value = cloudUrl;
  }
});

onBeforeUnmount(() => {
  stopScan();
});

async function connectApi(): Promise<void> {
  let url = apiUrl.value.trim();
  if (!url) {
    showNotification('API URL cannot be empty.', 'warning');
    return;
  }

  if (!url.endsWith('/api')) {
    url = `${url}/api`;
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

const stopScan = () => {
  if (isPwa.value) {
    showScanner.value = false;
    if (html5QrcodeScanner) {
      html5QrcodeScanner.clear();
      html5QrcodeScanner = null;
    }
  }
};

const startScan = async () => {
  if (isPwa.value) {
    showScanner.value = true;
    // Delay to ensure the DOM is updated
    setTimeout(() => {
      html5QrcodeScanner = new Html5QrcodeScanner(
        'qr-reader',
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          rememberLastUsedCamera: true,
        },
        false,
      );
      html5QrcodeScanner.render(
        (decodedText: string) => {
          apiUrl.value = util.processScannedUrl(decodedText);
          selectedEdition.value = 'self-hosted';
          stopScan();
        },
        () => {
          // ignore errors
        },
      );
    }, 100);
  } else {
    try {
      const { supported } = await BarcodeScanner.isSupported();
      if (!supported) {
        showNotification('QR code scanning is not supported on this device.');
        return;
      }

      const { camera } = await BarcodeScanner.requestPermissions();
      if (camera !== 'granted') {
        showNotification('Camera permission is required to scan QR codes.');
        return;
      }

      const { barcodes } = await BarcodeScanner.scan();
      if (barcodes.length > 0) {
        apiUrl.value = util.processScannedUrl(barcodes[0].displayValue);
        selectedEdition.value = 'self-hosted';
      }
    } catch (e) {
      console.error(e);
      showNotification('Unable to scan QR code.', 'negative');
    }
  }
};
</script>

<template>
  <q-layout view="lHh Lpr lFf" class="bg-surface">
    <q-header class="bg-primary text-white">
      <q-toolbar style="height: 60px">
        <q-btn flat round icon="west" :to="{ name: 'loginPage' }" />
        <q-toolbar-title class="text-weight-bold text-center text-subtitle1">
          Server Connection
        </q-toolbar-title>
        <div style="width: 48px"></div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="q-pa-lg column no-wrap">
        <div class="toggle-container q-mb-xl">
          <div
            class="custom-toggle row no-wrap"
            :class="
              $q.dark.isActive ? 'bg-dark-container' : 'bg-light-container'
            "
          >
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

        <div
          v-if="selectedEdition === 'cloud'"
          class="column items-center q-gutter-y-md"
        >
          <div class="illustration-container q-mt-lg">
            <q-avatar
              size="140px"
              font-size="80px"
              :color="$q.dark.isActive ? 'primary' : 'blue-1'"
              :text-color="$q.dark.isActive ? 'white' : 'primary'"
              icon="cloud"
            >
              <q-badge floating color="positive" rounded class="check-badge">
                <q-icon name="check" color="white" size="14px" />
              </q-badge>
            </q-avatar>
          </div>

          <div class="text-center">
            <div
              class="text-h6 text-weight-bold"
              :class="$q.dark.isActive ? 'text-white' : 'text-grey-9'"
            >
              OfficeClip Hosted
            </div>
            <div
              class="text-body2 q-px-md"
              :class="$q.dark.isActive ? 'text-grey-5' : 'text-grey-7'"
            >
              You are connecting to our secure<br />
              cloud servers. No setup required.
            </div>
          </div>

          <!-- <div
            class="url-preview row items-center justify-center q-px-md q-py-xs"
            :class="$q.dark.isActive ? 'bg-dark-container' : 'bg-grey-2'"
          >
            <q-icon
              name="lock"
              size="xs"
              :color="$q.dark.isActive ? 'grey-5' : 'grey-6'"
              class="q-mr-xs"
            />
            <span
              class="text-caption"
              :class="$q.dark.isActive ? 'text-grey-5' : 'text-grey-6'"
              >{{ cloudUrl }}</span
            >
          </div> -->
        </div>

        <div v-else class="column">
          <div
            class="text-subtitle2 text-weight-bold q-mb-xs"
            :class="$q.dark.isActive ? 'text-white' : 'text-grey-9'"
          >
            Server Address
          </div>
          <q-input
            v-model="apiUrl"
            outlined
            dense
            placeholder="company.officeclip.com"
            class="custom-input q-mb-sm"
            @keyup.enter="connectApi"
          />
          <div
            class="text-caption q-mb-xl"
            :class="$q.dark.isActive ? 'text-grey-5' : 'text-grey-7'"
          >
            We will automatically configure the API URL.
          </div>

          <div class="row items-center q-mb-xl">
            <q-separator class="col" />
            <div
              class="q-px-md text-caption text-weight-bold"
              :class="$q.dark.isActive ? 'text-grey-5' : 'text-grey-6'"
            >
              OR
            </div>
            <q-separator class="col" />
          </div>

          <q-btn
            outline
            color="primary"
            class="qr-btn full-width q-py-md"
            no-caps
            @click="startScan"
          >
            <div class="row items-center justify-center">
              <q-icon name="qr_code_scanner" size="sm" class="q-mr-md" />
              <span class="text-weight-bold">Scan Setup QR Code</span>
            </div>
          </q-btn>
        </div>

        <q-space />

        <div class="q-pb-lg">
          <q-btn
            color="primary"
            unelevated
            rounded
            :loading="loading"
            :label="
              selectedEdition === 'cloud' ? 'CONTINUE TO LOGIN' : 'CONNECT'
            "
            class="full-width text-weight-bold shadow-2"
            style="height: 50px; border-radius: 25px"
            @click="connectApi"
          />
        </div>
      </q-page>
    </q-page-container>

    <div v-if="showScanner" class="qr-reader-container">
      <div id="qr-reader"></div>
      <q-btn @click="stopScan" label="Close" class="q-mt-md" />
    </div>
  </q-layout>
</template>

<style>
.qr-reader-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--q-color-surface);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
#qr-reader {
  width: 90%;
  max-width: 500px;
}
</style>

<style scoped>
/* Segmented Control Styling */
.custom-toggle {
  border-radius: 25px;
  height: 44px;
  padding: 4px;
  cursor: pointer;
}
.bg-light-container {
  background: #e3f2fd;
}
.bg-dark-container {
  background: #1976d2;
}

.toggle-option {
  border-radius: 20px;
  font-weight: bold;
  font-size: 14px;
  transition: all 0.3s ease;
  color: #1976d2;
}
.bg-dark-container .toggle-option {
  color: white;
}
.toggle-option.active {
  background: #1976d2;
  color: white;
}
.bg-dark-container .toggle-option.active {
  background: white;
  color: #1976d2;
}

/* Cloud Illustration Badge */
.check-badge {
  bottom: 8px;
  right: 30px;
  top: 50px;
  border: 3px solid white;
  align-self: center;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

/* URL Preview Pill */
.url-preview {
  border-radius: 4px;
  min-width: 200px;
}

/* QR Button Dashed Border */
.qr-btn {
  border: 2px dashed #1976d2 !important;
  border-radius: 8px;
}

.q-header {
  box-shadow: none;
}
</style>
