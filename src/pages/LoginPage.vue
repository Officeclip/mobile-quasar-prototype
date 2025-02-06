<script setup lang="ts">
import { Ref, ref, onMounted, onBeforeUnmount } from 'vue';
import { Login } from '../models/login';
import { useSessionStore } from 'stores/SessionStore';
import { useTokenStore } from '../stores/tokenStore';
import { useVuelidate } from '@vuelidate/core';
import { email, required } from '@vuelidate/validators';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { Constants } from 'src/stores/Constants';
import logger from 'src/helpers/logger';
import util from 'src/helpers/util';
import apiLinkPage from 'src/pages/apiLinkPage.vue';

const sessionStore = useSessionStore();
const tokenStore = useTokenStore();
const route1 = useRouter();

const addressBarUrl = window.location.href;

const login: Ref<Login> = ref({
  userName: Constants.defaultLogin,
  password: '',
  mpin: '',
});

const mPin = ref<string | null>(null);
function getMpin() {
  const uri = addressBarUrl.split('?');
  if (uri.length >= 2) {
    return uri[1];
  }
  return null;
}

const rules = {
  userName: { required, email },
  password: { required },
};

const v$ = useVuelidate(rules, login);
const $q = useQuasar();

async function onSubmit(e: any) {
  e.preventDefault();
  $q.loading.show({
    delay: 400, // ms
  });
  try {
    const isFormCorrect = await v$.value.$validate();
    if (!isFormCorrect) {
      for (var key in v$.value.$errors) {
        const error = v$.value.$errors[key];
        $q.notify({
          message: `${error.$property}: ${error.$message}`,
          color: 'red',
        });
      }
      return;
    }
    await tokenStore.validateLogin(login.value, mPin.value);
    route1.push('/HomePage');
  } catch (error) {
    $q.loading.hide();
    $q.notify({
      message: error as string,
      color: 'red',
    });
  }
}

onBeforeUnmount(() => {
  $q.loading.hide();
});

onMounted(async () => {
  localStorage.removeItem('X-Token');
  sessionStorage.removeItem('oc-session');

  // set the local storage endpoint url
  // if (pin.value) {
  //   try {
  //     await tokenStore.validateLogin(login.value, pin.value);
  //     await sessionStore.getSession();
  //     route1.push('/HomePage');
  //   } catch (error) {
  //     $q.notify({
  //       message: error as string,
  //       color: 'red',
  //     });
  //   }
  // }
  mPin.value = getMpin();
  if (mPin.value) {
    localStorage.removeItem('endPointUrl');
    // const endPointUrl = util.getEndPointUrlFromUri(addressBarUrl);
    // Constants.saveEndPointUrlInLocalStorage(endPointUrl);
    util.setEndPointUrlInLocalStorageFromPageUri(addressBarUrl);
    try {
      await tokenStore.validateLogin(login.value, mPin.value);
      await sessionStore.getSession();
      route1.push('/HomePage');
    } catch (error) {
      $q.notify({
        message: error as string,
        color: 'red',
      });
    }
  }
  logger.log(`PIN is: ${mPin.value}`, 'warn');
});

// util.setEndPointUrlInLocalStorageFromPageUri(window.location.href);
util.setEndPointUrlInLocalStorageFromPageUri(addressBarUrl);

const redirectToSetUpAccount = () => {
  window.location.href = 'https://app.officeclip.com/setupsite.aspx';
};
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center bg-grey-2">
        <div v-if="!util.getEndPointUrl()">
          <apiLinkPage />
        </div>

        <div v-else>
          <q-card class="q-pa-md shadow-2 my_card" bordered>
            <q-form @submit="onSubmit" v-if="!mPin">
              <q-card-section class="text-center">
                <div class="text-grey-9 text-h5 text-weight-bold">Sign in</div>
                <div class="text-grey-8">
                  Sign in below to access your account
                </div>
              </q-card-section>
              <q-card-section>
                <q-item
                  ><q-input
                    class="col"
                    maxlength="450px"
                    outlined
                    v-model="login.userName"
                    label="Email Address"
                    :rules="['email']"
                    hide-bottom-space
                    error-message="Please enter a valid email address"
                    type="email"
                  ></q-input
                ></q-item>
                <q-item
                  ><q-input
                    class="col"
                    outlined
                    v-model="login.password"
                    type="password"
                    label="Password"
                    :rules="[
                      (val: any) =>
                        (val && val.length > 0) || 'Please enter password',
                    ]"
                    hide-bottom-space
                  ></q-input
                ></q-item>
              </q-card-section>
              <q-card-section>
                <q-item>
                  <q-btn
                    color="dark"
                    label="Sign in"
                    no-caps
                    class="full-width"
                    type="submit"
                  ></q-btn>
                </q-item>
              </q-card-section>
              <q-item>
                <div class="row items-center">
                  <div>
                    <q-item-section
                      ><q-item-label caption
                        >Your linked Api Url is:</q-item-label
                      ></q-item-section
                    >
                  </div>
                  <div>
                    <q-item-section>
                      <q-item-label class="q-ml-sm">{{
                        util.getEndPointUrl()
                      }}</q-item-label></q-item-section
                    >
                  </div>
                </div></q-item
              >
              <q-card-section class="text-center q-pt-none">
                <div class="text-grey-8">
                  Don't have an account yet?
                  <q-btn
                    color="primary"
                    class="text-bold q-pa-none"
                    no-caps
                    flat
                    @click="redirectToSetUpAccount"
                    >Sign up</q-btn
                  >
                </div>
                <!-- <pre>ZZZZ:{{ util.isHideTestPage() }}</pre> -->
                <div v-if="util.isHideTestPage()">
                  <q-btn
                    :to="{
                      name: 'loginPage2',
                    }"
                    color="dark"
                    size="md"
                    label="Test page"
                    no-caps
                    class="full-width"
                    type="submit"
                  ></q-btn>
                </div>
              </q-card-section>
            </q-form>
          </q-card>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<style>
.my_card {
  width: 25rem;
  border-radius: 8px;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1),
    0 8px 10px -6px rgb(0 0 0 / 0.1);
}
</style>
