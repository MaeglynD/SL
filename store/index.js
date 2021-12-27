import { apiCallWrapper } from '../api/utils';

export const state = () => ({
  pageState: '',
  books: [],
});

export const getters = {
  //
};

export const mutations = {
  SET_BOOKS: (state, books) => {
    state.books = books;
  },

  SET_PAGES: (state, { bookId, data }) => {
    const foundBook = state.books.find(({ id }) => id === bookId);

    if (foundBook) {
      foundBook.pages = data;
    }
  },

  SET_PAGE_STATE: (state, pageState) => {
    if (pageState instanceof Error) {
      state.pageState = {
        state: 'error',
        error: pageState,
        errorMessage: `An error occured: ${pageState.toString()}`,
      };
    } else {
      state.pageState = { state: pageState };
    }
  },
};

export const actions = {
  async loadBooks(context) {
    const { commit } = context;

    await apiCallWrapper.call(this, context, '/api/getBooks', async (data) => {
      commit('SET_BOOKS', data);
    });
  },

  async loadBookPages(context, bookId) {
    const { commit } = context;

    await apiCallWrapper.call(this, context, `/api/getBookPages/?id=${bookId}`, async (data) => {
      commit('SET_PAGES', { bookId, data });
    });
  },
};
