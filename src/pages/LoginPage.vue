<script setup lang="ts">
import { ref } from 'vue';

//console.log('API EndPoint: ', import.meta.env.VITE_API_ENDPOINT);

const form = ref({
  email: {
    value: '',
    email: true,
    required: true,
    error: false,
    msg: '',
  },
  password: {
    value: '',
    required: true,
    error: false,
    msg: '',
  },
});

const submitLogin = () => {
  // do nothing.
};
</script>

<template>
  <q-layout>
    <q-page-container>
      <q-page padding>
        <div class="row">
          <div class="col-12 col-md-4 col-lg-4 q-pd-md">
            <div class="text-h4 text-bold">Login OfficeClip</div>
            <div class="text-grey-7">Please Login to your account</div>
            <div class="column">
              <q-input
                v-model="form.email.value"
                outline
                type="text"
                label="Enter email *"
                :error="form.email.error"
                :error-message="form.email.msg"
              >
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>
              <q-input
                v-model="form.password.value"
                outline
                type="text"
                label="Enter password *"
                :error="form.password.error"
                :error-message="form.password.msg"
                class="q-mt-md"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
                <template v-slot:append>
                  <q-icon name="visibility_off" />
                </template>
              </q-input>
            </div>
            <div class="column q-mt-md">
              <q-btn color="indigo" label="Login" @click="submitLogin" />
            </div>

            <div class="column">
              <q-btn
                :to="{ name: 'homePage' }"
                color="primary"
                label="Goto Home"
              />
            </div>
            <div class="column m-t-md">
              <q-btn
                :to="{
                  name: 'testMe',
                  params: {
                    id: 1,
                  },
                }"
                label="Test Me"
              />
            </div>
            <div class="column m-t-md">
              <q-btn
                :to="{
                  name: 'timesheetL',
                  params: {
                    id: 1,
                  },
                }"
                label="Timesheet List"
              />
            </div>
            <div class="column m-t-md">
              <q-btn
                :to="{
                  name: 'incrementalLoading',
                  // params: {
                  //   id: 1,
                  // },
                }"
                label="Incremental List"
              />
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
