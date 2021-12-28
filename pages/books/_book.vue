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
        <simplebar data-simplebar-auto-hide="false">
          <div class="book-viewing__info">
            <div class="book-viewing__info-timespan">
              {{ getTimespan }}
            </div>

            <div class="book-viewing__info-description">
              {{ book.desc }}
            </div>

            <hr class="book-viewing__delim">
          </div>

          <div
            v-for="(url, i) in book.pages"
            :key="`book-page-${i}`"
            class=""
            :class="{
              'book-viewing__thumbnail-container': true,
              'book-viewing__thumbnail-container--active': url === page
            }"
          >
            <v-img
              v-ripple
              referrerpolicy="no-referrer"
              :lazy-src="`${url}=w200`"
              :src="`${url}=w500`"
              @click="setPage(url)"
            />

            <div class="book-viewing__thumbnail-index">
              {{ i + 1 }}
            </div>
          </div>
        </simplebar>
      </div>
    </v-lazy>

    <div
      ref="pageContainer"
      class="book-viewing__page-container"
    >
      <panZoom
        v-if="isPanZoomActive"
        :options="panZoomOptions"
      >
        <v-img
          transition="fade-transition"
          referrerpolicy="no-referrer"
          :lazy-src="`${page}=w200`"
          :src="`${page}=d`"
        />
      </panZoom>
    </div>
  </div>
</template>

<script>
import simplebar from 'simplebar-vue';
import 'simplebar/dist/simplebar.min.css';
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
  name: 'BooksPage',
  components: {
    simplebar,
  },

  data: () => ({
    isPanZoomActive: true,
    bookViewingSelectionLazyModel: false,
    book: null,
    page: '',
    panZoomOptions: {
      bounds: true,
      initialX: 400,
      initialY: 0,
      initialZoom: 0.9,
    },
  }),

  computed: {
    ...mapState([
      'books',
      'pageState',
    ]),

    getTimespan() {
      const { getMonthFromTimestamp, getYearFromTimestamp, book } = this;

      const start = getMonthFromTimestamp(book.startDate);
      const end = getMonthFromTimestamp(book.endDate);
      const year = getYearFromTimestamp(book.endDate);

      return `${start} ~ ${end} ${year}`;
    },
  },

  async created() {
    if (!this.books.length) {
      await this.loadBooks();
    }

    const foundBook = this.books.find(({ url }) => url === this.$route.params.book.toLowerCase());

    if (!foundBook) {
      this.SET_PAGE_STATE(new Error('The requested book was not found'));
      return;
    }

    if (!foundBook.pages) {
      await this.loadBookPages(foundBook.id);
    }

    this.book = foundBook;
    this.page = foundBook.pages[0];
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

    getYearFromTimestamp(timestamp) {
      return (new Date(timestamp)).toLocaleString('default', { year: 'numeric' });
    },

    getMonthFromTimestamp(timestamp) {
      return (new Date(timestamp)).toLocaleString('default', { month: 'short' });
    },

    setPage(url) {
      this.page = url;
      this.isPanZoomActive = false;

      this.$nextTick(() => {
        this.isPanZoomActive = true;
      });
    },
  },
};
</script>

<style scoped lang="scss" referrerpolicy="no-referrer">
  @import '~/assets/scss/pages/books/_book.scss';
</style>
