<script lang="ts" setup>
import {subTask} from "src/models/task/subtask";

const props = defineProps<{
  subtask: subTask
}>();
</script>

<template>
  <q-item>
    <q-item-section avatar top>
      <q-icon v-if="!subtask.isCompleted" color="grey-8" name="hourglass_top" size="34px"/>
      <q-icon v-if="subtask.isCompleted" color="green-9" name="done_all" size="34px"/>
    </q-item-section>


    <q-item-section top>
      <q-item-label lines="1">
        <span class="text-weight-medium">{{ subtask.title }}</span>
        <span class="text-grey-8"> - {{ subtask.assignee.name }}    </span>
      </q-item-label>
      <q-item-label caption lines="1"> {{ subtask.description }}</q-item-label>
      <q-item-label class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase" lines="1">
        <span class="cursor-pointer">Open</span>
      </q-item-label>
    </q-item-section>

    <q-item-section side top>
      <div class="text-grey-8 q-gutter-xs">
        <q-btn dense flat icon="delete" round size="12px"/>
        <q-btn dense flat icon="done" round size="12px"/>
      </div>
    </q-item-section>
  </q-item>
</template>

