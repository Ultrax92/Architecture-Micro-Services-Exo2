var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');

// Le front ne parle QU'A l'API Gateway (point d'entree unique).
// En Docker : http://api-gateway:9001 ; en local : http://localhost:9001
const GATEWAY_URL = process.env.GATEWAY_URL || 'http://localhost:9001';
// /inventory/* est route par la gateway vers l'inventory-service (ressource /books)
const API = `${GATEWAY_URL}/inventory/books`;

// Construit le payload livre en convertissant price/stock en nombres
function bookPayload(body) {
  const payload = {title: body.title, author: body.author};
  if (body.price !== undefined && body.price !== '') {
    payload.price = parseFloat(body.price);
  }
  if (body.stock !== undefined && body.stock !== '') {
    payload.stock = parseInt(body.stock, 10);
  }
  return payload;
}

/* GET : liste des livres (Read all). */
router.get('/', function (req, res, next) {
  fetch(API)
    .then((response) => response.json())
    .then((books) => {
      res.render('inventory', {
        title: 'Book Inventory',
        books: books,
        msg: req.query.msg,
      });
    })
    .catch(next);
});

/* GET : detail d'un livre (Consultation). */
router.get('/book/:id', function (req, res, next) {
  fetch(`${API}/${req.params.id}`)
    .then((response) => {
      if (!response.ok) throw new Error('Livre introuvable');
      return response.json();
    })
    .then((book) => {
      res.render('book', {title: 'Detail du livre', book: book});
    })
    .catch(next);
});

/* GET : formulaire d'edition pre-rempli (Update - etape 1). */
router.get('/edit/:id', function (req, res, next) {
  fetch(`${API}/${req.params.id}`)
    .then((response) => {
      if (!response.ok) throw new Error('Livre introuvable');
      return response.json();
    })
    .then((book) => {
      res.render('edit', {title: 'Modifier le livre', book: book});
    })
    .catch(next);
});

/* POST : creation d'un livre (Create). */
router.post('/add', function (req, res, next) {
  fetch(API, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(bookPayload(req.body)),
  })
    .then((response) => {
      if (!response.ok) throw new Error('Echec de la creation');
      return response.json();
    })
    .then(() => res.redirect('/?msg=created'))
    .catch(next);
});

/* POST : mise a jour d'un livre (Update - etape 2 -> PATCH). */
router.post('/edit/:id', function (req, res, next) {
  fetch(`${API}/${req.params.id}`, {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(bookPayload(req.body)),
  })
    .then((response) => {
      if (!response.ok) throw new Error('Echec de la modification');
      res.redirect('/?msg=updated');
    })
    .catch(next);
});

/* POST : suppression d'un livre (Delete). */
router.post('/delete/:id', function (req, res, next) {
  fetch(`${API}/${req.params.id}`, {method: 'DELETE'})
    .then((response) => {
      if (!response.ok) throw new Error('Echec de la suppression');
      res.redirect('/?msg=deleted');
    })
    .catch(next);
});

module.exports = router;
