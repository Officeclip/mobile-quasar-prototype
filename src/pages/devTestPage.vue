<script lang="ts" setup></script>

<template>
  <q-layout>
    <q-page-container>
      <q-page padding>
        <div class="flex flex-center column">
          <q-btn
            :to="{
              name: 'testMe',
              params: {
                id: 1,
              },
            }"
            label="Test Me"
          />
          <q-btn
            :to="{
              name: 'loginPage',
              params: {
                id: 1,
              },
            }"
            label="Go To Login Page"
          />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
