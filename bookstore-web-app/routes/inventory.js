var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');

// URL du microservice loopback-bookstore.
// En local : http://localhost:3000 ; dans Docker : http://loopback-bookstore:3000
// (nom du container sur le reseau commun) via la variable d'environnement BACKEND_URL.
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';
const API = `${BACKEND_URL}/books`;

/* GET : liste de tous les livres (Read all).
 * Consomme GET /books de l'API LoopBack. */
router.get('/', function (req, res, next) {
  fetch(API)
    .then((response) => response.json())
    .then((books) => {
      // req.query.msg : message de confirmation optionnel (bonus)
      res.render('inventory', {
        title: 'Book Inventory',
        books: books,
        msg: req.query.msg,
      });
    })
    .catch(next);
});

/* GET : page de detail d'un livre (Consultation).
 * Consomme GET /books/{id} de l'API LoopBack. */
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

/* GET : formulaire d'edition pre-rempli (Update - etape 1).
 * Recupere le livre courant via GET /books/{id}. */
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

/* POST : creation d'un nouveau livre (Create).
 * Envoie POST /books a l'API LoopBack puis redirige vers la liste. */
router.post('/add', function (req, res, next) {
  fetch(API, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({title: req.body.title, author: req.body.author}),
  })
    .then((response) => {
      if (!response.ok) throw new Error('Echec de la creation');
      return response.json();
    })
    .then(() => res.redirect('/?msg=created'))
    .catch(next);
});

/* POST : mise a jour d'un livre (Update - etape 2).
 * Envoie PATCH /books/{id} a l'API LoopBack (mise a jour partielle). */
router.post('/edit/:id', function (req, res, next) {
  fetch(`${API}/${req.params.id}`, {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({title: req.body.title, author: req.body.author}),
  })
    .then((response) => {
      // PATCH renvoie 204 No Content : pas de corps a parser
      if (!response.ok) throw new Error('Echec de la modification');
      res.redirect('/?msg=updated');
    })
    .catch(next);
});

/* POST : suppression d'un livre (Delete).
 * Envoie DELETE /books/{id} a l'API LoopBack. */
router.post('/delete/:id', function (req, res, next) {
  fetch(`${API}/${req.params.id}`, {method: 'DELETE'})
    .then((response) => {
      // DELETE renvoie 204 No Content : pas de corps a parser
      if (!response.ok) throw new Error('Echec de la suppression');
      res.redirect('/?msg=deleted');
    })
    .catch(next);
});

module.exports = router;
