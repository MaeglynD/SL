<template>
  <!-- Loading -->
  <div v-if="pageState.state === 'loading'">
    loading books...
  </div>

  <!-- Error -->
  <div v-else-if="pageState.state === 'error'">
    Book page error: {{ pageState.errorMessage }}
  </div>

  <!-- Book list -->
  <div
    v-else-if="book"
    class="book-viewing"
  >
    <v-lazy
      v-model="bookViewingSelectionLazyModel"
      transition="fade-transition"
      :options="{ threshold: 0.2 }"
    >
      <div class="book-viewing__selection">
        <div
          v-for="(url, i) in book.pages"
          :key="`book-page-${i}`"
          class="book-viewing__thumbnail-container"
        >
          <v-img
            :lazy-src="`${url}=w200`"
            :src="`${url}=w500`"
          />

          <div class="book-viewing__thumbnail-index">
            {{ i + 1 }}
          </div>
        </div>
      </div>
    </v-lazy>
  </div>
    <!-- {{ JSON.stringify(book) }} -->
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
  name: 'BooksPage',

  data: () => ({
    bookViewingSelectionLazyModel: false,
    book: null,
  }),

  computed: {
    ...mapState([
      'books',
      'pageState',
    ]),
  },

  async created() {
    if (!this.books.length) {
      await this.loadBooks();
    }

    const foundBook = this.books.find(({ url }) => url === this.$route.params.book);

    if (!foundBook) {
      this.SET_PAGE_STATE(new Error('The requested book was not found'));
    }

    if (!foundBook.pages) {
      await this.loadBookPages(foundBook.id);
    }

    this.book = foundBook;
  },

  mounted() {
    //
  },

  methods: {
    ...mapMutations([
      'SET_PAGE_STATE',
    ]),

    ...mapActions([
      'loadBookPages',
      'loadBooks',
    ]),
  },
};
</script>

<style scoped lang="scss">
  @import '~/assets/scss/pages/books/_book.scss';
</style>
