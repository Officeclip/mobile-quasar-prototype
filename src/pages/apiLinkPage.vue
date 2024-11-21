<script setup>
import { ref, watch } from 'vue';
import { Constants } from 'src/stores/Constants';
import { useSessionStore } from 'stores/SessionStore';

const sessionStore = useSessionStore();

const dotComUserApi = ref('https://app.officeclip.com/api');

const boxVersionUserApi = ref('http://localhost/officeclip/api');

const selectedOption = ref('2');

const inputValue = ref('');

watch(selectedOption, (newVal) => {
  inputValue.value =
    newVal === '1' ? boxVersionUserApi.value : dotComUserApi.value;
});

const saveApiLinkInLocalStorage = () => {
  Constants.saveEndPointUrlInLocalStorage(inputValue.value);
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
</script>

<template>
  <q-page-container>
    <q-page class="flex flex-center">
      <q-list>
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
        <!-- <q-separator inset></q-separator>
        <div>
          <q-item>
            <q-btn
              flat
              no-caps
              size="sm"
              rounded
              color="primary"
              label="how to get the API Link"
              @click="howToGetApi = true"
              dense
            ></q-btn
          ></q-item>
        </div> -->
      </q-list>

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
