// eslint-disable-next-line import/no-extraneous-dependencies
const axios = require('axios');
const express = require('express');
const books = require('./books');
const { googlePhotosBaseUrl, bookCoversAlbumId, getImagesFromAlbum } = require('./utils');

const app = express();

app.get('/getBookPages', async (req, res) => {
  let responseObject;

  try {
    const requestedId = parseInt(req.query.id, 10);
    const foundBook = books.find(({ id }) => id === requestedId);

    if (!foundBook) {
      throw new Error('The specified book id was not found');
    }

    if (!foundBook.pages) {
      const album = await axios.get(`${googlePhotosBaseUrl}${foundBook.albumId}`);
      foundBook.pages = getImagesFromAlbum(album);
    }

    responseObject = foundBook.pages;
  } catch (err) {
    responseObject = { error: err.toString() };
  } finally {
    res.json(responseObject);
  }
});

app.get('/getBooks', async (req, res) => {
  let responseObject;

  try {
    if (!Object.prototype.hasOwnProperty.call(books[0], 'bookCoverUrl')) {
      const album = await axios.get(`${googlePhotosBaseUrl}${bookCoversAlbumId}`);
      const imagesFromAlbum = getImagesFromAlbum(album);

      books.forEach((book, i) => {
        book.bookCoverUrl = imagesFromAlbum[i];
      });
    }

    const booksWithAlbumIdOmitted = books.map(({ albumId, ...theRest }) => theRest);

    responseObject = booksWithAlbumIdOmitted;
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
