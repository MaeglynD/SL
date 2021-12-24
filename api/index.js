const express = require('express');

const app = express();

app.get('/test', (req, res) => {
  res.json({ you: 'suck' });
});

module.exports = {
  path: '/api',
  handler: app,
};
