var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');

// Communication uniquement via l'API Gateway -> order-service
const GATEWAY_URL = process.env.GATEWAY_URL || 'http://localhost:9001';
const API = `${GATEWAY_URL}/orders`;

function orderPayload(body) {
  const payload = {
    customerName: body.customerName,
    orderDate: body.orderDate,
    status: body.status,
  };
  if (body.totalAmount !== undefined && body.totalAmount !== '') {
    payload.totalAmount = parseFloat(body.totalAmount);
  }
  return payload;
}

/* GET : liste des commandes + formulaire de creation. */
router.get('/', function (req, res, next) {
  fetch(API)
    .then((response) => response.json())
    .then((orders) => {
      res.render('orders/list', {
        title: 'Commandes',
        orders: orders,
        msg: req.query.msg,
      });
    })
    .catch(next);
});

/* GET : formulaire d'edition d'une commande. */
router.get('/:id/edit', function (req, res, next) {
  fetch(`${API}/${req.params.id}`)
    .then((response) => {
      if (!response.ok) throw new Error('Commande introuvable');
      return response.json();
    })
    .then((order) => {
      res.render('orders/edit', {title: 'Modifier la commande', order: order});
    })
    .catch(next);
});

/* POST : creation d'une commande. */
router.post('/add', function (req, res, next) {
  fetch(API, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(orderPayload(req.body)),
  })
    .then((response) => {
      if (!response.ok) throw new Error('Echec de la creation');
      return response.json();
    })
    .then(() => res.redirect('/orders?msg=created'))
    .catch(next);
});

/* POST : modification d'une commande (PATCH). */
router.post('/:id/edit', function (req, res, next) {
  fetch(`${API}/${req.params.id}`, {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(orderPayload(req.body)),
  })
    .then((response) => {
      if (!response.ok) throw new Error('Echec de la modification');
      res.redirect('/orders?msg=updated');
    })
    .catch(next);
});

/* POST : suppression d'une commande. */
router.post('/:id/delete', function (req, res, next) {
  fetch(`${API}/${req.params.id}`, {method: 'DELETE'})
    .then((response) => {
      if (!response.ok) throw new Error('Echec de la suppression');
      res.redirect('/orders?msg=deleted');
    })
    .catch(next);
});

module.exports = router;
