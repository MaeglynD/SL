<template>
  <div class="oeuvre">
    <div class="oeuvre__gradient-overlay" />

    <div class="oeuvre__header-container">
      <div
        class="oeuvre__header"
      >
        Oeuvre
        <div class="oeuvre__header-background-text">
          Oeuvre
        </div>
      </div>
    </div>

    <!-- Loading -->
    <transition name="fade-transition">
      <template v-if="pageState.state === 'loading'">
        <div class="oeuvre-loading__container">
          <div class="oeuvre-loading__image-list">
            <v-skeleton-loader
              v-for="i in 4"
              :key="`skeleton-image-${i}`"
              type="image, paragraph"
              class="oeuvre-loading__image-and-text"
            />
          </div>
        </div>
      </template>

      <!-- Error -->
      <template v-else-if="pageState.state === 'error'">
        <error-message />
      </template>

      <!-- Book list -->
      <template v-else>
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

            <div class="oeuvre__book-name">
              {{ name }}
            </div>

            <div class="oeuvre__book-desc">
              {{ desc }}
            </div>

            <div
              v-if="pages"
              class="oeuvre__book-page-count"
            >
              {{ (pages.length - 2) * 2 }} pages
            </div>
          </div>
        </div>
      </template>
    </transition>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'BooksPage',

  data: () => ({
    //
  }),

  head: () => ({
    title: 'Oeuvre',
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
