<script setup lang="ts">
function redirectToSignup() {
  window.open('https://app.officeclip.com', '_blank');
}
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center bg-grey-2 row">
        <q-card flat class="q-ma-md col-10 col-md-6">
          <q-card-section class="bg-primary text-white text-center">
            <q-avatar size="56px">
              <q-img src="/my-app-icon.png" />
              <!-- <q-icon name="business" size="28px" /> -->
            </q-avatar>
            <!-- <div class="text-h5 text-weight-bold q-mb-xs">
              Welcome to OfficeClip Mobile
            </div> -->
            <h6 class="q-ma-sm">Welcome to OfficeClip</h6>
            <div class="text-body2 text-blue-2">
              Your business management companion
            </div>
          </q-card-section>

          <q-card-section class="q-pa-md">
            <div class="text-body2 q-mb-lg">
              Manage your business on the go with seamless access to contacts,
              projects, timesheets, and comprehensive integrations with Google,
              Outlook, and other enterprise systems.
            </div>

            <div class="text-subtitle2 text-weight-medium q-mb-md text-primary">
              Available Editions:
            </div>
            <q-list>
              <q-item class="bg-blue-1 q-mb-sm">
                <q-item-section avatar>
                  <q-icon name="star_border" color="primary" />
                </q-item-section>
                <q-item-section> Free Basic edition </q-item-section>
              </q-item>
              <q-item class="bg-amber-1">
                <q-item-section avatar>
                  <q-icon name="workspace_premium" color="amber" />
                </q-item-section>
                <q-item-section> Enterprise edition </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <q-separator />

          <q-card-section class="text-center q-pa-md">
            <div class="q-mb-md">
              <span class="text-body2 text-grey-7">
                Learn more and create your account at
              </span>
              <q-btn
                color="primary"
                no-caps
                flat
                dense
                @click="redirectToSignup"
              >
                officeclip.com
              </q-btn>
            </div>
          </q-card-section>

          <q-card-actions align="right" class="q-px-lg">
            <q-btn
              color="primary"
              unelevated
              rounded
              size="md"
              class="q-px-xl"
              :to="{ name: 'apisetup' }"
            >
              Get Started
              <q-icon right name="arrow_forward" />
            </q-btn>
          </q-card-actions>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
