<script setup>
// import { yearsToMonths } from 'date-fns/esm';
import TestForm from '../components/TestForm.vue';
import dateTimeHelper from '../helpers/dateTimeHelper';

console.log(
  'Testing the date Format Conversion',
  dateTimeHelper.convertGeneralToUtc('2023-07-27 12:00 am')
);
const testObject1 = {
  id: 1,
  visibleName: 'First Name',
  //editable: true,
  //visible: true
  type: 'string',
  value: 'test',
  options: [],
};
const testObject2 = {
  id: 2,
  type: 'numeric',
  value: 5,
  options: [],
};
const testObject3 = {
  id: 3,
  type: 'select',
  value: '2',
  options: [
    {
      value: '1',
      name: 'Georgia',
    },
    {
      value: '2',
      name: 'Alabama',
    },
    {
      value: '3',
      name: 'Florida',
    },
  ],
};
const testObject4 = {
  id: 4,
  type: 'datetime',
  value: '2023-06-26T09:43:32.203Z',
  options: [],
};
const testObject5 = {
  id: 5,
  type: 'date',
  value: '2023-06-26T09:43:32.203Z',
  options: [],
};
const testObject6 = {
  id: 6,
  type: 'boolean',
  value: true,
  options: [],
};
const testObject7 = {
  id: 7,
  type: 'multi-select',
  value: ['1', '2'],
  options: [
    {
      value: '1',
      name: 'Georgia',
    },
    {
      value: '2',
      name: 'Alabama',
    },
    {
      value: '3',
      name: 'Florida',
    },
  ],
};

// show using console.log id,value

function onSubmit(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = [];
  for (const [name, value] of formData.entries()) {
    data.push({
      name,
      value,
    });
  }
  console.log(data);

  // const stringnewValue = formData.get('stringnewValue')
  // const numericnewValue = formData.get('numericnewValue')
  // const selectnewValue = formData.get('selectnewValue')
  // const multiselectnewvalue = formData.get('multi-selectnewvalue')
  // const selectbooleanValue = formData.get('selectbooleanValue')
  // const dateValue = formData.get('dateValue')

  const newStringObject = {
    id: testObject1.id,
    value: data[0].value,
  };

  const newNumericObject = {
    id: testObject2.id,
    value: data[1].value,
  };

  const newSelectObject = {
    id: testObject3.id,
    value: data[2].value,
  };
  const newdateTimeObject = {
    id: testObject4.id,
    value: parsedTime,
  };

  const newdateObject = {
    id: testObject5.id,
    value: data[4].value,
  };

  const newbooleanObject = {
    id: testObject6.id,
    value: data[5].value,
  };

  const newmultiSelectObject = {
    id: testObject7.id,
    value: data[6].value,
  };

  // const newName = 'Sample Name'

  console.log('onSubmit update stringObject is:', newStringObject);
  console.log('onSubmit update numericObject is:', newNumericObject);
  console.log('onSubmit update selectObject is:', newSelectObject);
  console.log('onSubmit update dateTimeObject is:', newdateTimeObject);
  console.log('onSubmit update dateObject is:', newdateObject);
  console.log('onSubmit update booleanObject is:', newbooleanObject);
  console.log('onSubmit update multiselectObject is:', newmultiSelectObject);
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <div class="flex flex-center">
        <q-form @submit="onSubmit" class="q-gutter-md">
          <!-- <q-input
          name = 'newName'
          class="min-width"
          type="text"
          label= 'TESTING'
          placeholder="enter task subject"
          v-model="newValue" /> -->
          <TestForm :testProps="testObject1"></TestForm>
          <TestForm :testProps="testObject2"></TestForm>
          <TestForm :testProps="testObject3"></TestForm>
          <TestForm :testProps="testObject4"></TestForm>
          <TestForm :testProps="testObject5"></TestForm>
          <TestForm :testProps="testObject6"></TestForm>
          <TestForm :testProps="testObject7"></TestForm>
          <q-btn
            class="q-ml-md q-mb-md"
            label="Submit"
            type="submit"
            color="primary"
          >
          </q-btn>
        </q-form>
      </div>
    </q-page-container>
  </q-layout>
</template>
<style scoped></style>
