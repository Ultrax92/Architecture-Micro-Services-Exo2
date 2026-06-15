var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');

// URL du microservice loopback-bookstore.
// En local : http://localhost:3000 ; dans Docker : http://loopback-bookstore:3000
// (nom du container sur le reseau commun) via la variable d'environnement BACKEND_URL.
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

/* GET book inventory page. */
router.get('/', function (req, res, next) {
  fetch(`${BACKEND_URL}/books`)
    .then((response) => response.json())
    .then((books) => {
      res.render('inventory', {title: 'Book Inventory', books: books});
    })
    .catch(next);
});

/* POST add a new book. */
router.post('/add', function (req, res, next) {
  fetch(`${BACKEND_URL}/books`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({title: req.body.title, author: req.body.author}),
  })
    .then((response) => response.json())
    .then(() => res.redirect('/'))
    .catch(next);
});

module.exports = router;
