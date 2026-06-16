var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');

// Communication uniquement via l'API Gateway -> payment-service
const GATEWAY_URL = process.env.GATEWAY_URL || 'http://localhost:9001';
const API = `${GATEWAY_URL}/payments`;

function paymentPayload(body) {
  const payload = {
    orderId: body.orderId,
    paymentDate: body.paymentDate,
    paymentMethod: body.paymentMethod,
    status: body.status,
  };
  if (body.amount !== undefined && body.amount !== '') {
    payload.amount = parseFloat(body.amount);
  }
  return payload;
}

/* GET : liste des paiements + formulaire de creation. */
router.get('/', function (req, res, next) {
  fetch(API)
    .then((response) => response.json())
    .then((payments) => {
      res.render('payments/list', {
        title: 'Paiements',
        payments: payments,
        msg: req.query.msg,
      });
    })
    .catch(next);
});

/* GET : formulaire d'edition d'un paiement. */
router.get('/:id/edit', function (req, res, next) {
  fetch(`${API}/${req.params.id}`)
    .then((response) => {
      if (!response.ok) throw new Error('Paiement introuvable');
      return response.json();
    })
    .then((payment) => {
      res.render('payments/edit', {
        title: 'Modifier le paiement',
        payment: payment,
      });
    })
    .catch(next);
});

/* POST : creation d'un paiement. */
router.post('/add', function (req, res, next) {
  fetch(API, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(paymentPayload(req.body)),
  })
    .then((response) => {
      if (!response.ok) throw new Error('Echec de la creation');
      return response.json();
    })
    .then(() => res.redirect('/payments?msg=created'))
    .catch(next);
});

/* POST : modification d'un paiement (PATCH). */
router.post('/:id/edit', function (req, res, next) {
  fetch(`${API}/${req.params.id}`, {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(paymentPayload(req.body)),
  })
    .then((response) => {
      if (!response.ok) throw new Error('Echec de la modification');
      res.redirect('/payments?msg=updated');
    })
    .catch(next);
});

/* POST : suppression d'un paiement. */
router.post('/:id/delete', function (req, res, next) {
  fetch(`${API}/${req.params.id}`, {method: 'DELETE'})
    .then((response) => {
      if (!response.ok) throw new Error('Echec de la suppression');
      res.redirect('/payments?msg=deleted');
    })
    .catch(next);
});

module.exports = router;
