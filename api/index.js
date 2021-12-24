// eslint-disable-next-line import/no-extraneous-dependencies
const axios = require('axios');
const express = require('express');
const books = require('./books');
const { albumRegex } = require('./utils');

const app = express();

app.get('/getImagesByAlbumId', async (req, res) => {
  let responseObject;

  try {
    const requestedId = parseInt(req.query.id, 10);
    const foundBook = books.find(({ id }) => id === requestedId);

    if (!foundBook) {
      throw new Error('The specified book id was not found');
    }

    const album = await axios.get(`https://photos.app.goo.gl/${foundBook.albumId}`);
    const links = [...album.data.matchAll(albumRegex)].map(([_, b]) => b);

    responseObject = { links };
  } catch (err) {
    responseObject = { error: err.toString() };
  } finally {
    res.json(responseObject);
  }
});

export default {
  path: '/api',
  handler: app,
};
