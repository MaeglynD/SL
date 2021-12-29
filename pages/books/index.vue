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
  <div
    v-else
    class="oeuvre"
  >
    <div class="oeuvre__gradient-overlay" />

    <div class="oeuvre__header-container">
      <div class="oeuvre__header">
        Oeuvre
        <div class="oeuvre__header-background-text">
          Oeuvre
        </div>
      </div>
    </div>

    <div class="oeuvre__book-list">
      <div
        v-for="({ bookCoverUrl, name, desc, pages, url }, i) in books"
        :key="`book-${i}`"
        class="oeuvre__book-container"
        @click="goToBook(url)"
      >
        <v-img-no-referrer
          contain
          transition="fade-transition"
          :lazy-src="`${bookCoverUrl}=w200`"
          :src="`${bookCoverUrl}=w500`"
        />

        <div class="oeuvre__book-name">
          {{ name }}
        </div>

        <div class="oeuvre__book-desc">
          {{ desc }}
        </div>

        <div class="oeuvre__book-page-count">
          {{ (pages.length -2) * 2 }} pages
        </div>
      </div>
    </div>
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

  async mounted() {
    if (!this.books.length) {
      await this.loadBooks();
    }

    await Promise.allSettled(
      this.books
        .filter(({ pages }) => !pages)
        .map(({ id }) => this.loadBookPages(id)),
    );
  },

  methods: {
    ...mapActions([
      'loadBooks',
      'loadBookPages',
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
