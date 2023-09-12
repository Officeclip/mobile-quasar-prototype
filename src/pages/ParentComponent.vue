<!-- Parent component -->
<template>
  <div>
    <child-form></child-form>
  </div>
</template>

<script>
import { ref } from 'vue';
import ChildForm from '../components/ChildForm.vue';

export default {
  components: {
    ChildForm,
  },
  setup() {
    const name = ref('');

    const onSubmit = () => {
      console.log(name.value); // The form data
    };

    return {
      name,
      onSubmit,
    };
  },
};
</script>
