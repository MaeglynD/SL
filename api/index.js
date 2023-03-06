require('dotenv').config();

const express = require('express');
const session = require('cookie-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const axios = require('axios');
const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

const books = require('./books');
const { googlePhotosBaseUrl, bookCoversAlbumId, getImagesFromAlbum } = require('./utils');

const app = express();

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const comparison = await bcrypt.compare(password, process.env.PW);

    if (!comparison) {
      return done(null, false);
    }

    return done(null, JSON.parse(Buffer.from(process.env.USER_DATA, 'base64').toString('utf-8')));
  } catch (err) {
    return done(err);
  }
}));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'production') {
  app.enable('trust proxy');
  app.set('trust proxy', 1);
}

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  proxy: true,
  saveUninitialized: true,
  maxAge: 1800000,
}));

app.use(passport.initialize());
app.use(passport.session());

const isAuthenticated = (req, res, next) => {
  return req.isAuthenticated() ? next() : res.sendStatus(401);
};

const jsonError = (err, req, res) => {
  res.status(err.status || 500).json(err);
};

app.post('/login', async (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).send({ success: false, message: 'Authentication failed' });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);

      return res.status(200).send({ success: true });
    });
  })(req, res, next);
}, jsonError);

app.post('/logout', (req, res) => {
  req.logout();
  res.sendStatus(200);
});

app.get('/getBookPages', isAuthenticated, async (req, res) => {
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
}, jsonError);

app.get('/getBooks', isAuthenticated, async (req, res) => {
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
}, jsonError);

export default {
  path: '/api',
  handler: app,
};
