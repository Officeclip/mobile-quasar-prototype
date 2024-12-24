<script setup>
import { ref, watch } from 'vue';
import { useSessionStore } from 'stores/SessionStore';
import util from 'src/helpers/util';

const sessionStore = useSessionStore();

const dotComUserApi = ref('https://api.officeclip.workers.dev');

const boxVersionUserApi = ref('');

const selectedOption = ref('2');
const inputValue = ref(dotComUserApi.value);
const readOnly = ref(false);
const bgColor = ref('');

watch(selectedOption, (newVal) => {
  inputValue.value =
    newVal === '1' ? boxVersionUserApi.value : dotComUserApi.value;
  readOnly.value = newVal === '2' ? true : false;
  bgColor.value = newVal === '2' ? 'grey-4' : '';
});

const saveApiLinkInLocalStorage = () => {
  util.setEndPointUrlInLocalStorage(inputValue.value);
  window.location.reload();
};

// const howToGetApi = ref(false);
const submitting = ref(false);

function simulateSubmit() {
  submitting.value = true;
  setTimeout(() => {
    submitting.value = false;
  }, 3000);
}

async function isValidRestApiUrl(testUrl) {
  simulateSubmit();
  const res = await sessionStore.isValidUrl(testUrl);
  if (res) {
    saveApiLinkInLocalStorage();
  } else {
    alert('Please enter valid Rest Api Url');
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
        <q-card v-if="isIndex" flat bordered class="q-mx-sm">
          <q-card-section>
            Manage your business on the go with OfficeClip Mobile access
            contacts, projects, timesheets, and more. <br />
            Integrations with Google, Outlook, and other systems.
          </q-card-section>
          <q-card-section>
            <p class="text-subtitle2">Available in two editions:</p>
            <ol>
              <li>Free Basic edition</li>
              <li>Enterprise edition</li>
            </ol>
          </q-card-section>
          <q-card-section>
            Learn more and sign up at
            <q-btn
              color="primary"
              class="q-pa-none"
              no-caps
              flat
              dense
              @click="redirectToSetUpAccount"
              >officeclip.com</q-btn
            >
          </q-card-section>
          <q-card-actions align="right">
            <q-btn outline dense no-caps class="q-ml-sm" @click="getApiScreen()"
              >Next</q-btn
            >
          </q-card-actions>
        </q-card>

        <q-card v-if="isSetUp">
          <q-card-section>
            <p class="text-subtitle2">Set the API Link:</p>
            <div class="row">
              <q-item-section>
                <q-input
                  style="min-width: 250px"
                  v-model="inputValue"
                  placeholder="enter valid rest api url"
                  hint="Ex: https/your-site/officeclip/api"
                  type="url"
                  outlined
                  hide-bottom-space
                  dense
                  autogrow
                  :readonly="readOnly"
                  :bg-color="bgColor"
              /></q-item-section>
              <q-item-section side top>
                <q-btn
                  outline
                  color="primary"
                  no-caps
                  rounded
                  @click="isValidRestApiUrl(inputValue)"
                  :disable="inputValue"
                  :loading="submitting"
                  >Save</q-btn
                ></q-item-section
              >
            </div>
          </q-card-section>
          <q-card-section class="flex justify-between">
            <q-radio
              v-model="selectedOption"
              color="red"
              keep-color
              label="Installed on our machine"
              val="1"
              size="sm"
            />
            <q-radio
              v-model="selectedOption"
              color="teal"
              keep-color
              label="Using from Officeclip.com"
              val="2"
              size="sm"
            />
          </q-card-section>

          <q-card-section v-if="selectedOption === '1'">
            <p>To find your customized url(password-less login):</p>
            <ol>
              <li>Login to OfficeClip on a desktop browser</li>
              <li>Click on the picture at top right</li>
              <li>Click the Mobile button</li>
            </ol>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
