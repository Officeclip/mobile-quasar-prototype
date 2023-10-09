<script lang="ts" setup>
import {ref} from 'vue';

const advancedOptions = ref({
  dueDateValue: '',
  dueDateOption: '',
  modifiedDateValue: '',
  modifiedDateOption: '',
  statusValue: '',
  priorityValue: '',
  assignedTo: '',
  ownedBy: '',
  regarding: ''
})

const dateOptions = [
  {label: "Equal To", value: "EqualTo"},
  {label: "Not Equal To", value: "NotEqualTo"},
  {label: "Greater Than", value: "GreaterThan"},
  {label: "Less Than", value: "LessThan"},
  {label: "Greater Than or Equal To", value: "GreaterOrEqual"},
  {label: "Less Than or Equal To", value: "LessOrEqual"},
  {label: "Is Null", value: "isNull"},
  {label: "Is Not Null", value: "isNotNull"},
]

</script>

<template>
  <q-card style="width: 700px; max-width: 80vw;">

    <div class="q-pa-md row">
      <q-item-section>
        <q-item-label>Due Date</q-item-label>
        <q-input
          v-model="advancedOptions.dueDateValue"
          clearable
          label="Due Date"
          outlined
          type="date"
        />
        <q-select v-model="advancedOptions.dueDateOption" :options="dateOptions"/>
      </q-item-section>

      <q-item-section>
        <q-item-label>Modified Date</q-item-label>
        <q-input
          v-model="advancedOptions.modifiedDateValue"
          clearable
          label="Modified Date"
          outlined
          type="date"
        />
        <q-select v-model="advancedOptions.modifiedDateOption" :options="dateOptions"/>
      </q-item-section>

      <q-select model-value=""
    </div>


    <q-card-actions>
      <q-btn v-close-popup color="primary" label="Save"/>
    </q-card-actions>
  </q-card>

</template>

<style scoped>
.select-spacing {
  margin: 5px; /* Adjust the margin as needed */
}
</style>
