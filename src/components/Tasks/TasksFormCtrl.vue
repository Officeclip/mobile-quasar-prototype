<script setup>
import { defineProps, ref, computed } from 'vue';
import dateTimeHelper from '../../helpers/dateTimeHelper';

const options = ref([]);
options.value = [
  {
    label: 'Yes',
    value: true,
  },
  {
    label: 'No',
    value: false,
  },
];

const statusOptions = ref([]);
statusOptions.value = [
  'Open', 'Close', 'Pending','Completed'
]

const priorityOptions = ref([]);
priorityOptions.value = [
  'High', 'Low', 'Middle','Other'
]

const taskTypeOptions = ref([]);
taskTypeOptions.value = [
  'Todo', 'Pending','Other'
]

const props = defineProps(['task']);

const isPrivate = ref('');
console.log(`props.task: ${props.task}`);

const dueDate = ref('');
const startDate = ref('');

// eslint-disable-next-line vue/no-setup-props-destructure
dueDate.value = props.task.dueDate
// eslint-disable-next-line vue/no-setup-props-destructure
startDate.value = props.task.startDate

const formattedDueDate = computed(() => {
  let dateValue = dateTimeHelper.extractDateFromUtc(dueDate.value);
  return dateValue;
})

const formattedDueDate2 = dueDate.value? formattedDueDate: dueDate;


const formattedStartDate = computed(() => {
  let dateValue = dateTimeHelper.extractDateFromUtc(startDate.value);
  return dateValue;
})

const formattedStartDate2 = startDate.value? formattedStartDate: startDate;

isPrivate.value = props.task.isPrivate ? 'Yes' : 'No';
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <div>
    <div class="q-pa-md">
      <div class="q-gutter-y-md column">
        <q-input
          v-model="task.subject"
          label="Subject"
          placeholder="enter task subject"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        >
        </q-input>

        <q-editor
          class="q-mt-none"
          v-model="task.description"
          label="Description"
          paragraph-tag="div"
          placeholder="type here...."
        ></q-editor>



        <q-input name="dueDate" v-model="formattedDueDate2" label="Due Date">
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="dueDate" mask= 'YYYY-MM-DD'>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

          <!-- <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="dueDateTime" mask='YYYY-MM-DD HH:mm'>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template> -->
        </q-input>

        <q-input
        name="startDate" v-model="formattedStartDate2" label="Start Date">
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="startDate" mask= 'YYYY-MM-DD'>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

          <!-- <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="startDateTime" mask='YYYY-MM-DD HH:mm'>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template> -->
        </q-input>

        <q-select
          v-model="task.taskTypeName"
          :options="taskTypeOptions"
          option-value="id"
          map-options
          emit-label
          label="Task Type"
        />

        <q-select
          v-model="task.taskPriorityName"
          :options="priorityOptions"
          option-value="id"
          map-options
          emit-label
          label="Priority"
        />

        <q-select
          v-model="task.taskStatusName"
          :options="statusOptions"
          option-value="id"
          map-options
          emit-label
          label="Status"
        />

        <q-select
          v-model="task.isPrivate"
          :options="options"
          map-options
          emit-value
          label="Private"
        />
        <q-input
          v-model="task.taskOwnerName"
          label="Owner"
          placeholder="enter here..."
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        >
        </q-input>
      </div>
    </div>
  </div>
</template>
