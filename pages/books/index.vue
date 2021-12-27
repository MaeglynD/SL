<template>
  <div>
    books page
    <div
      v-for="book in books"
      :key="book.id"
      :key-test="2"
    >
      {{ book.name }}
    </div>
    <v-btn
      color="success"
      @click="goToBook()"
    >
      click to go to specific book page
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
    ]),
    ...mapGetters([
      'formattedPageState',
    ]),
  },

  created() {
    //

  },

  async mounted() {
    await this.loadBooks();

    console.log(this.books);
  },

  methods: {

    ...mapActions([
      'loadBooks',
      'loadBookPages',
    ]),

    goToBook() {
      // this.$router.push('/books/test-title');
    },
  },
};
</script>
