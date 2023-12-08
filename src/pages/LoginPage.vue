<script setup lang="ts">
import { Ref, ref } from 'vue';
import { Login } from '../models/login';
import { useSessionStore } from 'stores/SessionStore';
import { useTokenStore } from '../stores/tokenStore';
import { Constants } from 'src/stores/Constants';
import { useVuelidate } from '@vuelidate/core';
import { email, required } from '@vuelidate/validators';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const sessionStore = useSessionStore();
const tokenStore = useTokenStore();
const route1 = useRouter();

const login: Ref<Login> = ref({
  userName: 'ocdemo@officeclip.com',
  password: 'qa123',
});

const rules = {
  userName: { required, email },
  password: { required },
};

const v$ = useVuelidate(rules, login);
const $q = useQuasar();

async function onSubmit(e: any) {
  e.preventDefault();
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
    //debugger;
    await tokenStore.validateLogin(login.value);
    await sessionStore.getSession();
    //debugger;
    // const token = tokenStore.Token;
    // if (token) {
    //   Constants.saveAuthorizationTokenInLocalStorage(
    //     token.token,
    //     token.expirationUnixEpoch
    //   );
    // } else {
    //   throw new Error('Could not get the token');
    // }
    route1.push('/HomePage');
  } catch (error) {
    $q.notify({
      message: error as string,
      color: 'red',
    });
  }
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center bg-grey-2">
        <q-card class="q-pa-md shadow-2 my_card" bordered>
          <q-form @submit="onSubmit">
            <q-card-section class="text-center">
              <div class="text-grey-9 text-h5 text-weight-bold">Sign in</div>
              <div class="text-grey-8">
                Sign in below to access your account
              </div>
            </q-card-section>
            <q-card-section>
              <q-input dense outlined v-model="login.userName" label="Email Address"></q-input>
              <q-input dense outlined class="q-mt-md" v-model="login.password" type="password" label="Password"></q-input>
            </q-card-section>
            <q-card-section>
              <q-btn style="border-radius: 8px" color="dark" rounded size="md" label="Sign in" no-caps class="full-width"
                type="submit"></q-btn>
            </q-card-section>
            <q-card-section class="text-center q-pt-none">
              <div class="text-grey-8">
                Don't have an account yet?
                <a href="#" class="text-dark text-weight-bold" style="text-decoration: none">Sign up.</a>
              </div>
            </q-card-section>
          </q-form>
        </q-card>
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
