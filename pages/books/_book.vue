<template>
  <!-- Book list -->
  <div class="book-viewing book-viewing-loading">
    <template v-if="pageState.state === 'loading'">
      <div class="book-viewing__selection book-viewing-loading__selection">
        <v-skeleton-loader
          type="paragraph, divider"
        />
        <v-skeleton-loader
          v-for="i in 4"
          :key="`skeleton-book-viewing-selection-${i}`"
          type="image"
          class="book-viewing-loading__page-preview"
        />
      </div>

      <div class="book-viewing__page-container book-viewing-loading__page-container">
        <v-skeleton-loader
          class="book-viewing-loading__page"
          type="image"
        />
      </div>

      <div class="book-viewing__controls book-viewing-loading__controls">
        <v-skeleton-loader
          v-for="i in 4"
          :key="`skeleton-book-viewing-controls-${i}`"
          type="avatar"
        />
      </div>
    </template>

    <template v-else-if="pageState.state === 'error'">
      <error-message />
    </template>

    <template v-else>
      <v-lazy
        v-model="bookViewingSelectionLazyModel"
        transition="fade-transition"
        :options="{ threshold: 0.2 }"
      >
        <div class="book-viewing__selection">
          <transition name="slide-y-transition">
            <div
              v-if="showReturnToTop"
              class="book-viewing__return-to-top"
              @click="scrollSelectionToTop"
            >
              Return to top
            </div>
          </transition>

          <simplebar
            ref="selection"
            data-simplebar-auto-hide="false"
            @scroll="onSelectionScroll"
          >
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
              :class="{
                'book-viewing__thumbnail-container': true,
                'book-viewing__thumbnail-container--active': url === page
              }"
            >
              <v-img-no-referrer
                v-ripple
                referrerpolicy="no-referrer"
                :lazy-src="`${url}=w200`"
                :src="`${url}=w500`"
                min-height="130"
                @click="setPage(url)"
              >
                <template #placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="grey lighten-5"
                    />
                  </v-row>
                </template>
              </v-img-no-referrer>

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
          ref="panzoom"
          :options="panZoomOptions"
        >
          <v-img-no-referrer
            transition="fade-transition"
            referrerpolicy="no-referrer"
            :lazy-src="`${page}=w200`"
            :src="`${page}=d`"
          />
        </panZoom>

        <div class="book-viewing__controls">
          <v-tooltip
            v-for="({ icon, tooltip, fn }, i) in controls"
            :key="`control-${i}`"
            left
            transition="slide-x-reverse-transition"
            color="rgba(114,116,123, 0.7)"
          >
            <template #activator="{ on, attrs }">
              <v-btn
                icon
                :class="`
                book-viewing__controls-item
                book-viewing__conrols-item--${tooltip.split(' ').join('-')}
              `"
                elevation="2"
                v-bind="attrs"
                large
                dark
                v-on="on"
                @click="fn()"
              >
                <v-icon size="18">
                  {{ icon }}
                </v-icon>
              </v-btn>
            </template>

            <span>
              {{ tooltip }}
            </span>
          </v-tooltip>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import simplebar from 'simplebar-vue';
import 'simplebar/dist/simplebar.min.css';
import { debounce } from 'vue-debounce';
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
  name: 'BooksPage',

  components: {
    simplebar,
  },

  data: (vm) => ({
    page: '',
    isPanZoomActive: true,
    showReturnToTop: false,
    bookViewingSelectionLazyModel: false,
    book: {},
    panZoomOptions: {
      bounds: true,
      initialZoom: 0.9,
    },
    controls: [
      { icon: 'mdi-information-variant', tooltip: 'book information', fn: vm.showInfo },
      { icon: 'mdi-magnify-minus-outline', tooltip: 'zoom out', fn: () => vm.zoom(0.7) },
      { icon: 'mdi-magnify-plus-outline', tooltip: 'zoom in', fn: () => vm.zoom(1.5) },
      { icon: 'mdi-image-filter-center-focus', tooltip: 'reset orientation', fn: vm.resetOrientation },
      { icon: 'mdi-home', tooltip: 'return to bookshelf', fn: vm.goToBookShelf },
    ],
  }),

  head() {
    return {
      title: this.book?.name ? this.book.name : 'Loading...',
    };
  },

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

    showInfo() {
      //
    },

    zoom(scale) {
      const { offsetHeight, offsetWidth } = this.$refs.pageContainer;

      this.$refs.panzoom.$panZoomInstance.smoothZoom(offsetWidth / 2, offsetHeight / 2, scale);
    },

    resetOrientation() {
      this.setPage(this.page);
    },

    goToBookShelf() {
      this.$router.push('/books');
    },

    scrollSelectionToTop() {
      const el = this.$refs.selection?.SimpleBar?.contentWrapperEl;

      if (el) {
        el.scroll({
          top: 0,
          behavior: 'smooth',
        });
      }
    },

    // eslint-disable-next-line func-names
    onSelectionScroll: debounce(function ({ target: { scrollTop } }) {
      this.showReturnToTop = scrollTop > 400;
    }, 60),
  },
};
</script>

<style scoped lang="scss" referrerpolicy="no-referrer">
  @import '~/assets/scss/pages/books/_book.scss';
</style>
