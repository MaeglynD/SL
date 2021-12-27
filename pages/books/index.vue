<template>
  <!-- Loading -->
  <div v-if="pageState.state === 'loading'">
    loading books...
  </div>

  <!-- Error -->
  <div v-else-if="pageState.state === 'error'">
    Books page error: {{ pageState.errorMessage }}
  </div>

  <!-- Book list -->
  <div v-else>
    books page
    <v-btn
      v-for="book in books"
      :key="book.id"
      @click="goToBook(book.url)"
    >
      {{ book.name }}
    </v-btn>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'BooksPage',

  data: () => ({
    //
  }),

  computed: {
    ...mapState([
      'books',
      'pageState',
    ]),

    ...mapGetters([
      //
    ]),
  },

  created() {
    //
  },

  mounted() {
    //
  },

  methods: {
    ...mapActions([
      'loadBooks',
    ]),

    goToBook(url) {
      this.$router.push(`/books/${url}`);
    },
  },
};
</script>

<style scoped lang="scss">
  @import '~/assets/scss/pages/books/index.scss';
</style>
