<template>
  <v-app>
    <error-message :error="error" />
  </v-app>
</template>

<script>
export default {
  name: 'EmptyLayout',
  layout: 'empty',

  props: {
    error: {
      type: Object,
      default: null,
    },
  },

  data: () => ({
    //
  }),
};
</script>
