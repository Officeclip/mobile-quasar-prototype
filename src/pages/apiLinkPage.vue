<script setup>
import { ref, watch } from 'vue';
import { useSessionStore } from 'stores/SessionStore';
import util from 'src/helpers/util';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const sessionStore = useSessionStore();

const dotComUserApi = ref('https://api.officeclip.workers.dev'); // Dutta: it should be read from env.local

const boxVersionUserApi = ref('');

const selectedOption = ref('2');
const inputValue = ref('');
const readOnly = ref(false);
const bgColor = ref('');

const updateInputValue = (option) => {
  inputValue.value =
    option === '1' ? boxVersionUserApi.value : dotComUserApi.value;
  readOnly.value = option === '2';
  bgColor.value = option === '2' ? 'grey-4' : '';
};

watch(selectedOption, (newVal) => {
  updateInputValue(newVal);
});

// Initialize input values based on the default selected option
updateInputValue(selectedOption.value);

const saveApiLinkInLocalStorage = () => {
  util.setEndPointUrlInLocalStorage(inputValue.value);
  window.location.reload();
};

const submitting = ref(false);

async function isValidRestApiUrl(testUrl) {
  $q.loading.show();
  try {
    const res = await sessionStore.isValidUrl(testUrl);
    if (res) {
      saveApiLinkInLocalStorage();
    } else {
      alert('Please enter valid Rest Api Url');
    }
  } catch (error) {
    console.error(error);
  } finally {
    $q.loading.hide();
  }
}

const isIndex = ref(true);
const isSetUp = ref(false);
function getApiScreen() {
  isSetUp.value = true;
  isIndex.value = false;
}

const redirectToSetUpAccount = () => {
  window.location.href = 'https://app.officeclip.com';
};
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center">
        <q-card
          v-if="isIndex"
          flat
          bordered
          class="q-ma-md shadow-2"
          style="max-width: 420px"
        >
          <q-card-section class="bg-grey-2 rounded-borders">
            <div class="text-h6 q-mb-xs">Welcome to OfficeClip Mobile</div>
            <div class="text-body2">
              Manage your business on the go: access contacts, projects,
              timesheets, and more.<br />
              Seamless integrations with Google, Outlook, and other systems.
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div class="text-subtitle2 text-weight-medium q-mb-sm">
              Available in two editions:
            </div>
            <q-list dense>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="star_border" color="primary" />
                </q-item-section>
                <q-item-section> Free Basic edition </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="workspace_premium" color="amber" />
                </q-item-section>
                <q-item-section> Enterprise edition </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div class="q-mb-sm">
              <span>Learn more and sign up at</span>
              <q-btn
                color="primary"
                no-caps
                flat
                dense
                class="q-ml-xs"
                @click="redirectToSetUpAccount"
                >officeclip.com</q-btn
              >
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              icon-right="arrow_forward"
              color="primary"
              unelevated
              rounded
              @click="getApiScreen()"
              >Next</q-btn
            >
          </q-card-actions>
        </q-card>

        <div v-if="isSetUp">
          <q-card class="q-ma-md shadow-2" style="max-width: 420px">
            <q-card-section class="bg-grey-2 rounded-borders">
              <div class="text-h6 q-mb-xs">API Link Setup</div>
              <div class="text-body2">
                Configure your OfficeClip API endpoint to connect your mobile
                app.<br />
                Choose your edition and enter the appropriate API URL.
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <div class="row items-center q-col-gutter-md">
                <div class="col-9 q-mb-xs">
                  <q-input
                    v-model="inputValue"
                    placeholder="Enter valid REST API URL"
                    hint="e.g. https://your-site/officeclip/api"
                    type="url"
                    outlined
                    dense
                    :readonly="readOnly"
                    :bg-color="bgColor"
                    class="full-width"
                    :rules="[(val) => !!val || 'API URL is required']"
                    clearable
                  >
                    <template #prepend>
                      <q-icon name="link" color="primary" />
                    </template>
                  </q-input>
                </div>
                <div class="col-3 flex flex-center">
                  <q-btn
                    color="primary"
                    label="Submit"
                    @click="isValidRestApiUrl(inputValue)"
                    :disable="!inputValue"
                    :loading="submitting"
                    unelevated
                    rounded
                    class="full-width q-mb-lg"
                  />
                </div>
              </div>
            </q-card-section>
            <q-card-section class="flex justify-between q-py-sm">
              <q-radio
                v-model="selectedOption"
                color="teal"
                keep-color
                label="OfficeClip Cloud"
                val="2"
                size="sm"
              />
              <q-radio
                v-model="selectedOption"
                color="red"
                keep-color
                label="Self-Hosted"
                val="1"
                size="sm"
              />
            </q-card-section>
            <q-separator />
            <q-card-section
              v-if="selectedOption === '1'"
              class="bg-grey-1 rounded-borders"
            >
              <div class="text-subtitle2 text-weight-medium q-mb-xs">
                How to find your custom API URL:
              </div>
              <ol class="q-pl-md q-mb-none">
                <li>Login to OfficeClip on a desktop browser.</li>
                <li>Click your profile picture at the top right.</li>
                <li>Select <b>Mobile</b> to view your API URL.</li>
              </ol>
            </q-card-section>
          </q-card>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
