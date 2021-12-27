<template>
  <div>
    Book viewing page {{ currentBook }}
  </div>
</template>

<script>
export default {
  name: 'BooksPage',
  data: () => ({
    currentBook: '',
  }),
  created() {
    this.currentBook = this.$route.params.book;
    console.log(this.$route);
  },
};
</script>
