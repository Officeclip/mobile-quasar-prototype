<!-- Child form component -->
<template>
  <form @submit.prevent="onSubmit">
    <input type="text" v-model="name">
    <input type="submit" value="Submit">
  </form>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const name = ref('');

    const onSubmit = () => {
      name.value = ''; // Clear the form data
    };

    return {
      name,
      onSubmit,
    };
  },
};
</script>
