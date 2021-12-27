const googlePhotosBaseUrl = 'https://photos.app.goo.gl/';
const bookCoversAlbumId = 'R26Nu3Q5W3xwDnf7A';

const getImagesFromAlbum = (album) => [...album.data.matchAll(/\["(https:\/\/lh3\.googleusercontent\.com\/[a-zA-Z0-9\-_]*)"/g)].map(([_, b]) => b).slice(0, -1);

async function apiCallWrapper({ commit }, requestUrl, requestLogic) {
  try {
    commit('SET_PAGE_STATE', 'loading');

    const { data, error } = await this.$axios.get(requestUrl);

    if (error) {
      throw new Error(`Server Error: ${error}`);
    }

    await requestLogic(data);

    commit('SET_PAGE_STATE', '');
  } catch (err) {
    commit('SET_PAGE_STATE', err);
  }
}

module.exports = {
  bookCoversAlbumId,
  googlePhotosBaseUrl,
  getImagesFromAlbum,
  apiCallWrapper,
};
