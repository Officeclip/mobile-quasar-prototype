<script setup>
import { ref, watch, onMounted } from 'vue';
import { Constants } from 'src/stores/Constants';

const dotComUserApi = ref('https://app.officeclip.com/api');
const boxVersionUserApi = ref('http://192.168.29.207/officeclip/api');
const selectedOption = ref('2');
const inputValue = ref('https://app.officeclip.com/api');

watch(selectedOption, (newVal) => {
  inputValue.value =
    newVal === '1' ? boxVersionUserApi.value : dotComUserApi.value;
});

// onMounted(() => {
//   localStorageValue.value = localStorage.getItem('endPointUrl');
// });

const saveApiLinkInLocalStorage = () => {
  Constants.saveEndPointUrlInLocalStorage(inputValue.value);
  window.location.reload();
  // localStorageValue.value = inputValue.value; // Update the displayed value
};

const howToGetApi = ref(false);

// function isValidUrl(url) {
//   const regex =
//     /^(https?:\/\/)(www\.)?([a-zA-Z0-9][a-zA-Z0-9-]+)(\.[a-zA-Z]{2,})+(\/[^\s]*)?$/;
//   return regex.test(url);
// }
async function isValidUrlWithPartialCheck(urlString) {
  try {
    const response = await fetch(urlString, { method: 'HEAD' }); // Use HEAD for efficiency
    return response.ok; // true if status code is 200-299
  } catch (error) {
    console.error('Error checking URL:', error);
    return false;
  }
}

const testUrl = 'https://www.officeclip.com';

onMounted(async () => {
  const xyz = await isValidUrlWithPartialCheck(testUrl);
  if (xyz) {
    console.log('API URL is valid and reachable.', xyz);
    // Proceed to login screen
  } else {
    console.log('API URL is invalid or unreachable.', xyz);
    // Display an error message to the user
  }
});
</script>

<template>
  <q-page-container>
    <q-page class="flex flex-center">
      <q-list>
        <q-item-label class="q-ml-md">Set the API Link</q-item-label>
        <q-item>
          <q-input
            style="min-width: 250px"
            v-model="inputValue"
            placeholder="enter valid API Link"
            type="url"
            outlined
            dense
          />
          <q-btn
            outline
            color="primary"
            no-caps
            class="q-ml-sm"
            rounded
            @click="saveApiLinkInLocalStorage"
            >Save</q-btn
          >
        </q-item>
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
        <q-separator inset></q-separator>
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
        </div>
      </q-list>

      <q-dialog v-model="howToGetApi">
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
      </q-dialog>
    </q-page>
  </q-page-container>
  <!-- <input type="text" v-model="inputValue" placeholder="Enter text" />
  <button @click="saveApiLinkInLocalStorage">Save</button> -->
</template>
