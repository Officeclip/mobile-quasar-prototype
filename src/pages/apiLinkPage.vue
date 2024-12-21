<script setup>
import { ref, watch, onMounted } from 'vue';
import { useSessionStore } from 'stores/SessionStore';
import util from 'src/helpers/util';

const sessionStore = useSessionStore();

const dotComUserApi = ref('');

const boxVersionUserApi = ref('');

const selectedOption = ref('2');
const inputValue = ref('');
const readOnly = ref(false);
const bgColor = ref('');
// onMounted(() => {
inputValue.value = util.getEndPointUrl();
console.log('test the get api url', util.getEndPointUrl());
// });

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
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center">
        <q-card v-if="isIndex" flat bordered class="q-mx-sm">
          <q-card-section>
            Provides smartphone access to OfficeClip suite of business software.
            Allows managing contacts, customers, projects, timesheets, expenses,
            support issues and invoices. Integrates with Google Contacts, Google
            Calendar, Outlook, QuickBooks, Sage 50, ADP and other systems.
          </q-card-section>
          <q-card-section>
            <p class="text-subtitle2">Available in two editions:</p>
            <ol>
              <li>Basic - Free for 10 users</li>
              <li>
                Enterprise - Has all the advanced features. See the feature page
                for details
              </li>
            </ol>
          </q-card-section>
          <q-card-section>
            <p>
              <span class="text-negative text-subtitle2"> Note:</span>
              OfficeClip Account is Required. If You Do Not Have it, Please
              Visit OfficeClip.com Using a Desktop Browser to Create a Free
              Account.
            </p>
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
                  hint="Ex: https or http://localhost/officeclip/api"
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
              label="Box version"
              val="1"
              size="sm"
            />
            <q-radio
              v-model="selectedOption"
              color="teal"
              keep-color
              label="Officeclip.com"
              val="2"
              size="sm"
            />
          </q-card-section>

          <q-card-section>
            <p>To find your customized url:</p>
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
