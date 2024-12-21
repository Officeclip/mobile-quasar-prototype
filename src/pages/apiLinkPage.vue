<script setup>
import { ref, watch } from 'vue';
import { Constants } from 'src/stores/Constants';
import { useSessionStore } from 'stores/SessionStore';
import util from 'src/helpers/util';

const sessionStore = useSessionStore();

// const dotComUserApi = ref('https://app.officeclip.com/api');
const dotComUserApi = ref('https://api.officeclip.workers.dev');

// const boxVersionUserApi = ref('http://localhost/officeclip/api');
const boxVersionUserApi = ref('http://officeclip.xyz/officeclip/api');

const selectedOption = ref('2');

const inputValue = ref('');

watch(selectedOption, (newVal) => {
  inputValue.value =
    newVal === '1' ? boxVersionUserApi.value : dotComUserApi.value;
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
      </q-card>
      <!-- <q-list v-if="isSetUp">
        <q-item-label class="q-ml-md">Set the API Link</q-item-label>
        <div class="row">
          <q-item>
            <div class="col-11">
              <q-item-section>
                <q-input
                  v-model="inputValue"
                  placeholder="enter valid rest api url"
                  hint="Ex: https or http://localhost/officeclip/api"
                  type="url"
                  outlined
                  dense
                />
              </q-item-section>
            </div>
            <div class="col-1">
              <q-item-section side top>
                <q-btn
                  outline
                  color="primary"
                  no-caps
                  class="q-ml-sm"
                  rounded
                  @click="isValidRestApiUrl(inputValue)"
                  :disable="inputValue"
                  :loading="submitting"
                  >Save</q-btn
                ></q-item-section
              >
            </div>
          </q-item>
        </div>
        <q-item>
          <q-item-section>
            <q-radio
              v-model="selectedOption"
              color="red"
              keep-color
              label="Box version"
              val="1"
              size="sm"
            />
          </q-item-section>
          <q-item-section>
            <q-radio
              v-model="selectedOption"
              color="teal"
              keep-color
              label="Officeclip.com"
              val="2"
              size="sm"
            />
          </q-item-section>
        </q-item>
      </q-list> -->

      <!-- <q-dialog v-model="howToGetApi">
        <q-card>
          <q-card-section>
            Web app > Settings > Rest API screen
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              size="sm"
              label="ok"
              flat
              rounded
              dense
              v-close-popup
            ></q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog> -->
    </q-page>
  </q-page-container>
  <!-- <input type="text" v-model="inputValue" placeholder="Enter text" />
  <button @click="saveApiLinkInLocalStorage">Save</button> -->
</template>
