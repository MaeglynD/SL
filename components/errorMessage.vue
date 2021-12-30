<template>
  <div class="global__error">
    Sorry, looks like an error occured :(
    <code>
      {{ errorMessage }}
    </code>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    error: {
      type: Object,
      default: null,
    },
  },

  data: () => ({
    //
  }),

  computed: {
    ...mapState([
      'pageState',
    ]),

    errorMessage() {
      const { error, pageState } = this;

      return error?.message ? error.message : pageState.errorMessage;
    },
  },

  methods: {
    //
  },
};
</script>

<style scoped lang="scss">
//
</style>
