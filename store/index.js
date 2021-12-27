import { apiCallWrapper } from '../api/utils';

export const state = () => ({
  pageState: '',
  books: [],
});

export const getters = {
  formattedPageState: ({ pageState }) => {
    if (pageState instanceof Error) {
      return {
        error: pageState,
        errorMessage: `An error occured: ${pageState.toString()}`,
      };
    }

    return pageState;
  },
};

export const mutations = {
  SET_BOOKS: (state, books) => {
    state.books = books;
  },

  SET_PAGES: (state, bookId, pages) => {
    const foundBook = state.find(({ id }) => id === bookId);

    if (foundBook) {
      foundBook.pages = pages;
    }
  },

  SET_PAGE_STATE: (state, pageState) => {
    state.pageState = pageState;
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
      commit('SET_PAGES', data);
    });
  },
};
