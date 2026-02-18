<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const slide = ref('crm');
</script>

<template>
  <q-page class="column items-center">
    <!-- SECTION: Header -->
    <div class="header-decoration text-white text-center q-pt-md q-pb-xl">
      <q-avatar size="60px" font-size="52px">
        <img src="/AppIcon.png" />
      </q-avatar>
      <h5 class="text-weight-bold q-mt-md q-mb-xs">OfficeClip</h5>
      <div class="text-subtitle1">Your business management companion</div>
    </div>
    <!-- END SECTION: Header -->

    <!-- This spacer creates space for the overlapping card -->
    <div style="height: 40px"></div>

    <!-- SECTION: Main Content -->
    <!-- A negative margin pulls the card up to create an overlap effect -->
    <div class="main-content col flex flex-center items-center q-px-md">
      <div>
        <q-card class="welcome-card shadow-5">
          <q-carousel
            v-model="slide"
            animated
            infinite
            autoplay
            arrows
            navigation
            transition-prev="slide-right"
            transition-next="slide-left"
            height="200px"
            control-color="primary"
          >
            <q-carousel-slide
              name="crm"
              class="column flex-center text-center q-px-md slide-content"
            >
              <div class="text-h6 text-weight-medium">Manage Contacts</div>
              <p
                class="text-body2 q-mt-sm"
                :class="$q.dark.isActive ? 'text-grey-5' : 'text-grey-7'"
              >
                Access your CRM database<br />from anywhere, anytime.
              </p>
            </q-carousel-slide>

            <q-carousel-slide
              name="time"
              class="column flex-center text-center q-px-md slide-content"
            >
              <div class="text-h6 text-weight-medium">Track Time</div>
              <p
                class="text-body2 q-mt-sm"
                :class="$q.dark.isActive ? 'text-grey-5' : 'text-grey-7'"
              >
                Log hours and expenses<br />straight from your device.
              </p>
            </q-carousel-slide>

            <q-carousel-slide
              name="tasks"
              class="column flex-center text-center q-px-md slide-content"
            >
              <div class="text-h6 text-weight-medium">Project Tasks</div>
              <p
                class="text-body2 q-mt-sm"
                :class="$q.dark.isActive ? 'text-grey-5' : 'text-grey-7'"
              >
                Keep your team in sync<br />and meet every deadline.
              </p>
            </q-carousel-slide>
          </q-carousel>
        </q-card>
        <div class="q-mt-lg">
          <q-banner
            rounded
            dense
            style="max-width: 420px"
            :class="$q.dark.isActive ? 'text-grey-5' : 'text-grey-9 bg-blue-1'"
          >
            <template v-slot:avatar>
              <q-icon name="info_outline" />
            </template>
            This app is a companion to your OfficeClip web account. An existing
            account is required to use this app.
          </q-banner>
        </div>
      </div>
    </div>
    <!-- END SECTION: Main Content -->

    <!-- This spacer pushes the button to the bottom -->
    <q-space />

    <!-- SECTION: Footer Button -->
    <div class="q-pa-lg full-width" style="max-width: 420px">
      <q-btn
        class="full-width text-weight-bold shadow-2"
        style="height: 50px; border-radius: 25px"
        color="primary"
        unelevated
        rounded
        label="GET STARTED"
        :to="{ name: 'apisetup' }"
      />
    </div>
    <!-- END SECTION: Footer Button -->
  </q-page>
</template>

<style scoped>
/* .welcome-page-bg {
  background-color: #f0f4f8;
} */

.header-decoration {
  background: #1976d2;
  /* Creates a sweeping curve */
  border-bottom-left-radius: 50% 40px;
  border-bottom-right-radius: 50% 40px;
  width: 100%;
}

.main-content {
  width: 100%;
  z-index: 1;
  /* Ensures content stays on top */
}

.welcome-card {
  width: 100%;
  max-width: 420px;
  border-radius: 16px;
  overflow: hidden;
  /* Ensures content respects the border radius */
}

.slide-content {
  padding-bottom: 32px;
  /* Adds space for carousel navigation dots */
}

/* .border-primary {
  border: 1px solid var(--q-primary);
  border-radius: 16px;
} */
</style>
